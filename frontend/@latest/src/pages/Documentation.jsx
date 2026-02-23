import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Disease Data ───────────────────────────────────────────── */
const diseases = [
    {
        id: "diabetes",
        title: "Diabetes (Type 1 & Type 2)",
        icon: "🩸",
        image: "/images/diabetes.png",
        color: "from-blue-500 to-cyan-400",
        colorAccent: "blue-400",
        bgAccent: "blue-500/10",
        borderAccent: "blue-500/20",
        definition:
            "Diabetes mellitus is a chronic metabolic disorder characterized by persistent hyperglycemia (elevated blood glucose levels) resulting from defects in insulin secretion, insulin action, or both. Insulin is a hormone produced by the beta cells of the pancreas, essential for regulating blood glucose uptake into cells for energy.",
        types: [
            {
                name: "Type 1 Diabetes",
                desc: "An autoimmune condition where the immune system destroys insulin-producing beta cells in the pancreas. Typically diagnosed in children and young adults. Patients require lifelong insulin therapy.",
            },
            {
                name: "Type 2 Diabetes",
                desc: "The most common form (~90-95% of cases). The body becomes resistant to insulin or the pancreas fails to produce sufficient insulin. Strongly associated with obesity, sedentary lifestyle, and genetic predisposition.",
            },
            {
                name: "Gestational Diabetes",
                desc: "Develops during pregnancy when hormonal changes impair insulin sensitivity. Usually resolves postpartum but increases future Type 2 risk.",
            },
        ],
        causes: [
            "Type 1: Autoimmune destruction of beta cells; genetic susceptibility (HLA genes)",
            "Type 2: Insulin resistance + beta-cell dysfunction; obesity (BMI ≥ 30)",
            "Family history and genetic predisposition",
            "Sedentary lifestyle and physical inactivity",
            "Unhealthy diet high in processed sugars and saturated fats",
            "Ethnicity (higher prevalence in South Asian, African, Hispanic populations)",
            "Age (Type 2 risk increases after 45 years)",
            "History of gestational diabetes or polycystic ovary syndrome",
        ],
        symptoms: [
            "Polyuria (frequent urination)",
            "Polydipsia (excessive thirst)",
            "Polyphagia (increased hunger)",
            "Unexplained weight loss (especially Type 1)",
            "Fatigue and weakness",
            "Blurred vision",
            "Slow wound healing",
            "Tingling or numbness in hands/feet (peripheral neuropathy)",
            "Recurrent infections (skin, urinary, vaginal)",
        ],
        effects: [
            "Diabetic Retinopathy — damage to retinal blood vessels, leading to blindness",
            "Diabetic Nephropathy — progressive kidney damage; leading cause of end-stage renal disease",
            "Diabetic Neuropathy — nerve damage causing pain, numbness, and digestive issues",
            "Cardiovascular Disease — 2-4x higher risk of heart attack and stroke",
            "Peripheral Arterial Disease — reduced blood flow to extremities; risk of amputation",
            "Diabetic Ketoacidosis (DKA) — life-threatening complication of Type 1",
            "Hyperosmolar Hyperglycemic State (HHS) — severe dehydration in Type 2",
        ],
        prevention: [
            "Maintain a healthy weight (BMI 18.5–24.9)",
            "Engage in ≥ 150 minutes/week of moderate-intensity physical activity",
            "Follow a balanced diet rich in fiber, whole grains, fruits, and vegetables",
            "Limit sugar-sweetened beverages and processed foods",
            "Monitor blood glucose levels regularly (for at-risk individuals)",
            "Avoid tobacco use",
            "Annual screening for individuals over 45 or with risk factors",
        ],
        precautions: [
            "Monitor blood glucose levels as prescribed (fasting, postprandial, HbA1c)",
            "Take medications/insulin as directed; never skip doses",
            "Follow a structured meal plan with consistent carbohydrate counting",
            "Inspect feet daily for cuts, blisters, or infections",
            "Stay hydrated; avoid excessive alcohol consumption",
            "Carry a diabetes identification card/bracelet",
            "Keep glucose tablets or juice readily available for hypoglycemia",
            "Schedule regular eye, kidney, and cardiovascular check-ups",
        ],
        statistics: [
            "537 million adults (20–79 years) living with diabetes globally (IDF Diabetes Atlas, 2021)",
            "Projected to rise to 783 million by 2045",
            "6.7 million deaths attributed to diabetes in 2021",
            "Over $966 billion in global health expenditure on diabetes",
            "1 in 2 adults with diabetes remain undiagnosed",
            "India, China, and the USA have the highest absolute numbers",
        ],
        publicHealth:
            "Diabetes is one of the fastest-growing health challenges of the 21st century, with low- and middle-income countries disproportionately affected. The IDF estimates that diabetes accounts for 9% of total global health expenditure. Rising rates of childhood obesity are driving an alarming increase in Type 2 diabetes among younger populations.",
    },
    {
        id: "pcos",
        title: "Polycystic Ovary Syndrome (PCOS)",
        icon: "🔬",
        image: "/images/pcos.png",
        color: "from-purple-500 to-pink-400",
        colorAccent: "purple-400",
        bgAccent: "purple-500/10",
        borderAccent: "purple-500/20",
        definition:
            "Polycystic Ovary Syndrome (PCOS) is a common endocrine disorder affecting women of reproductive age, characterized by a combination of hyperandrogenism (excess male hormones), ovulatory dysfunction, and polycystic ovarian morphology. It is the leading cause of anovulatory infertility worldwide.",
        types: [
            {
                name: "Type A (Classic PCOS)",
                desc: "Presents with hyperandrogenism, ovulatory dysfunction, AND polycystic ovaries on ultrasound. The most severe phenotype with higher metabolic risk.",
            },
            {
                name: "Type B (Classic Non-PCO)",
                desc: "Hyperandrogenism + ovulatory dysfunction WITHOUT polycystic ovarian morphology.",
            },
            {
                name: "Type C (Ovulatory PCOS)",
                desc: "Hyperandrogenism + polycystic ovaries, but WITH regular ovulation.",
            },
            {
                name: "Type D (Non-Hyperandrogenic)",
                desc: "Ovulatory dysfunction + polycystic ovaries WITHOUT clinical/biochemical hyperandrogenism. Mildest phenotype.",
            },
        ],
        causes: [
            "Exact etiology unknown; multifactorial hormone imbalance",
            "Excess androgen production by the ovaries and adrenal glands",
            "Insulin resistance (present in 50-70% of PCOS patients)",
            "Genetic predisposition (familial clustering observed)",
            "Chronic low-grade inflammation",
            "Obesity and excess adipose tissue (amplifies hormonal imbalance)",
            "Environmental factors (endocrine disruptors, stress)",
        ],
        symptoms: [
            "Irregular or absent menstrual periods (oligomenorrhea/amenorrhea)",
            "Hirsutism (excess hair growth on face, chest, abdomen)",
            "Acne and oily skin",
            "Alopecia (thinning hair on the scalp)",
            "Weight gain, particularly central/abdominal obesity",
            "Difficulty conceiving (anovulatory infertility)",
            "Darkening of skin (acanthosis nigricans) — neck, groin, underarms",
            "Mood disorders (anxiety, depression)",
            "Pelvic pain",
        ],
        effects: [
            "Infertility — leading cause of anovulatory infertility, requiring ovulation induction",
            "Type 2 Diabetes — 4x higher risk due to insulin resistance",
            "Metabolic Syndrome — cluster of cardiovascular risk factors",
            "Endometrial Hyperplasia/Cancer — from chronic anovulation and unopposed estrogen",
            "Obstructive Sleep Apnea — higher prevalence, especially with obesity",
            "Non-Alcoholic Fatty Liver Disease (NAFLD)",
            "Depression and Anxiety — significantly higher prevalence vs. general population",
            "Gestational complications — pre-eclampsia, gestational diabetes, preterm birth",
        ],
        prevention: [
            "No known prevention for PCOS itself (genetic + hormonal etiology)",
            "Early detection through awareness of symptoms signs",
            "Maintaining healthy weight reduces severity of symptoms",
            "Regular physical activity improves insulin sensitivity",
            "Balanced diet low in refined carbohydrates",
            "Screening first-degree relatives for metabolic abnormalities",
            "Stress management and adequate sleep",
        ],
        precautions: [
            "Follow prescribed medication regimen (metformin, oral contraceptives, anti-androgens)",
            "Monitor glucose and lipid levels regularly",
            "Maintain a low-glycemic-index diet to manage insulin resistance",
            "Exercise regularly (≥ 30 minutes, 5 days/week)",
            "Track menstrual cycles and ovulation patterns",
            "Screen for endometrial abnormalities if prolonged amenorrhea",
            "Address mental health concerns; seek counseling if needed",
            "Plan pregnancies with medical guidance for ovulation support",
        ],
        statistics: [
            "Affects 8–13% of women of reproductive age globally (WHO, 2023)",
            "Up to 70% of affected women remain undiagnosed worldwide",
            "Prevalence ranges from 6% (community studies) to 20% (using Rotterdam criteria)",
            "Women with PCOS have 4x higher risk of developing Type 2 Diabetes",
            "50–80% of women with PCOS are overweight or obese",
            "Annual healthcare costs ~$8 billion in the USA alone",
        ],
        publicHealth:
            "PCOS is a significantly under-recognized condition globally, with delayed diagnosis averaging 2+ years. WHO declared PCOS a health priority in 2023. The condition's link to metabolic syndrome, diabetes, and cardiovascular disease makes it a lifecycle health issue extending far beyond reproductive concerns.",
    },
    {
        id: "hypertension",
        title: "Hypertension (High Blood Pressure)",
        icon: "💓",
        image: "/images/hypertension.png",
        color: "from-red-500 to-orange-400",
        colorAccent: "red-400",
        bgAccent: "red-500/10",
        borderAccent: "red-500/20",
        definition:
            'Hypertension is a chronic cardiovascular condition defined by persistently elevated arterial blood pressure. Clinically, it is diagnosed when systolic blood pressure (SBP) is ≥ 140 mmHg and/or diastolic blood pressure (DBP) is ≥ 90 mmHg (WHO criteria). It is termed the "silent killer" because it often presents without symptoms until end-organ damage has occurred.',
        types: [
            {
                name: "Primary (Essential) Hypertension",
                desc: "Accounts for 90–95% of all cases. No identifiable underlying cause; develops gradually over years due to a complex interplay of genetic, environmental, and lifestyle factors.",
            },
            {
                name: "Secondary Hypertension",
                desc: "Caused by an identifiable medical condition: renal disease (renovascular, parenchymal), endocrine disorders (pheochromocytoma, Cushing's, hyperaldosteronism), coarctation of aorta, or medications (NSAIDs, oral contraceptives).",
            },
            {
                name: "White-Coat Hypertension",
                desc: "Elevated BP in a clinical setting but normal ambulatory readings. Still associated with increased cardiovascular risk.",
            },
            {
                name: "Resistant Hypertension",
                desc: "BP remaining above target despite ≥ 3 antihypertensive medications at optimal doses, including a diuretic.",
            },
        ],
        causes: [
            "High sodium intake (> 5g salt/day; WHO recommendation)",
            "Obesity and excess body fat (BMI ≥ 30)",
            "Physical inactivity and sedentary lifestyle",
            "Excessive alcohol consumption",
            "Chronic stress and poor sleep",
            "Genetic predisposition and family history",
            "Age (arterial stiffening with aging)",
            "Chronic kidney disease",
            "Smoking and tobacco use",
            "Medications (NSAIDs, decongestants, oral contraceptives)",
        ],
        symptoms: [
            "Often asymptomatic — the 'silent killer'",
            "Severe headaches (especially occipital, in hypertensive crises)",
            "Dizziness and lightheadedness",
            "Blurred or double vision",
            "Nosebleeds (epistaxis)",
            "Shortness of breath (dyspnea)",
            "Chest pain or discomfort",
            "Fatigue and confusion",
            "Blood in urine (hematuria) in advanced cases",
        ],
        effects: [
            "Stroke — leading cause of cerebrovascular accidents (ischemic and hemorrhagic)",
            "Heart Failure — left ventricular hypertrophy → reduced cardiac output",
            "Coronary Artery Disease — accelerated atherosclerosis",
            "Chronic Kidney Disease — glomerular damage → progressive renal failure",
            "Retinopathy — hypertensive changes in retinal vasculature",
            "Peripheral Arterial Disease",
            "Aortic Aneurysm — weakening of the aortic wall",
            "Vascular Dementia — chronic cerebral hypoperfusion",
        ],
        prevention: [
            "Reduce sodium intake to < 5g/day (WHO recommendation)",
            "Follow the DASH diet (Dietary Approaches to Stop Hypertension)",
            "Maintain a healthy weight; lose 1 kg → ~1 mmHg BP reduction",
            "Regular aerobic exercise: 150 min/week moderate or 75 min/week vigorous",
            "Limit alcohol to ≤ 2 standard drinks/day (men) or ≤ 1 (women)",
            "Quit smoking and avoid secondhand smoke",
            "Manage stress through mindfulness, meditation, or yoga",
            "Screen BP regularly: annually for adults ≥ 18 years",
        ],
        precautions: [
            "Take antihypertensive medications at the same time daily",
            "Monitor blood pressure at home with a validated device",
            "Reduce caffeine intake if sensitive",
            "Avoid sudden positional changes (to prevent orthostatic hypotension)",
            "Report side effects of medications promptly",
            "Keep emergency medication accessible for hypertensive crises",
            "Follow up with a physician every 3–6 months",
            "Limit over-the-counter medications that raise BP (NSAIDs, decongestants)",
        ],
        statistics: [
            "1.28 billion adults aged 30–79 years have hypertension worldwide (WHO, 2023)",
            "Only 1 in 5 hypertensive adults have it under control",
            "Nearly 46% of adults with hypertension are unaware of their condition",
            "Hypertension is the leading modifiable risk factor for cardiovascular death",
            "Responsible for ~10.8 million deaths per year globally",
            "Prevalence highest in Africa (27%) and lowest in the Americas (18%)",
        ],
        publicHealth:
            "Hypertension remains the single greatest contributor to global mortality and disability. The WHO HEARTS initiative aims to improve management in primary care settings. Despite available, affordable treatments, fewer than 25% of hypertensive patients in low-income countries achieve blood pressure control, creating a massive treatment gap.",
    },
    {
        id: "heartdisease",
        title: "Heart Disease (Cardiovascular Disease)",
        icon: "❤️‍🩹",
        image: "/images/heart_disease.png",
        color: "from-rose-500 to-red-400",
        colorAccent: "rose-400",
        bgAccent: "rose-500/10",
        borderAccent: "rose-500/20",
        definition:
            "Heart disease (or cardiovascular disease, CVD) encompasses a group of disorders affecting the heart and blood vessels. The most common form is coronary artery disease (CAD), caused by atherosclerotic plaque buildup in the coronary arteries, reducing blood flow to the myocardium. CVD is the #1 cause of death globally.",
        types: [
            {
                name: "Coronary Artery Disease (CAD)",
                desc: "Atherosclerotic narrowing/blocking of coronary arteries. Manifests as angina, myocardial infarction (heart attack), or sudden cardiac death.",
            },
            {
                name: "Heart Failure (HF)",
                desc: "The heart's inability to pump blood efficiently. Can be HFrEF (reduced ejection fraction) or HFpEF (preserved ejection fraction).",
            },
            {
                name: "Arrhythmias",
                desc: "Irregular heart rhythms: atrial fibrillation (AFib), ventricular tachycardia, bradycardia. AFib alone affects ~59 million people globally.",
            },
            {
                name: "Valvular Heart Disease",
                desc: "Stenosis or regurgitation of heart valves (aortic, mitral, tricuspid, pulmonary). Can be congenital or acquired (rheumatic).",
            },
            {
                name: "Congenital Heart Disease",
                desc: "Structural heart defects present at birth (e.g., VSD, ASD, Tetralogy of Fallot). Affects ~1% of live births globally.",
            },
        ],
        causes: [
            "Atherosclerosis: plaque buildup (cholesterol, fat, calcium) in arterial walls",
            "Hypertension (the leading modifiable risk factor)",
            "Hyperlipidemia: elevated LDL cholesterol and triglycerides",
            "Smoking and tobacco use: 2x increased CVD risk",
            "Diabetes mellitus: 2–4x increased heart disease risk",
            "Obesity and metabolic syndrome",
            "Physical inactivity",
            "Unhealthy diet (high in trans fats, sodium, processed foods)",
            "Family history of premature CVD (males < 55, females < 65)",
            "Chronic stress, depression, and social isolation",
        ],
        symptoms: [
            "Chest pain or pressure (angina) — may radiate to arm, jaw, neck",
            "Shortness of breath (dyspnea) on exertion or at rest",
            "Palpitations (awareness of heartbeat; irregular, fast, or skipped beats)",
            "Fatigue and exercise intolerance",
            "Dizziness, lightheadedness, or syncope (fainting)",
            "Swelling in legs, ankles, and feet (peripheral edema)",
            "Rapid or irregular pulse",
            "Nausea, sweating, or cold sweats (especially during MI)",
            "Women may experience atypical symptoms: unusual fatigue, nausea, back/jaw pain",
        ],
        effects: [
            "Myocardial Infarction (Heart Attack) — death of heart muscle tissue",
            "Heart Failure — progressive decline in cardiac function",
            "Stroke — thromboembolic events from AF or carotid disease",
            "Peripheral Artery Disease — reduced blood flow to limbs",
            "Sudden Cardiac Death — fatal arrhythmia",
            "Cardiomyopathy — weakening/enlargement of heart muscle",
            "Deep Vein Thrombosis / Pulmonary Embolism",
            "Chronic disability and reduced quality of life",
        ],
        prevention: [
            "Quit smoking: CVD risk drops 50% within 1 year of cessation",
            "Follow a heart-healthy diet (Mediterranean / DASH diet)",
            "Regular physical activity: ≥ 150 min/week moderate aerobic exercise",
            "Maintain healthy weight (BMI 18.5–24.9) and waist circumference",
            "Control blood pressure (target < 130/80 mmHg per AHA guidelines)",
            "Manage cholesterol: LDL < 100 mg/dL (< 70 for high-risk patients)",
            "Control blood glucose (HbA1c < 7% for diabetics)",
            "Limit alcohol, manage stress, and ensure adequate sleep (7–9 hrs)",
            "Statin therapy for high-risk individuals as per clinical guidelines",
        ],
        precautions: [
            "Take cardiac medications exactly as prescribed (statins, antiplatelets, beta-blockers)",
            "Monitor blood pressure, heart rate, and weight daily if in heart failure",
            "Recognize warning signs of heart attack: call emergency services immediately",
            "Carry prescribed nitroglycerin or aspirin for emergencies",
            "Avoid extreme exertion; follow cardiac rehabilitation programs",
            "Limit sodium intake to < 2,000 mg/day (heart failure patients)",
            "Attend all follow-up appointments and cardiac imaging as scheduled",
            "Wear a medical alert bracelet if on anticoagulants",
        ],
        statistics: [
            "CVD is the #1 cause of death globally: 17.9 million deaths/year (WHO, 2023)",
            "Accounts for 32% of all global deaths",
            "85% of CVD deaths are due to heart attacks and strokes",
            "Over 520 million people are living with CVD worldwide",
            "Low- and middle-income countries account for > 75% of CVD deaths",
            "CVD costs ~$407 billion/year in the United States alone (AHA, 2024)",
        ],
        publicHealth:
            "Cardiovascular disease remains the world's leading killer. The AHA's 2030 Impact Goal targets improving cardiovascular health by 20% while reducing CVD deaths by 20%. Despite major advances in treatment, prevention remains under-prioritized, especially in low-resource settings where 4 out of 5 CVD deaths occur.",
    },
];

/* ─── Section Component ──────────────────────────────────────── */
function Section({ title, icon, children, accent }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className={`mb-6 rounded-2xl border border-${accent || "white/8"} bg-white/[0.02] p-6`}
        >
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2.5">
                <span className="text-xl">{icon}</span>
                {title}
            </h3>
            {children}
        </motion.div>
    );
}

/* ─── Bullet List ────────────────────────────────────────────── */
function BulletList({ items, color }) {
    return (
        <ul className="space-y-2.5">
            {items.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-300 text-sm leading-relaxed">
                    <span className={`mt-1.5 w-1.5 h-1.5 rounded-full bg-${color || "teal-400"} flex-shrink-0`} />
                    {item}
                </li>
            ))}
        </ul>
    );
}

/* ─── Statistic Card ─────────────────────────────────────────── */
function StatCard({ value, label }) {
    return (
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 text-center">
            <div className="text-2xl font-extrabold text-teal-400">{value}</div>
            <div className="text-xs text-gray-400 mt-1">{label}</div>
        </div>
    );
}

/* ─── Table of Contents Sidebar ──────────────────────────────── */
function TOCSidebar({ activeDisease }) {
    return (
        <div className="hidden xl:block sticky top-24 w-56 flex-shrink-0">
            <div className="glass-card rounded-2xl border border-white/10 p-5">
                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Contents</h4>
                <nav className="space-y-1.5">
                    {diseases.map((d) => (
                        <a
                            key={d.id}
                            href={`#${d.id}`}
                            className={`block px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeDisease === d.id
                                    ? "bg-teal-500/15 text-teal-400"
                                    : "text-gray-400 hover:text-white hover:bg-white/5"
                                }`}
                        >
                            <span className="mr-2">{d.icon}</span>
                            {d.id === "diabetes"
                                ? "Diabetes"
                                : d.id === "pcos"
                                    ? "PCOS"
                                    : d.id === "hypertension"
                                        ? "Hypertension"
                                        : "Heart Disease"}
                        </a>
                    ))}
                    <div className="w-full h-px bg-white/10 my-2" />
                    <a
                        href="#conclusion"
                        className={`block px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeDisease === "conclusion"
                                ? "bg-teal-500/15 text-teal-400"
                                : "text-gray-400 hover:text-white hover:bg-white/5"
                            }`}
                    >
                        📊 Conclusion
                    </a>
                    <a
                        href="#references"
                        className={`block px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeDisease === "references"
                                ? "bg-teal-500/15 text-teal-400"
                                : "text-gray-400 hover:text-white hover:bg-white/5"
                            }`}
                    >
                        📚 References
                    </a>
                </nav>
            </div>
        </div>
    );
}

/* ─── Disease Card (Full Expansion) ──────────────────────────── */
function DiseaseCard({ disease }) {
    const [expanded, setExpanded] = useState(false);
    const d = disease;

    return (
        <motion.div
            id={d.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="scroll-mt-24"
        >
            <div className={`glass-card rounded-3xl border border-white/10 overflow-hidden`}>
                {/* Header */}
                <div className={`bg-gradient-to-r ${d.color} p-[1px] rounded-t-3xl`}>
                    <div className="bg-[#0c1222] rounded-t-3xl px-8 py-7 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <span className="text-4xl">{d.icon}</span>
                            <div>
                                <h2 className="text-2xl font-extrabold text-white">{d.title}</h2>
                                <p className="text-sm text-gray-400 mt-0.5">Comprehensive Medical Report</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setExpanded(!expanded)}
                            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 bg-gradient-to-r ${d.color} text-white hover:opacity-90 shadow-lg`}
                        >
                            {expanded ? "Collapse ▲" : "Read Full Report ▼"}
                        </button>
                    </div>
                </div>

                {/* Always-visible Section: Definition + Image */}
                <div className="px-8 py-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                                <span>📋</span> Definition & Overview
                            </h3>
                            <p className="text-gray-300 text-sm leading-relaxed">{d.definition}</p>
                        </div>
                        <div className="lg:w-80 flex-shrink-0">
                            <img
                                src={d.image}
                                alt={`${d.title} medical diagram`}
                                className="rounded-2xl border border-white/10 w-full object-cover shadow-xl"
                            />
                        </div>
                    </div>
                </div>

                {/* Expandable Content */}
                <AnimatePresence>
                    {expanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                            className="overflow-hidden"
                        >
                            <div className="px-8 pb-8 space-y-1">
                                {/* Types */}
                                <Section title="Types / Classification" icon="🏷️" accent={d.borderAccent}>
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        {d.types.map((t, i) => (
                                            <div
                                                key={i}
                                                className={`rounded-xl border border-${d.borderAccent} bg-${d.bgAccent} p-4`}
                                            >
                                                <h4 className={`text-sm font-bold text-${d.colorAccent} mb-1.5`}>{t.name}</h4>
                                                <p className="text-xs text-gray-400 leading-relaxed">{t.desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                </Section>

                                {/* Causes */}
                                <Section title="Causes & Risk Factors" icon="⚠️" accent={d.borderAccent}>
                                    <BulletList items={d.causes} color={d.colorAccent} />
                                </Section>

                                {/* Symptoms */}
                                <Section title="Signs & Symptoms" icon="🩺" accent={d.borderAccent}>
                                    <BulletList items={d.symptoms} color={d.colorAccent} />
                                </Section>

                                {/* Effects */}
                                <Section title="Effects on the Body & Complications" icon="💥" accent={d.borderAccent}>
                                    <BulletList items={d.effects} color={d.colorAccent} />
                                </Section>

                                {/* Prevention */}
                                <Section title="Prevention Strategies" icon="🛡️" accent={d.borderAccent}>
                                    <BulletList items={d.prevention} color={d.colorAccent} />
                                </Section>

                                {/* Precautions */}
                                <Section title="Daily Precautions & Management" icon="📝" accent={d.borderAccent}>
                                    <BulletList items={d.precautions} color={d.colorAccent} />
                                </Section>

                                {/* Statistics */}
                                <Section title="Global Statistics & Trends" icon="📊" accent={d.borderAccent}>
                                    <BulletList items={d.statistics} color={d.colorAccent} />
                                </Section>

                                {/* Public Health Impact */}
                                <Section title="Public Health Impact" icon="🌐" accent={d.borderAccent}>
                                    <p className="text-gray-300 text-sm leading-relaxed">{d.publicHealth}</p>
                                </Section>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}

/* ─── Main Documentation Page ────────────────────────────────── */
export default function Documentation() {
    const [activeDisease, setActiveDisease] = useState("diabetes");

    /* Simple intersection observer for TOC highlight */
    if (typeof window !== "undefined") {
        const handleScroll = () => {
            for (const d of [...diseases].reverse()) {
                const el = document.getElementById(d.id);
                if (el && el.getBoundingClientRect().top < 200) {
                    setActiveDisease(d.id);
                    return;
                }
            }
            const conclusion = document.getElementById("conclusion");
            if (conclusion && conclusion.getBoundingClientRect().top < 200) {
                setActiveDisease("conclusion");
            }
        };
        if (typeof window.__docScrollListenerAdded === "undefined") {
            window.addEventListener("scroll", handleScroll, { passive: true });
            window.__docScrollListenerAdded = true;
        }
    }

    return (
        <div className="min-h-screen pt-8 pb-20 px-4">
            <div className="max-w-7xl mx-auto flex gap-8">
                {/* Sidebar TOC */}
                <TOCSidebar activeDisease={activeDisease} />

                {/* Main content */}
                <div className="flex-1 max-w-4xl">
                    {/* Page Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 mb-5">
                            <span className="text-sm">📄</span>
                            <span className="text-xs font-semibold text-teal-400 tracking-wider uppercase">
                                Medical Documentation Report
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
                            Disease{" "}
                            <span className="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
                                Documentation
                            </span>
                        </h1>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
                            Comprehensive medical reports on Diabetes, PCOS, Hypertension, and Heart Disease —
                            covering definitions, symptoms, prevention, statistics, and more.
                        </p>
                    </motion.div>

                    {/* Disease Cards */}
                    <div className="space-y-10">
                        {diseases.map((d) => (
                            <DiseaseCard key={d.id} disease={d} />
                        ))}
                    </div>

                    {/* ─── Comparative Conclusion ─────────────────────────────── */}
                    <motion.div
                        id="conclusion"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="mt-16 scroll-mt-24"
                    >
                        <div className="glass-card rounded-3xl border border-white/10 overflow-hidden">
                            <div className="bg-gradient-to-r from-teal-500 to-emerald-500 p-[1px] rounded-t-3xl">
                                <div className="bg-[#0c1222] rounded-t-3xl px-8 py-6">
                                    <h2 className="text-2xl font-extrabold text-white flex items-center gap-3">
                                        <span>📊</span> Comparative Conclusion
                                    </h2>
                                </div>
                            </div>
                            <div className="px-8 py-8 space-y-6">
                                {/* Comparison Table */}
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-white/10">
                                                <th className="text-left text-gray-400 font-semibold py-3 px-4">Aspect</th>
                                                <th className="text-left text-blue-400 font-semibold py-3 px-4">Diabetes</th>
                                                <th className="text-left text-purple-400 font-semibold py-3 px-4">PCOS</th>
                                                <th className="text-left text-red-400 font-semibold py-3 px-4">Hypertension</th>
                                                <th className="text-left text-rose-400 font-semibold py-3 px-4">Heart Disease</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-gray-300">
                                            <tr className="border-b border-white/5">
                                                <td className="py-3 px-4 font-medium text-gray-400">Global Prevalence</td>
                                                <td className="py-3 px-4">537M adults</td>
                                                <td className="py-3 px-4">8–13% of women</td>
                                                <td className="py-3 px-4">1.28B adults</td>
                                                <td className="py-3 px-4">520M+ people</td>
                                            </tr>
                                            <tr className="border-b border-white/5">
                                                <td className="py-3 px-4 font-medium text-gray-400">Annual Deaths</td>
                                                <td className="py-3 px-4">6.7M</td>
                                                <td className="py-3 px-4">Indirect (via comorbidities)</td>
                                                <td className="py-3 px-4">10.8M</td>
                                                <td className="py-3 px-4">17.9M</td>
                                            </tr>
                                            <tr className="border-b border-white/5">
                                                <td className="py-3 px-4 font-medium text-gray-400">Primary Age Group</td>
                                                <td className="py-3 px-4">All ages (T1: young; T2: 45+)</td>
                                                <td className="py-3 px-4">15–44 years</td>
                                                <td className="py-3 px-4">30–79 years</td>
                                                <td className="py-3 px-4">40+ years</td>
                                            </tr>
                                            <tr className="border-b border-white/5">
                                                <td className="py-3 px-4 font-medium text-gray-400">Preventable?</td>
                                                <td className="py-3 px-4">Partially (T2 largely; T1 no)</td>
                                                <td className="py-3 px-4">No (manageable)</td>
                                                <td className="py-3 px-4">Largely yes</td>
                                                <td className="py-3 px-4">80% preventable</td>
                                            </tr>
                                            <tr>
                                                <td className="py-3 px-4 font-medium text-gray-400">Key Modifiable Risk</td>
                                                <td className="py-3 px-4">Obesity, diet, inactivity</td>
                                                <td className="py-3 px-4">Weight, insulin resistance</td>
                                                <td className="py-3 px-4">Sodium, weight, stress</td>
                                                <td className="py-3 px-4">Smoking, cholesterol, BP</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                {/* Conclusion Text */}
                                <div className="bg-white/[0.02] rounded-2xl border border-white/[0.06] p-6">
                                    <p className="text-gray-300 text-sm leading-relaxed mb-4">
                                        All four conditions share significant overlap in risk factors — particularly <strong className="text-teal-400">obesity</strong>, <strong className="text-teal-400">physical inactivity</strong>, and <strong className="text-teal-400">poor dietary habits</strong>. Diabetes and hypertension are both major independent risk factors for heart disease, creating a dangerous cascade effect. PCOS, while primarily a reproductive endocrine disorder, is increasingly recognized as a metabolic condition with strong links to insulin resistance and cardiovascular risk.
                                    </p>
                                    <p className="text-gray-300 text-sm leading-relaxed mb-4">
                                        <strong className="text-white">Heart disease</strong> remains the most lethal, accounting for 17.9 million deaths annually. However, <strong className="text-white">hypertension</strong> is the most prevalent (1.28 billion affected) and serves as the primary gateway to cardiovascular complications. <strong className="text-white">Diabetes</strong> has the highest economic burden, and <strong className="text-white">PCOS</strong> remains the most under-diagnosed, with up to 70% of cases undetected.
                                    </p>
                                    <p className="text-gray-300 text-sm leading-relaxed">
                                        The most impactful public health intervention is a <strong className="text-teal-400">holistic lifestyle approach</strong>: maintaining a healthy weight, regular exercise, balanced nutrition, stress management, and routine screening. These measures alone can prevent up to 80% of premature heart disease and significantly reduce the incidence and severity of all four conditions.
                                    </p>
                                </div>

                                {/* Key Takeaway Stats */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <StatCard value="17.9M" label="CVD Deaths / Year" />
                                    <StatCard value="1.28B" label="People with Hypertension" />
                                    <StatCard value="537M" label="People with Diabetes" />
                                    <StatCard value="70%" label="PCOS Cases Undiagnosed" />
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* ─── References ────────────────────────────────────────── */}
                    <motion.div
                        id="references"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="mt-10 mb-8 scroll-mt-24"
                    >
                        <div className="glass-card rounded-3xl border border-white/10 px-8 py-8">
                            <h2 className="text-2xl font-extrabold text-white mb-6 flex items-center gap-3">
                                <span>📚</span> References
                            </h2>
                            <div className="space-y-3">
                                {[
                                    {
                                        org: "WHO",
                                        title: "Hypertension — Key Facts",
                                        url: "https://www.who.int/news-room/fact-sheets/detail/hypertension",
                                    },
                                    {
                                        org: "WHO",
                                        title: "Cardiovascular Diseases (CVDs) — Fact Sheet",
                                        url: "https://www.who.int/news-room/fact-sheets/detail/cardiovascular-diseases-(cvds)",
                                    },
                                    {
                                        org: "WHO",
                                        title: "Polycystic Ovary Syndrome — Key Facts (2023)",
                                        url: "https://www.who.int/news-room/fact-sheets/detail/polycystic-ovary-syndrome",
                                    },
                                    {
                                        org: "IDF",
                                        title: "IDF Diabetes Atlas, 10th Edition (2021)",
                                        url: "https://diabetesatlas.org/",
                                    },
                                    {
                                        org: "AHA",
                                        title: "Heart Disease and Stroke Statistics — 2024 Update",
                                        url: "https://www.ahajournals.org/doi/10.1161/CIR.0000000000001209",
                                    },
                                    {
                                        org: "ADA",
                                        title: "Standards of Care in Diabetes — 2024",
                                        url: "https://diabetesjournals.org/care/issue/47/Supplement_1",
                                    },
                                    {
                                        org: "ESHRE",
                                        title: "International Evidence-based Guidelines for PCOS (2023)",
                                        url: "https://www.monash.edu/medicine/mchri/pcos/guideline",
                                    },
                                    {
                                        org: "WHO",
                                        title: "HEARTS Technical Package for CVD Management",
                                        url: "https://www.who.int/publications/i/item/hearts-technical-package",
                                    },
                                ].map((ref, i) => (
                                    <a
                                        key={i}
                                        href={ref.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-start gap-3 px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.05] hover:border-teal-500/20 transition-all duration-200 group"
                                    >
                                        <span className="text-xs font-bold text-teal-400 bg-teal-500/10 px-2.5 py-1 rounded-lg flex-shrink-0 mt-0.5">
                                            {ref.org}
                                        </span>
                                        <div>
                                            <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                                                {ref.title}
                                            </span>
                                            <span className="block text-xs text-gray-500 mt-0.5 truncate max-w-md">
                                                {ref.url}
                                            </span>
                                        </div>
                                        <svg
                                            className="w-4 h-4 text-gray-500 group-hover:text-teal-400 mt-1 ml-auto flex-shrink-0 transition-colors"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                            />
                                        </svg>
                                    </a>
                                ))}
                            </div>

                            {/* Disclaimer */}
                            <div className="mt-6 p-4 rounded-xl bg-amber-500/5 border border-amber-500/15">
                                <p className="text-xs text-amber-400/80 leading-relaxed">
                                    <strong className="text-amber-400">⚠️ Medical Disclaimer:</strong> This documentation is
                                    intended for educational and informational purposes only. It does not constitute medical
                                    advice, diagnosis, or treatment. Always consult a qualified healthcare provider for medical
                                    concerns. Statistics cited are based on the latest available data from the referenced
                                    sources at the time of preparation.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
