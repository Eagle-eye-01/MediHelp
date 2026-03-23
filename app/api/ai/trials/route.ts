import { NextResponse } from "next/server";

import { callGemini } from "@/lib/gemini";
import { isGeminiConfigured } from "@/lib/supabase";
import { cleanJsonResponse } from "@/lib/utils";
import type { TrialResult } from "@/types";

const CLINICAL_TRIALS_API_BASE = "https://clinicaltrials.gov/api/v2/studies";
const INDIA_COUNTRY = "India";

type TrialLanguage = "English" | "Tamil" | "Hindi";

type ClinicalTrialsStudy = {
  protocolSection?: {
    identificationModule?: {
      nctId?: string;
      briefTitle?: string;
      officialTitle?: string;
    };
    statusModule?: {
      overallStatus?: string;
    };
    descriptionModule?: {
      briefSummary?: string;
      detailedDescription?: string;
    };
    conditionsModule?: {
      conditions?: string[];
    };
    sponsorCollaboratorsModule?: {
      leadSponsor?: {
        name?: string;
      };
    };
    contactsLocationsModule?: {
      centralContacts?: Array<{
        name?: string;
        phone?: string;
        email?: string;
      }>;
      locations?: Array<{
        facility?: string;
        city?: string;
        state?: string;
        country?: string;
        contacts?: Array<{
          name?: string;
          phone?: string;
          email?: string;
        }>;
      }>;
    };
    eligibilityModule?: {
      minimumAge?: string;
      maximumAge?: string;
      sex?: string;
      standardAges?: string[];
      eligibilityCriteria?: string;
    };
  };
};

const localizedCopy = {
  English: {
    statusUnavailable: "Status unavailable",
    locationPending: "Location to be confirmed",
    contactPending: "See official study page for contact details",
    sponsorMissing: "Sponsor not listed",
    minAge: "Min age",
    maxAge: "Max age",
    sex: "Sex",
    recruiting: "Recruiting",
    notYetRecruiting: "Not yet recruiting",
    indiaOnlyError: "No India-based recruiting trials matched that search."
  },
  Tamil: {
    statusUnavailable: "நிலை கிடைக்கவில்லை",
    locationPending: "இடம் பின்னர் உறுதிப்படுத்தப்படும்",
    contactPending: "தொடர்பு விவரங்களுக்கு அதிகாரப்பூர்வ ஆய்வு பக்கத்தை பார்க்கவும்",
    sponsorMissing: "ஆதரவாளர் விவரம் இல்லை",
    minAge: "குறைந்தபட்ச வயது",
    maxAge: "அதிகபட்ச வயது",
    sex: "பாலினம்",
    recruiting: "சேர்க்கை நடைபெறுகிறது",
    notYetRecruiting: "சேர்க்கை இன்னும் தொடங்கவில்லை",
    indiaOnlyError: "இந்த தேடலுக்கு பொருந்தும் இந்திய ஆய்வுகள் கிடைக்கவில்லை."
  },
  Hindi: {
    statusUnavailable: "स्थिति उपलब्ध नहीं है",
    locationPending: "स्थान की पुष्टि होना बाकी है",
    contactPending: "संपर्क विवरण के लिए आधिकारिक अध्ययन पेज देखें",
    sponsorMissing: "प्रायोजक उपलब्ध नहीं",
    minAge: "न्यूनतम आयु",
    maxAge: "अधिकतम आयु",
    sex: "लिंग",
    recruiting: "भर्ती जारी है",
    notYetRecruiting: "भर्ती अभी शुरू नहीं हुई",
    indiaOnlyError: "इस खोज के लिए उपयुक्त भारत-आधारित ट्रायल नहीं मिला।"
  }
} as const;

function parseAge(value?: string) {
  if (!value || value.toLowerCase() === "n/a") return null;

  const match = value.match(/(\d+)\s*(year|month|week|day)/i);
  if (!match) return null;

  const amount = Number(match[1]);
  const unit = match[2].toLowerCase();

  if (unit.startsWith("year")) return amount;
  if (unit.startsWith("month")) return amount / 12;
  if (unit.startsWith("week")) return amount / 52;
  if (unit.startsWith("day")) return amount / 365;

  return null;
}

function normalizeText(value?: string | null) {
  return value?.trim().toLowerCase() || "";
}

function getLocations(study: ClinicalTrialsStudy) {
  return study.protocolSection?.contactsLocationsModule?.locations || [];
}

function isIndiaStudy(study: ClinicalTrialsStudy) {
  return getLocations(study).some(
    (location) => normalizeText(location.country) === normalizeText(INDIA_COUNTRY)
  );
}

function pickBestLocation(study: ClinicalTrialsStudy, city: string, language: TrialLanguage) {
  const copy = localizedCopy[language];
  const locations = getLocations(study);
  const cityMatch =
    locations.find((location) => normalizeText(location.city).includes(normalizeText(city))) ||
    locations.find((location) => normalizeText(location.country) === normalizeText(INDIA_COUNTRY)) ||
    locations[0];

  if (!cityMatch) {
    return copy.locationPending;
  }

  return [cityMatch.facility, cityMatch.city, cityMatch.state, cityMatch.country]
    .filter(Boolean)
    .join(", ");
}

function pickBestContact(study: ClinicalTrialsStudy, language: TrialLanguage) {
  const copy = localizedCopy[language];
  const centralContact = study.protocolSection?.contactsLocationsModule?.centralContacts?.[0];
  const locationContact = getLocations(study)[0]?.contacts?.[0];
  const contact = centralContact || locationContact;

  if (!contact) {
    return copy.contactPending;
  }

  return [contact.name, contact.phone, contact.email].filter(Boolean).join(" • ");
}

function buildEligibilitySummary(study: ClinicalTrialsStudy, language: TrialLanguage) {
  const copy = localizedCopy[language];
  const eligibility = study.protocolSection?.eligibilityModule;

  return [
    eligibility?.minimumAge ? `${copy.minAge}: ${eligibility.minimumAge}` : null,
    eligibility?.maximumAge ? `${copy.maxAge}: ${eligibility.maximumAge}` : null,
    eligibility?.sex ? `${copy.sex}: ${eligibility.sex}` : null
  ]
    .filter(Boolean)
    .join(" • ");
}

function localizeStatus(status: string, language: TrialLanguage) {
  const copy = localizedCopy[language];

  if (status === "RECRUITING") return copy.recruiting;
  if (status === "NOT_YET_RECRUITING") return copy.notYetRecruiting;
  return status || copy.statusUnavailable;
}

function computeMatchScore(
  study: ClinicalTrialsStudy,
  condition: string,
  city: string,
  ageRange: [number, number]
) {
  const midpoint = (ageRange[0] + ageRange[1]) / 2;
  const status = study.protocolSection?.statusModule?.overallStatus || "";
  const title =
    study.protocolSection?.identificationModule?.briefTitle ||
    study.protocolSection?.identificationModule?.officialTitle ||
    "";
  const conditions = study.protocolSection?.conditionsModule?.conditions || [];
  const locations = getLocations(study);
  const minAge = parseAge(study.protocolSection?.eligibilityModule?.minimumAge);
  const maxAge = parseAge(study.protocolSection?.eligibilityModule?.maximumAge);

  let score = 60;

  if (isIndiaStudy(study)) score += 12;
  if (status.toUpperCase().includes("RECRUITING")) score += 12;
  if (title.toLowerCase().includes(condition.toLowerCase())) score += 8;
  if (conditions.some((item) => item.toLowerCase().includes(condition.toLowerCase()))) score += 8;
  if (locations.some((location) => normalizeText(location.city).includes(normalizeText(city)))) score += 8;

  const minOkay = minAge === null || midpoint >= minAge;
  const maxOkay = maxAge === null || midpoint <= maxAge;
  if (minOkay && maxOkay) score += 8;

  return Math.max(60, Math.min(99, score));
}

function normalizeStudy(
  study: ClinicalTrialsStudy,
  condition: string,
  city: string,
  ageRange: [number, number],
  language: TrialLanguage
): TrialResult | null {
  const copy = localizedCopy[language];
  const nctId = study.protocolSection?.identificationModule?.nctId;
  const trialName =
    study.protocolSection?.identificationModule?.briefTitle ||
    study.protocolSection?.identificationModule?.officialTitle;

  if (!trialName || !isIndiaStudy(study)) {
    return null;
  }

  const description =
    study.protocolSection?.descriptionModule?.briefSummary ||
    study.protocolSection?.descriptionModule?.detailedDescription ||
    "Clinical trial details are available on the official study page.";

  return {
    nctId,
    trialName,
    matchScore: computeMatchScore(study, condition, city, ageRange),
    status: localizeStatus(study.protocolSection?.statusModule?.overallStatus || "", language),
    location: pickBestLocation(study, city, language),
    contact: pickBestContact(study, language),
    description,
    sponsor: study.protocolSection?.sponsorCollaboratorsModule?.leadSponsor?.name || copy.sponsorMissing,
    eligibilitySummary: buildEligibilitySummary(study, language),
    trialUrl: nctId ? `https://clinicaltrials.gov/study/${nctId}` : undefined
  };
}

async function fetchStudies(condition: string, city: string) {
  const queryVariants = [
    { "query.cond": condition, "query.locn": `${city} ${INDIA_COUNTRY}` },
    { "query.cond": condition, "query.locn": INDIA_COUNTRY }
  ];

  const allStudies: ClinicalTrialsStudy[] = [];
  const seen = new Set<string>();

  for (const query of queryVariants) {
    const params = new URLSearchParams({
      ...query,
      "filter.overallStatus": "RECRUITING|NOT_YET_RECRUITING",
      pageSize: "20",
      format: "json"
    });

    const response = await fetch(`${CLINICAL_TRIALS_API_BASE}?${params.toString()}`, {
      headers: { accept: "application/json" },
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error(`Clinical trials service returned ${response.status}`);
    }

    const payload = await response.json();
    const studies = Array.isArray(payload?.studies) ? payload.studies : [];

    for (const study of studies) {
      const nctId =
        study?.protocolSection?.identificationModule?.nctId ||
        JSON.stringify(study?.protocolSection?.identificationModule || {});

      if (!seen.has(nctId)) {
        seen.add(nctId);
        allStudies.push(study);
      }
    }

    if (allStudies.length >= 12) {
      break;
    }
  }

  return allStudies;
}

async function translateNarrativeFields(trials: TrialResult[], language: TrialLanguage) {
  if (language === "English" || !trials.length || !isGeminiConfigured()) {
    return trials;
  }

  try {
    const rawText = await callGemini(
      [
        `Translate the following clinical trial card content into ${language}.`,
        "Keep JSON keys unchanged.",
        "Do not translate NCT ids, URLs, phone numbers, emails, city names, or drug names incorrectly.",
        "Translate these fields only when present: trialName, description, contact, sponsor, eligibilitySummary, status, location.",
        "Return valid JSON only.",
        JSON.stringify(trials)
      ].join(" ")
    );

    const translated = JSON.parse(cleanJsonResponse(rawText));

    if (!Array.isArray(translated) || translated.length !== trials.length) {
      return trials;
    }

    return translated as TrialResult[];
  } catch {
    return trials;
  }
}

export async function POST(request: Request) {
  try {
    const { condition, city, ageRange, language } = await request.json();

    if (!condition) {
      return NextResponse.json({ error: "Condition is required" }, { status: 400 });
    }

    const normalizedCity = city || "Chennai";
    const normalizedLanguage = (language || "English") as TrialLanguage;
    const normalizedAgeRange: [number, number] = Array.isArray(ageRange)
      ? [Number(ageRange[0] || 18), Number(ageRange[1] || 80)]
      : [18, 80];

    const studies = await fetchStudies(condition, normalizedCity);

    const trials = studies
      .map((study) =>
        normalizeStudy(study, condition, normalizedCity, normalizedAgeRange, normalizedLanguage)
      )
      .filter((trial): trial is TrialResult => Boolean(trial))
      .sort((a: TrialResult, b: TrialResult) => b.matchScore - a.matchScore)
      .slice(0, 12);

    const localizedTrials = await translateNarrativeFields(trials, normalizedLanguage);

    return NextResponse.json({
      trials: localizedTrials,
      emptyMessage: localizedCopy[normalizedLanguage].indiaOnlyError
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to retrieve clinical trials right now."
      },
      { status: 502 }
    );
  }
}
