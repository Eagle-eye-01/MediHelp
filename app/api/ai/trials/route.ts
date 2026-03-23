import { NextResponse } from "next/server";

import { callGemini } from "@/lib/gemini";
import { isGeminiConfigured } from "@/lib/supabase";
import { cleanJsonResponse } from "@/lib/utils";
import type { TrialResult } from "@/types";

const CLINICAL_TRIALS_API_BASE = "https://clinicaltrials.gov/api/v2/studies";

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
      centralContactList?: Array<{
        name?: string;
        phone?: string;
        email?: string;
      }>;
      locationList?: Array<{
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

function parseAge(value?: string) {
  if (!value) return null;
  if (value.toLowerCase() === "n/a") return null;

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

function computeMatchScore(study: ClinicalTrialsStudy, condition: string, city: string, ageRange: [number, number]) {
  const midpoint = (ageRange[0] + ageRange[1]) / 2;
  const status = study.protocolSection?.statusModule?.overallStatus || "";
  const title =
    study.protocolSection?.identificationModule?.briefTitle ||
    study.protocolSection?.identificationModule?.officialTitle ||
    "";
  const conditions = study.protocolSection?.conditionsModule?.conditions || [];
  const locations = study.protocolSection?.contactsLocationsModule?.locationList || [];
  const minAge = parseAge(study.protocolSection?.eligibilityModule?.minimumAge);
  const maxAge = parseAge(study.protocolSection?.eligibilityModule?.maximumAge);

  let score = 68;

  if (status.toUpperCase().includes("RECRUITING")) score += 14;
  if (title.toLowerCase().includes(condition.toLowerCase())) score += 6;
  if (conditions.some((item) => item.toLowerCase().includes(condition.toLowerCase()))) score += 6;
  if (locations.some((location) => location.city?.toLowerCase().includes(city.toLowerCase()))) score += 4;

  const minOkay = minAge === null || midpoint >= minAge;
  const maxOkay = maxAge === null || midpoint <= maxAge;
  if (minOkay && maxOkay) {
    score += 6;
  }

  return Math.max(60, Math.min(99, score));
}

function pickLocation(study: ClinicalTrialsStudy, city: string) {
  const locations = study.protocolSection?.contactsLocationsModule?.locationList || [];
  const match =
    locations.find((location) => location.city?.toLowerCase().includes(city.toLowerCase())) ||
    locations[0];

  if (!match) {
    return "Location to be confirmed";
  }

  return [match.facility, match.city, match.state, match.country].filter(Boolean).join(", ");
}

function pickContact(study: ClinicalTrialsStudy) {
  const centralContact = study.protocolSection?.contactsLocationsModule?.centralContactList?.[0];
  const locationContact =
    study.protocolSection?.contactsLocationsModule?.locationList?.[0]?.contacts?.[0];
  const contact = centralContact || locationContact;

  if (!contact) {
    return "See official study page for contact details";
  }

  return [contact.name, contact.phone, contact.email].filter(Boolean).join(" • ");
}

function normalizeStudy(
  study: ClinicalTrialsStudy,
  condition: string,
  city: string,
  ageRange: [number, number]
): TrialResult | null {
  const nctId = study.protocolSection?.identificationModule?.nctId;
  const trialName =
    study.protocolSection?.identificationModule?.briefTitle ||
    study.protocolSection?.identificationModule?.officialTitle;

  if (!trialName) {
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
    status: study.protocolSection?.statusModule?.overallStatus || "Status unavailable",
    location: pickLocation(study, city),
    contact: pickContact(study),
    description,
    sponsor: study.protocolSection?.sponsorCollaboratorsModule?.leadSponsor?.name || "Sponsor not listed",
    eligibilitySummary: [
      study.protocolSection?.eligibilityModule?.minimumAge
        ? `Min age: ${study.protocolSection.eligibilityModule.minimumAge}`
        : null,
      study.protocolSection?.eligibilityModule?.maximumAge
        ? `Max age: ${study.protocolSection.eligibilityModule.maximumAge}`
        : null,
      study.protocolSection?.eligibilityModule?.sex
        ? `Sex: ${study.protocolSection.eligibilityModule.sex}`
        : null
    ]
      .filter(Boolean)
      .join(" • "),
    trialUrl: nctId ? `https://clinicaltrials.gov/study/${nctId}` : undefined
  };
}

function localizeFixedTrialFields(trials: TrialResult[], language: string) {
  if (language === "Tamil") {
    return trials.map((trial) => ({
      ...trial,
      status:
        trial.status === "RECRUITING"
          ? "சேர்க்கை நடைபெறுகிறது"
          : trial.status === "NOT_YET_RECRUITING"
            ? "சேர்க்கை இன்னும் தொடங்கவில்லை"
            : trial.status,
      location:
        trial.location === "Location to be confirmed"
          ? "இடம் பின்னர் உறுதிப்படுத்தப்படும்"
          : trial.location,
      contact:
        trial.contact === "See official study page for contact details"
          ? "தொடர்பு விவரங்களுக்கு அதிகாரப்பூர்வ ஆய்வு பக்கத்தை பார்க்கவும்"
          : trial.contact,
      sponsor:
        trial.sponsor === "Sponsor not listed" ? "ஆதரவாளர் விவரம் இல்லை" : trial.sponsor
    }));
  }

  if (language === "Hindi") {
    return trials.map((trial) => ({
      ...trial,
      status:
        trial.status === "RECRUITING"
          ? "भर्ती जारी है"
          : trial.status === "NOT_YET_RECRUITING"
            ? "भर्ती अभी शुरू नहीं हुई"
            : trial.status,
      location:
        trial.location === "Location to be confirmed"
          ? "स्थान की पुष्टि होना बाकी है"
          : trial.location,
      contact:
        trial.contact === "See official study page for contact details"
          ? "संपर्क विवरण के लिए आधिकारिक अध्ययन पेज देखें"
          : trial.contact,
      sponsor:
        trial.sponsor === "Sponsor not listed" ? "प्रायोजक उपलब्ध नहीं" : trial.sponsor
    }));
  }

  return trials;
}

async function translateTrials(trials: TrialResult[], language: string) {
  if (language === "English" || !trials.length) {
    return trials;
  }

  const fixedLocalized = localizeFixedTrialFields(trials, language);

  if (!isGeminiConfigured()) {
    return fixedLocalized;
  }

  try {
    const rawText = await callGemini(
      `Translate the following clinical trial data into ${language}. Keep NCT ids, drug names, numbers, URLs, phone numbers, and medical terminology accurate. Return JSON only, preserving the exact array shape and keys. Input: ${JSON.stringify(
        fixedLocalized
      )}`
    );

    const translated = JSON.parse(cleanJsonResponse(rawText));
    if (!Array.isArray(translated) || translated.length !== fixedLocalized.length) {
      return fixedLocalized;
    }

    return translated as TrialResult[];
  } catch {
    return fixedLocalized;
  }
}

export async function POST(request: Request) {
  try {
    const { condition, city, ageRange, language } = await request.json();

    if (!condition) {
      return NextResponse.json({ error: "Condition is required" }, { status: 400 });
    }

    const normalizedCity = city || "Bangalore";
    const normalizedLanguage = language || "English";
    const normalizedAgeRange: [number, number] = Array.isArray(ageRange)
      ? [Number(ageRange[0] || 18), Number(ageRange[1] || 80)]
      : [18, 80];

    const params = new URLSearchParams({
      "query.cond": condition,
      "query.locn": `${normalizedCity} India`,
      "filter.overallStatus": "RECRUITING|NOT_YET_RECRUITING",
      pageSize: "12",
      format: "json"
    });

    const response = await fetch(`${CLINICAL_TRIALS_API_BASE}?${params.toString()}`, {
      headers: {
        accept: "application/json"
      },
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error(`Clinical trials service returned ${response.status}`);
    }

    const payload = await response.json();
    const studies = Array.isArray(payload?.studies) ? payload.studies : [];

    const trials = studies
      .map((study: ClinicalTrialsStudy) =>
        normalizeStudy(study, condition, normalizedCity, normalizedAgeRange)
      )
      .filter(Boolean)
      .sort((a: TrialResult, b: TrialResult) => b.matchScore - a.matchScore);

    const localizedTrials = await translateTrials(trials, normalizedLanguage);

    return NextResponse.json({ trials: localizedTrials });
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
