// Drills — recurring, streakable habits (from "Hands-On Work → Drills") and
// soft-skill workouts (from "Soft-skill workouts (solo or AI-roleplay)") in
// docs/curriculum-spec.md. Habit IDs are the spec's IDs verbatim.
import type { Drill } from "@/types";

export const drills: Drill[] = [
  // -------------------------------------------------------------------------
  // Habits (recurring, streakable)
  // -------------------------------------------------------------------------
  {
    id: "d-paper-week",
    title: "Paper of the week",
    trackIds: ["T7_DOMAIN", "T1_AI_ML"],
    cadence: "weekly",
    description:
      "Pick one AI-security or agent paper from the papers queue (PentestGPT, HPTSA/multi-agent, CVE-Bench, Google Big Sleep, or a new arXiv agent-security paper). Read it end-to-end, then write a 200-word summary in your notes: the claim, the method, the one number that matters, and how it applies to the NHI/agent-security wedge. Add one flashcard from it to the review deck.",
    estMinutes: 90,
    soloOrPartner: "solo",
    streakable: true,
    tags: ["autonomous_pentest", "agents", "red_teaming", "reading", "pkm"],
    kind: "habit",
  },
  {
    id: "d-sysdesign-week",
    title: "System-design problem of the week",
    trackIds: ["T2_BACKEND_SYSTEMS"],
    cadence: "weekly",
    description:
      "Take one problem from the System Design Primer (or ByteByteGo) and work it end-to-end in 60 minutes: clarify requirements and scale, sketch the high-level design, choose the data model and storage, walk the core request flow, then name the bottleneck and how you would scale past it. Finish with a one-paragraph tradeoff summary and add any new concept to your Anki deck.",
    estMinutes: 60,
    soloOrPartner: "solo",
    streakable: true,
    tags: ["system_design", "distributed_data", "spaced_repetition"],
    kind: "habit",
  },
  {
    id: "d-tech-post-week",
    title: "Publish one technical post",
    trackIds: ["T8_META"],
    cadence: "weekly",
    description:
      "Publish one technical post (learn-in-public): what you built or learned this week, with a code snippet, a diagram or screenshot, and one thing that did not work. Keep it under 800 words, post it on your blog, cross-post to LinkedIn/X, and log the link on the related project so it counts toward the portfolio.",
    estMinutes: 90,
    soloOrPartner: "solo",
    streakable: true,
    tags: ["learning_in_public", "writing", "portfolio"],
    kind: "habit",
  },
  {
    id: "d-demo-week",
    title: "Record and self-review a 5-minute demo",
    trackIds: ["T4_FDE_SE"],
    cadence: "weekly",
    description:
      "Record a 5-minute demo (screen + voice) of something you built this week: the problem in one sentence, a 30-second setup, the live walk-through, and what is next. Watch it back once and score yourself on clarity, pacing, and whether the 'so what' landed inside the first minute. Write down one fix to apply in next week's take; keep the best takes for the demo reel.",
    estMinutes: 45,
    soloOrPartner: "solo",
    streakable: true,
    tags: ["demo_craft", "fde_playbook", "portfolio"],
    kind: "habit",
  },
  {
    id: "d-customer-interview-week",
    title: "One Mom-Test discovery call",
    trackIds: ["T3_PRODUCT", "T5_SALES_GTM"],
    cadence: "weekly",
    description:
      "Run one Mom-Test-style discovery call with someone from your network or a design-partner candidate (a CISO, security engineer, or platform lead). Ask about their past and current behaviour, not your idea; never pitch; dig for specifics and costs. Within an hour of the call, write a five-line summary: problem, current workaround, cost of the problem, who else cares, agreed next step.",
    estMinutes: 45,
    soloOrPartner: "partner",
    streakable: true,
    tags: ["discovery", "jtbd", "founder_led_sales", "customer_ontology"],
    kind: "habit",
  },
  {
    id: "d-cold-outreach-day",
    title: "One cold outreach a day",
    trackIds: ["T5_SALES_GTM", "T4_FDE_SE"],
    cadence: "daily",
    description:
      "Send one cold outreach a day while job hunting (Phase 1): a founder, hiring manager or FDE at a seed-stage target startup, or a design-partner candidate. Three sentences max, referencing something specific they shipped, with one concrete ask (a 15-minute call, feedback on a repo, or a role). Track it in a simple pipeline sheet and follow up after five days.",
    estMinutes: 15,
    soloOrPartner: "solo",
    streakable: true,
    tags: ["founder_led_sales", "job_hunt", "design_partners", "accountability"],
    phases: [1],
    kind: "habit",
  },
  {
    id: "d-prd-rewrite",
    title: "Rewrite a real product's PRD",
    trackIds: ["T3_PRODUCT"],
    cadence: "biweekly",
    description:
      "Take a real product's public spec or PRD (a feature you use daily, an open-source project's RFC, or a competitor's launch post) and rewrite it in 60 minutes as a crisp one-page PRD: problem, target user, success metric, scope and non-goals, open questions, and an eval plan if it is an AI feature. Compare it with the original and note what the original left out or over-specified.",
    estMinutes: 60,
    soloOrPartner: "solo",
    streakable: true,
    tags: ["prd", "metrics", "ai_pm", "b2b_pm"],
    kind: "habit",
  },
  {
    id: "d-ctf-week",
    title: "One AI-security CTF challenge",
    trackIds: ["T7_DOMAIN"],
    cadence: "weekly",
    description:
      "Complete one AI-security CTF level or challenge: start with Gandalf, then HackAPrompt, then the HTB AI Red Teamer path, Wiz Prompt Airlines, Tensor Trust, PromptTrace, or the OWASP FinBot CTF. Log the technique that worked, map it to an OWASP LLM/Agentic Top 10 item or a MITRE ATLAS technique, and write one line on why the defence failed. Feeds directly into p-redteam-writeup.",
    estMinutes: 45,
    soloOrPartner: "solo",
    streakable: true,
    tags: ["prompt_injection", "red_teaming", "ctf", "appsec"],
    kind: "habit",
  },
  {
    id: "d-negotiation-roleplay",
    title: "Negotiation / objection-handling roleplay",
    trackIds: ["T5_SALES_GTM"],
    cadence: "biweekly",
    description:
      "AI-roleplay one negotiation or objection-handling scenario for 30 minutes: a salary/equity negotiation, a design-partner pricing conversation, or an enterprise procurement objection. Use one Never Split the Difference technique (labeling, mirroring, calibrated questions) and one MEDDPICC lens (who is the economic buyer, what are the decision criteria). Afterwards, ask the AI to score you and write down the single line you would change.",
    estMinutes: 30,
    soloOrPartner: "ai_roleplay",
    streakable: true,
    tags: ["negotiation", "meddic", "objection_handling", "ciso_selling"],
    kind: "habit",
  },

  // -------------------------------------------------------------------------
  // Soft-skill workouts (AI-roleplay scripts, not streak-tracked)
  // -------------------------------------------------------------------------
  {
    id: "d-workout-pitch",
    title: "Pitch workout: Raskin five-part narrative",
    trackIds: ["T5_SALES_GTM", "T6_FOUNDER"],
    cadence: "weekly",
    description:
      "Record a 4-minute pitch for your own idea using Andy Raskin's strategic narrative (big shift, winners and losers, Promised Land, magic gifts, evidence), then run the roleplay script below to get it stress-tested and self-review the recording. Rewrite the weakest part before the next take.",
    estMinutes: 45,
    soloOrPartner: "ai_roleplay",
    streakable: false,
    tags: ["narrative", "positioning", "fundraising", "strategic_narrative"],
    kind: "workout",
    script:
      "Persona: you are a seed-stage investor (alternatively, a CISO who would have to champion this internally) listening to a four-minute pitch. I am the founder. " +
      "Setup: I will deliver my pitch using Andy Raskin's five-part strategic narrative: (1) name a big, undeniable shift in the world, (2) show there will be winners and losers, (3) tease the Promised Land, (4) present the product's capabilities as 'magic gifts' that get customers there, (5) give evidence it is already working. Do not interrupt while I pitch. " +
      "Afterwards, ask me the three toughest questions you had, prioritising 'why now?' and 'why you?'. Then score each of the five parts from 1 to 5 and tell me exactly where the story lost you. " +
      "What I practise: leading with the shift instead of the product, keeping the Promised Land about the customer rather than my features, and staying under four minutes. " +
      "Self-review: I record the pitch and re-watch it once, noting (a) the second I first mention my product, (b) any part I skipped or blurred, (c) filler words per minute. I rewrite the weakest part and re-record once before ending the session.",
  },
  {
    id: "d-workout-cofounder-prenup",
    title: "Co-founder 'prenup' conversation",
    trackIds: ["T6_FOUNDER"],
    cadence: "biweekly",
    description:
      "AI-roleplay both sides of the founder-prenup talk: equity split and vesting (YC default: roughly equal, 4-year vesting, 1-year cliff), roles and decision rights, what happens if someone leaves, time commitment, and how you will disagree. Swap roles halfway. End by drafting the one-page written agreement, the direct fix for the past co-founder failure mode.",
    estMinutes: 40,
    soloOrPartner: "ai_roleplay",
    streakable: false,
    tags: ["cofounder", "cap_table", "difficult_conversations", "leadership"],
    kind: "workout",
    script:
      "Persona: play my prospective co-founder, a strong technical peer from my network who is excited about our idea but has never been through a founding team breaking up. " +
      "Setup: we are three months into a trial project and it is time for the founder 'prenup' conversation. Push back realistically: you want a larger equity share because of your domain expertise, you are uneasy about vesting, and you have a side commitment you have not fully disclosed. I open the conversation. " +
      "Cover, in order: equity split (YC's default is roughly equal with 4-year vesting and a 1-year cliff), roles and decision rights, what happens if one of us leaves or under-delivers, time commitment and outside work, and how we will handle disagreements. " +
      "What I practise: naming uncomfortable topics directly, listening before proposing, and writing down what we agreed rather than leaving it to vibes. After ten minutes, swap: I play the co-founder and you play me, so I hear how my own asks sound. " +
      "Self-review: list every topic I avoided or softened, note any moment I conceded just to keep the peace, and draft the one-page written agreement we would sign. Repeat until nothing on YC's co-founder equity-mistakes list is left unaddressed.",
  },
  {
    id: "d-workout-ciso-discovery",
    title: "Discovery call with a skeptical CISO",
    trackIds: ["T3_PRODUCT", "T4_FDE_SE", "T5_SALES_GTM"],
    cadence: "weekly",
    description:
      "AI-roleplay a 15-minute discovery call with a skeptical CISO buyer using Mom Test rules: ask about past and present behaviour, never pitch, dig for specifics and costs, close with a concrete next step. Get scored on bad questions, then write the five-line problem / workaround / cost / who-else-cares / next-step summary.",
    estMinutes: 30,
    soloOrPartner: "ai_roleplay",
    streakable: false,
    tags: ["discovery", "ciso_selling", "technical_discovery", "customer_ontology"],
    kind: "workout",
    script:
      "Persona: you are the CISO of a 1,500-person Israeli fintech. You have 25 minutes, you have been burned by 'AI security' vendors before, and you did not ask for this call; a mutual contact set it up. Be polite but skeptical: answer briefly, volunteer nothing, and challenge any leading question. " +
      "Setup: this is a discovery call, not a demo. I want to learn how your team handles agents, service accounts and non-human identities today. " +
      "What I practise (Mom Test rules): asking about your past and present behaviour rather than my idea, never pitching, digging for specifics ('when did that last happen? what did it cost you?'), and closing with a concrete next step rather than a compliment. If I pitch, fish for compliments, or ask a hypothetical ('would you use...'), say so out loud and deduct a point. " +
      "Play it out for 15 minutes, then break character. " +
      "Self-review: give me the count of bad questions, the three most useful facts I extracted, and whether you would take a second call. I then write a five-line summary in the format problem / current workaround / cost of the problem / who else cares / next step, and note the one question I should have asked first.",
  },
  {
    id: "d-workout-procurement-objections",
    title: "Enterprise-security procurement objections",
    trackIds: ["T5_SALES_GTM", "T4_FDE_SE"],
    cadence: "biweekly",
    description:
      "AI-roleplay a procurement panel (CISO, GRC lead, procurement manager) raising enterprise-security buying objections one at a time: budget cycle, startup risk, data handling, SOC 2 and pen-test, incumbent bundling, references. Practise acknowledge-clarify-evidence answers and MEDDPICC mapping, then rewrite your two weakest answers.",
    estMinutes: 35,
    soloOrPartner: "ai_roleplay",
    streakable: false,
    tags: ["objection_handling", "meddic", "ciso_selling", "poc_scoping"],
    kind: "workout",
    script:
      "Persona: you are a security procurement panel at a large enterprise: a CISO, a GRC/compliance lead, and a procurement manager. I am the founding SE presenting an AI agent-security product after a successful POC. " +
      "Setup: we are in the objections stage of an enterprise-security purchase. Raise one objection at a time, in a realistic order, and do not accept a vague answer: 'Our budget cycle is closed until next fiscal year.' 'You are a five-person startup; what happens if you die?' 'Where does our data go and which model provider sees it?' 'We need SOC 2 and a pen-test report before legal will look at this.' 'The incumbent says they will add this for free.' 'Who else in our industry uses you?' " +
      "What I practise: acknowledging before answering, asking a clarifying question to find the real concern behind the objection, turning the POC results into evidence, and using MEDDPICC to identify the economic buyer, decision criteria, paper process and champion. Escalate if I get defensive or over-promise. After 20 minutes break character. " +
      "Self-review: which objections I answered with evidence versus assertion, which I dodged, and one objection I should have pre-empted in the deck. I write improved answers to the two weakest ones and add them to my objection bank.",
  },
  {
    id: "d-workout-one-on-ones",
    title: "Running 1:1s and giving feedback",
    trackIds: ["T6_FOUNDER"],
    cadence: "biweekly",
    description:
      "Script and AI-roleplay a 1:1 with a talented but frustrated report who has missed two commitments. Open with their agenda, listen for five minutes, deliver specific behaviour-based feedback with the Radical Candor frame (care personally, challenge directly), explore the blocker per The Manager's Path, and end with a written next step and date.",
    estMinutes: 30,
    soloOrPartner: "ai_roleplay",
    streakable: false,
    tags: ["leadership", "hiring", "feedback", "management"],
    kind: "workout",
    script:
      "Persona: play a senior engineer who reports to me, three months into the job. You are talented, quietly frustrated, and have missed two commitments in a row; you suspect nobody has noticed the reasons. " +
      "Setup: this is our regular 1:1. I open with your agenda, not mine. Halfway through I need to give you direct feedback about the missed commitments using the Radical Candor frame (care personally, challenge directly) and then explore what is blocking you, as The Manager's Path advises a new manager to do. Push back naturally: get defensive once, deflect once, and reveal the real blocker only if I ask a genuinely open question. " +
      "What I practise: listening for the first five minutes without solving, delivering specific behaviour-based feedback rather than labels, asking for your view before proposing a plan, and ending with a written next step and a date. If I lecture, ruinously empathise, or skip the hard part, say 'timeout' and tell me why. " +
      "After 15 minutes break character and score me on care, directness, and clarity of the next step. " +
      "Self-review: note the exact sentence I used to raise the problem, estimate how long I spoke versus listened, and rewrite the feedback line as one sentence to use next time.",
  },
  {
    id: "d-workout-saying-no",
    title: "Saying no: roadmap refusals",
    trackIds: ["T3_PRODUCT", "T6_FOUNDER"],
    cadence: "biweekly",
    description:
      "AI-roleplay three stakeholders in rotation (biggest customer's champion, CEO who over-promised, engineer wanting a two-sprint rebuild) each pushing for a roadmap change. Practise a clear no or a scoped, dated 'not now' inside the first minute, a trade-off explained against the agreed goal, and a deliverable alternative. Write the three refusals as sendable messages.",
    estMinutes: 30,
    soloOrPartner: "ai_roleplay",
    streakable: false,
    tags: ["prd", "prioritization", "b2b_pm", "leadership"],
    kind: "workout",
    script:
      "Persona: you are three stakeholders in rotation: (1) our biggest customer's champion demanding a custom integration 'or we churn', (2) our CEO who promised a feature in a sales call, (3) an engineer who wants two sprints to rebuild the pipeline. I am the product lead / CTO, and this quarter's roadmap is already committed to the eval harness and the agent-permissions release. " +
      "Setup: each of you makes your ask in turn; you have three minutes each and you will not accept 'maybe later' as an answer. " +
      "What I practise: saying a clear no (or a scoped, dated 'not now') within the first minute, explaining the trade-off in terms of the goal we agreed rather than my opinion, offering an alternative I can actually deliver, and holding the line under emotional pressure without getting defensive. If I hedge, over-explain, or make a promise I cannot keep, call it out immediately. " +
      "After all three rounds break character. " +
      "Self-review: for each stakeholder, did I state the decision, the reason, and an alternative? Which no was weakest and why? I write the three refusals as short messages I could send tomorrow, then replay the weakest one until it holds.",
  },
];
