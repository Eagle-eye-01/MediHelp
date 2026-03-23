import type { MedicalDocument } from "@/types";

type PreviewSection = {
  title: string;
  lines: string[];
};

type PreviewTemplate = {
  label: string;
  subtitle: string;
  highlights: string[];
  sections: PreviewSection[];
};

const previewTemplates: Record<string, PreviewTemplate> = {
  "ananya_iron-deficiency_2026-02-09": {
    label: "CBC report",
    subtitle: "Outpatient hematology review",
    highlights: ["Hemoglobin 10.8 g/dL", "Ferritin 13 ng/mL", "MCV mildly low"],
    sections: [
      {
        title: "Clinical note",
        lines: [
          "Patient reports fatigue during college hours and occasional light-headedness after skipping breakfast.",
          "No fever, bleeding history, or recent acute illness noted during sample collection."
        ]
      },
      {
        title: "Lab observations",
        lines: [
          "Hemoglobin is below reference range, consistent with mild iron deficiency.",
          "Ferritin remains low, suggesting reduced iron stores rather than temporary fluctuation.",
          "White blood cell count and platelet count are within normal limits."
        ]
      },
      {
        title: "Recommended plan",
        lines: [
          "Continue oral iron supplement once daily after food for six weeks.",
          "Repeat CBC and ferritin after follow-up visit to confirm recovery trend."
        ]
      }
    ]
  },
  "ananya_thyroid-screening_2026-02-27": {
    label: "Thyroid profile",
    subtitle: "Routine endocrine screening panel",
    highlights: ["TSH 2.31 uIU/mL", "Free T4 normal", "No immediate intervention"],
    sections: [
      {
        title: "Clinical note",
        lines: [
          "Screening ordered due to family history of hypothyroidism and mild hair fall over the last month.",
          "No weight instability, palpitations, or cold intolerance reported."
        ]
      },
      {
        title: "Panel summary",
        lines: [
          "TSH, Free T3, and Free T4 fall within standard laboratory reference ranges.",
          "Current values do not suggest active hypothyroidism or hyperthyroidism."
        ]
      },
      {
        title: "Follow-up advice",
        lines: [
          "Maintain annual thyroid screening unless symptoms change earlier.",
          "Repeat testing sooner if fatigue, menstrual irregularity, or unexplained weight change develops."
        ]
      }
    ]
  },
  "ananya_vitamin-d_2026-03-11": {
    label: "Vitamin D assay",
    subtitle: "Preventive wellness panel",
    highlights: ["25-OH Vitamin D 22 ng/mL", "Borderline low", "Supplement review advised"],
    sections: [
      {
        title: "Clinical note",
        lines: [
          "Patient describes low energy, indoor study schedule, and limited sun exposure during weekdays.",
          "No acute musculoskeletal injury, but diffuse body aches were reported."
        ]
      },
      {
        title: "Panel summary",
        lines: [
          "Vitamin D is below the optimal range and aligns with insufficiency rather than severe deficiency.",
          "Calcium and phosphorus are within normal limits."
        ]
      },
      {
        title: "Suggested next steps",
        lines: [
          "Discuss once-weekly supplementation regimen with primary physician.",
          "Encourage consistent morning sunlight exposure for 20 to 30 minutes where possible."
        ]
      }
    ]
  },
  "ananya_hba1c_followup_2026-01-18": {
    label: "HbA1c follow-up",
    subtitle: "Metabolic monitoring report",
    highlights: ["HbA1c 6.1%", "Average glucose mildly elevated", "Lifestyle response improving"],
    sections: [
      {
        title: "Clinical note",
        lines: [
          "Follow-up requested after three months of structured meal planning and increased walking schedule.",
          "Patient reports improved consistency with breakfast timing and hydration."
        ]
      },
      {
        title: "Lab interpretation",
        lines: [
          "HbA1c remains in the prediabetes range but has improved compared with the prior baseline.",
          "Fasting glucose trend suggests ongoing benefit from lifestyle measures."
        ]
      },
      {
        title: "Care plan",
        lines: [
          "Continue current nutrition and physical activity plan.",
          "Repeat HbA1c in three months and review medication need only if trend reverses."
        ]
      }
    ]
  },
  "ananya_lipid_panel_2025-12-03": {
    label: "Lipid profile",
    subtitle: "Cardiometabolic screening",
    highlights: ["LDL 128 mg/dL", "HDL 52 mg/dL", "Triglycerides controlled"],
    sections: [
      {
        title: "Clinical note",
        lines: [
          "Panel performed during annual preventive review with no active cardiovascular symptoms.",
          "Family history is positive for hypertension in first-degree relatives."
        ]
      },
      {
        title: "Lab interpretation",
        lines: [
          "LDL cholesterol is borderline elevated and should continue to be monitored.",
          "HDL and triglyceride values are stable and favorable."
        ]
      },
      {
        title: "Recommended plan",
        lines: [
          "Continue moderate exercise and reduce high-saturated-fat meals during the week.",
          "Repeat lipid profile at next annual review or sooner if new risk factors appear."
        ]
      }
    ]
  },
  "ananya_prescription_resp_2026-03-02": {
    label: "Prescription note",
    subtitle: "Primary care consultation",
    highlights: ["Levocetirizine nightly", "Steam inhalation", "Review in 5 days if unresolved"],
    sections: [
      {
        title: "Presenting complaint",
        lines: [
          "Seasonal cough, throat irritation, and early-morning congestion for four days.",
          "No high fever, no wheeze at rest, and oxygen saturation recorded as stable in clinic."
        ]
      },
      {
        title: "Medication instructions",
        lines: [
          "Levocetirizine 5 mg once at night for five days.",
          "Inhalation support and saline gargles advised for symptomatic relief."
        ]
      },
      {
        title: "Follow-up",
        lines: [
          "Seek review if cough persists beyond five days or breathing difficulty develops.",
          "Continue hydration and avoid exposure to dust-heavy environments."
        ]
      }
    ]
  },
  "ananya_cbc_followup_2026-03-20": {
    label: "CBC follow-up",
    subtitle: "Repeat hematology review",
    highlights: ["Hemoglobin 11.4 g/dL", "Improving trend", "Continue supplementation"],
    sections: [
      {
        title: "Clinical note",
        lines: [
          "Repeat CBC ordered after six weeks of iron supplementation.",
          "Patient reports reduced fatigue and fewer dizzy spells during the last two weeks."
        ]
      },
      {
        title: "Lab interpretation",
        lines: [
          "Hemoglobin has improved from the previous reading, supporting treatment response.",
          "Indices still suggest continued recovery rather than complete correction."
        ]
      },
      {
        title: "Plan",
        lines: [
          "Continue current supplement course and iron-rich diet.",
          "Repeat ferritin with next review to confirm replenishment of iron stores."
        ]
      }
    ]
  }
};

export function getDocumentPreview(document: MedicalDocument): PreviewTemplate {
  const template = previewTemplates[document.file_name];

  if (template) {
    return template;
  }

  const condition = document.disease_name || "general medical review";
  const patient = document.patient_name || "the patient";

  return {
    label: document.file_type.includes("pdf") ? "Medical record" : "Scanned note",
    subtitle: "Generated record overview",
    highlights: [
      condition,
      document.file_type.includes("pdf") ? "Structured document" : "Uploaded scan",
      `Captured ${new Date(document.upload_date).toLocaleDateString("en-IN")}`
    ],
    sections: [
      {
        title: "Patient context",
        lines: [
          `${patient} uploaded this document to track ${condition.toLowerCase()}.`,
          "The file has been organized in MediHelp and is available for quick review."
        ]
      },
      {
        title: "AI summary",
        lines: [
          document.ai_summary || "No AI summary is available yet for this document.",
          "Use this preview as a readable summary until the original document viewer is expanded further."
        ]
      },
      {
        title: "Recommended follow-up",
        lines: [
          "Keep the record linked with future lab results, prescriptions, or consultations for better care continuity.",
          "Review the document with a clinician before making treatment changes."
        ]
      }
    ]
  };
}
