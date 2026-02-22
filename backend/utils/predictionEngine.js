// ─────────────────────────────────────────────────────────────
// HealthGuard AI – Rules-Based Disease Prediction Engine
// Maps symptom keywords → diseases with risk scores,
// confidence levels, and preventive measures.
// ─────────────────────────────────────────────────────────────

const diseaseDatabase = [
    {
        name: "Type 2 Diabetes",
        keywords: ["fatigue", "frequent urination", "thirst", "blurred vision", "weight loss", "hunger", "slow healing", "tingling", "numbness"],
        ageFactor: { min: 30, riskBoost: 10 },
        genderFactor: null,
        baseRisk: 35,
        preventive: [
            "Exercise at least 30 minutes daily",
            "Reduce sugar and refined carbohydrate intake",
            "Get HbA1c and fasting blood sugar tests",
            "Maintain a healthy body weight",
            "Monitor blood glucose levels regularly",
        ],
    },
    {
        name: "Hypertension",
        keywords: ["headache", "dizziness", "chest pain", "shortness of breath", "nosebleed", "fatigue", "vision problems", "palpitations"],
        ageFactor: { min: 35, riskBoost: 12 },
        genderFactor: { gender: "Male", riskBoost: 5 },
        baseRisk: 30,
        preventive: [
            "Reduce sodium intake to less than 2,300mg per day",
            "Exercise regularly (150 min/week moderate activity)",
            "Limit alcohol consumption",
            "Monitor blood pressure at home",
            "Manage stress through meditation or yoga",
        ],
    },
    {
        name: "Common Cold / Influenza",
        keywords: ["fever", "cough", "sore throat", "runny nose", "body aches", "chills", "sneezing", "congestion", "headache"],
        ageFactor: null,
        genderFactor: null,
        baseRisk: 25,
        preventive: [
            "Rest and stay hydrated",
            "Take vitamin C and zinc supplements",
            "Wash hands frequently",
            "Get annual flu vaccination",
            "Avoid close contact with sick individuals",
        ],
    },
    {
        name: "Asthma",
        keywords: ["wheezing", "shortness of breath", "chest tightness", "cough", "difficulty breathing", "breathlessness"],
        ageFactor: null,
        genderFactor: null,
        baseRisk: 30,
        preventive: [
            "Avoid known triggers (dust, pollen, smoke)",
            "Use prescribed inhalers as directed",
            "Keep indoor air clean with air purifiers",
            "Get regular pulmonary function tests",
            "Create an asthma action plan with your doctor",
        ],
    },
    {
        name: "Migraine",
        keywords: ["severe headache", "headache", "nausea", "sensitivity to light", "sensitivity to sound", "aura", "vomiting", "throbbing pain"],
        ageFactor: null,
        genderFactor: { gender: "Female", riskBoost: 8 },
        baseRisk: 28,
        preventive: [
            "Identify and avoid personal triggers",
            "Maintain regular sleep schedule",
            "Stay well-hydrated throughout the day",
            "Practice stress management techniques",
            "Consult a neurologist for preventive medication",
        ],
    },
    {
        name: "Gastroesophageal Reflux Disease (GERD)",
        keywords: ["heartburn", "acid reflux", "chest pain", "difficulty swallowing", "regurgitation", "bloating", "nausea", "stomach pain"],
        ageFactor: { min: 30, riskBoost: 5 },
        genderFactor: null,
        baseRisk: 25,
        preventive: [
            "Avoid spicy, fatty, and acidic foods",
            "Eat smaller, more frequent meals",
            "Don't lie down within 3 hours after eating",
            "Elevate the head of your bed 6-8 inches",
            "Maintain a healthy weight",
        ],
    },
    {
        name: "Anemia",
        keywords: ["fatigue", "weakness", "pale skin", "dizziness", "cold hands", "cold feet", "shortness of breath", "headache", "brittle nails"],
        ageFactor: null,
        genderFactor: { gender: "Female", riskBoost: 10 },
        baseRisk: 25,
        preventive: [
            "Increase iron-rich foods (spinach, red meat, beans)",
            "Take iron and vitamin B12 supplements",
            "Get complete blood count (CBC) test",
            "Include vitamin C to improve iron absorption",
            "Consult a doctor for underlying causes",
        ],
    },
    {
        name: "Anxiety Disorder",
        keywords: ["anxiety", "nervousness", "restlessness", "rapid heartbeat", "sweating", "trembling", "insomnia", "panic", "worry", "irritability"],
        ageFactor: null,
        genderFactor: { gender: "Female", riskBoost: 5 },
        baseRisk: 30,
        preventive: [
            "Practice deep breathing and meditation daily",
            "Exercise regularly to reduce stress hormones",
            "Limit caffeine and alcohol intake",
            "Seek cognitive behavioral therapy (CBT)",
            "Maintain strong social connections",
        ],
    },
    {
        name: "Urinary Tract Infection (UTI)",
        keywords: ["burning urination", "frequent urination", "cloudy urine", "pelvic pain", "strong urine odor", "urgency", "blood in urine"],
        ageFactor: null,
        genderFactor: { gender: "Female", riskBoost: 15 },
        baseRisk: 30,
        preventive: [
            "Drink plenty of water (8+ glasses daily)",
            "Urinate frequently and don't hold it in",
            "Wipe from front to back",
            "Avoid irritating feminine products",
            "See a doctor for antibiotics if symptoms persist",
        ],
    },
    {
        name: "Allergic Rhinitis",
        keywords: ["sneezing", "runny nose", "itchy eyes", "watery eyes", "congestion", "itchy nose", "postnasal drip"],
        ageFactor: null,
        genderFactor: null,
        baseRisk: 20,
        preventive: [
            "Use antihistamines as recommended",
            "Keep windows closed during high pollen days",
            "Use HEPA air filters indoors",
            "Shower after outdoor activities",
            "Consider allergy immunotherapy for long-term relief",
        ],
    },
    {
        name: "Depression",
        keywords: ["sadness", "hopelessness", "loss of interest", "fatigue", "insomnia", "weight change", "difficulty concentrating", "irritability", "worthlessness"],
        ageFactor: null,
        genderFactor: { gender: "Female", riskBoost: 5 },
        baseRisk: 28,
        preventive: [
            "Seek professional counseling or therapy",
            "Exercise regularly – even 30 min walks help",
            "Maintain a regular sleep schedule",
            "Stay connected with friends and family",
            "Consider speaking to a psychiatrist about medication",
        ],
    },
    {
        name: "Coronary Artery Disease",
        keywords: ["chest pain", "shortness of breath", "fatigue", "palpitations", "dizziness", "nausea", "sweating", "arm pain", "jaw pain"],
        ageFactor: { min: 40, riskBoost: 15 },
        genderFactor: { gender: "Male", riskBoost: 8 },
        baseRisk: 35,
        preventive: [
            "Follow a heart-healthy diet (low saturated fat)",
            "Exercise at least 150 minutes per week",
            "Quit smoking immediately",
            "Get regular cholesterol and blood pressure checks",
            "Take prescribed medications consistently",
        ],
    },
    {
        name: "Thyroid Disorder",
        keywords: ["fatigue", "weight gain", "weight loss", "cold intolerance", "heat intolerance", "hair loss", "dry skin", "mood swings", "tremors"],
        ageFactor: { min: 30, riskBoost: 5 },
        genderFactor: { gender: "Female", riskBoost: 10 },
        baseRisk: 25,
        preventive: [
            "Get TSH blood test annually",
            "Ensure adequate iodine intake",
            "Monitor symptoms and report changes to doctor",
            "Take thyroid medication as prescribed",
            "Avoid excessive soy and cruciferous vegetables if hypothyroid",
        ],
    },
    {
        name: "Pneumonia",
        keywords: ["fever", "cough", "chest pain", "shortness of breath", "fatigue", "chills", "phlegm", "difficulty breathing", "sweating"],
        ageFactor: { min: 50, riskBoost: 15 },
        genderFactor: null,
        baseRisk: 30,
        preventive: [
            "Get pneumococcal and flu vaccines",
            "Practice good hand hygiene",
            "Don't smoke – it damages lung defenses",
            "Seek prompt treatment for respiratory infections",
            "Maintain a strong immune system through nutrition",
        ],
    },
    {
        name: "Arthritis",
        keywords: ["joint pain", "stiffness", "swelling", "reduced range of motion", "fatigue", "joint redness", "warmth in joints", "morning stiffness"],
        ageFactor: { min: 40, riskBoost: 15 },
        genderFactor: { gender: "Female", riskBoost: 5 },
        baseRisk: 25,
        preventive: [
            "Maintain a healthy weight to reduce joint stress",
            "Exercise regularly with low-impact activities",
            "Apply hot/cold therapy for pain relief",
            "Include omega-3 fatty acids in your diet",
            "Consult a rheumatologist for early treatment",
        ],
    },
];

/**
 * Analyze symptoms and return disease prediction
 * @param {Object} params - { age: number, gender: string, symptoms: string[] }
 * @returns {Object} - { disease, riskScore, confidence, preventive }
 */
export function analyzeSymptoms({ age, gender, symptoms }) {
    // Normalize symptoms to lowercase
    const normalizedSymptoms = symptoms.map((s) => s.trim().toLowerCase());

    let bestMatch = null;
    let bestScore = 0;

    for (const disease of diseaseDatabase) {
        let matchCount = 0;
        const diseaseKeywords = disease.keywords.map((k) => k.toLowerCase());

        // Count how many symptom keywords match
        for (const symptom of normalizedSymptoms) {
            for (const keyword of diseaseKeywords) {
                if (symptom.includes(keyword) || keyword.includes(symptom)) {
                    matchCount++;
                    break;
                }
            }
        }

        if (matchCount === 0) continue;

        // Calculate match ratio
        const matchRatio = matchCount / diseaseKeywords.length;

        // Calculate risk score
        let riskScore = disease.baseRisk + matchRatio * 40;

        // Apply age factor
        if (disease.ageFactor && age >= disease.ageFactor.min) {
            riskScore += disease.ageFactor.riskBoost;
        }

        // Apply gender factor
        if (disease.genderFactor && gender === disease.genderFactor.gender) {
            riskScore += disease.genderFactor.riskBoost;
        }

        // Boost if many symptoms match
        if (matchCount >= 3) riskScore += 10;
        if (matchCount >= 5) riskScore += 10;

        // Cap at 95
        riskScore = Math.min(Math.round(riskScore), 95);

        // Calculate confidence based on match ratio
        const confidence = Math.min(Math.round(matchRatio * 100 + matchCount * 5), 95);

        const score = riskScore * 0.6 + confidence * 0.4;

        if (score > bestScore) {
            bestScore = score;
            bestMatch = {
                disease: disease.name,
                riskScore,
                confidence,
                preventive: disease.preventive,
            };
        }
    }

    // If no match found, return generic result
    if (!bestMatch) {
        return {
            disease: "No specific condition identified",
            riskScore: 15,
            confidence: 20,
            preventive: [
                "Maintain a balanced diet with fruits and vegetables",
                "Exercise at least 30 minutes daily",
                "Stay hydrated – drink 8 glasses of water",
                "Get 7-8 hours of quality sleep",
                "Schedule a general health checkup with your doctor",
            ],
        };
    }

    return bestMatch;
}
