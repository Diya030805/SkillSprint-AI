import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

// Handle lazy initialization to prevent startup crashes when key is missing
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== "MY_GEMINI_API_KEY" && apiKey.trim() !== "") {
      aiClient = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
  }
  return aiClient;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, payload } = body;

    const ai = getAiClient();

    // If Gemini API Key is missing or default, fall back to high-quality simulated responses
    if (!ai) {
      return NextResponse.json({
        success: true,
        simulated: true,
        data: getSimulatedResponse(action, payload),
      });
    }

    if (action === "chat") {
      const { message, history } = payload;
      
      // Structure the conversation for Gemini
      const formattedContents = [
        {
          role: "user",
          parts: [{ text: "You are SprintSkill AI's Premium Career and Learning Mentor. You provide deep, actionable, clear guidance on coding, design, resume writing, career paths, and technical skills. Be concise, supportive, and structure your responses with markdown." }]
        }
      ];

      if (history && Array.isArray(history)) {
        history.forEach((h: any) => {
          formattedContents.push({
            role: h.role === "user" ? "user" : "model",
            parts: [{ text: h.text }]
          });
        });
      }

      formattedContents.push({
        role: "user",
        parts: [{ text: message }]
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: formattedContents,
      });

      return NextResponse.json({
        success: true,
        text: response.text || "I apologize, but I couldn't generate a response. Please try again.",
      });
    }

    if (action === "roadmap") {
      const { careerGoal, currentSkills, timeCommitment } = payload;
      const prompt = `Generate a comprehensive, highly personalized career roadmap for becoming a "${careerGoal}".
Current skills: ${currentSkills || "None / Beginner"}.
Weekly commitment time: ${timeCommitment || "10-20 hours"}.

You MUST return a JSON object containing the exact roadmap structure.
Structure of the JSON to return:
{
  "role": "${careerGoal}",
  "description": "Short inspirational description of this role and market demand.",
  "estimatedDuration": "e.g. 6 Months",
  "skillTree": [
    { "name": "Skill Name", "level": "Beginner/Intermediate/Advanced", "description": "Short explanation of why it matters" }
  ],
  "milestones": [
    {
      "id": 1,
      "title": "Milestone Title",
      "duration": "e.g. Weeks 1-4",
      "description": "What is the core focus here.",
      "skillsToLearn": ["Skill A", "Skill B"],
      "project": {
        "title": "Milestone Capstone Project",
        "description": "A hands-on build assignment that proves capability in this phase."
      },
      "resources": [
        { "name": "Recommended course/concept", "type": "Video/Article/Doc" }
      ]
    }
  ]
}

Ensure the response is ONLY valid JSON. No markdown backticks, no comments, no additional text. Just raw JSON.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      const resultText = response.text || "{}";
      const parsedData = JSON.parse(resultText);

      return NextResponse.json({
        success: true,
        data: parsedData,
      });
    }

    if (action === "quiz") {
      const { topic, difficulty } = payload;
      const prompt = `Generate a high-quality 3-question multiple-choice quiz about "${topic}" with difficulty level "${difficulty || "Intermediate"}".
Return ONLY a JSON array of questions.
Each question must have the structure:
{
  "question": "The question text",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctIndex": 0, // index of correct answer in the options array (0-3)
  "explanation": "Detailed explanation of why this is the correct answer and why others are incorrect."
}

Ensure the response is ONLY valid JSON. No markdown backticks, no comments, no additional text.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      const resultText = response.text || "[]";
      const parsedData = JSON.parse(resultText);

      return NextResponse.json({
        success: true,
        data: parsedData,
      });
    }

    if (action === "resume_suggest") {
      const { section, content } = payload;
      const prompt = `You are an expert tech recruiter. Review the following resume section: "${section}".
Content:
"""
${content}
"""

Provide:
1. Three concrete suggestions to make it more impactful using action verbs and metrics.
2. A polished, rewritten version of this section that is ready to use.

Format your response as a JSON object:
{
  "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"],
  "rewritten": "Complete rewritten text of the section"
}

Ensure the response is ONLY valid JSON. No markdown backticks, no additional text.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      const resultText = response.text || "{}";
      const parsedData = JSON.parse(resultText);

      return NextResponse.json({
        success: true,
        data: parsedData,
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({
      success: false,
      error: error.message || "An error occurred during content generation",
    }, { status: 500 });
  }
}

// Fallback high-quality simulation responses when API Key is not set or error occurs
function getSimulatedResponse(action: string, payload: any) {
  if (action === "chat") {
    const msg = (payload.message || "").toLowerCase();
    if (msg.includes("hello") || msg.includes("hi")) {
      return "Hello! I'm your premium **SprintSkill AI Mentor**. How can I help accelerate your career and learning roadmap today? You can ask me about custom roadmaps, code reviews, resume styling, or preparing for interviews!";
    }
    if (msg.includes("roadmap") || msg.includes("career")) {
      return "An excellent career choice! I can generate custom, step-by-step milestones with curated projects, core skill trees, and pacing guidelines. Try typing your goal into the **AI Career Roadmap** tab!";
    }
    if (msg.includes("react") || msg.includes("next")) {
      return "React & Next.js are leading the modern web ecosystem. Focus on understanding **Server Components vs Client Components**, state boundaries, and routing structures. Would you like to try a challenge in our **Practice Zone**?";
    }
    return `### Guided Insight from SprintSkill AI Mentor

That's a fantastic question! To master this domain, here's an actionable, premium strategy to consider:

1. **Incremental Practice**: Don't just read. Build micro-projects that test specific edge cases (e.g. state synchronization or responsive grids).
2. **Understand the Mechanics**: Understand the underlying design principles (like clean architecture, accessibility landmarks, and visual spacing rhythm).
3. **Continuous Iteration**: Continually refine your work by seeking peer reviews, looking at high-caliber SaaS designs (like Linear or Vercel), and writing descriptive portfolio copy.

*Would you like to build a custom roadmap for this topic, or practice with quiz cards?*`;
  }

  if (action === "roadmap") {
    const careerGoal = payload.careerGoal || "Full-Stack Developer";
    return {
      role: careerGoal,
      description: `Premium, structured roadmap curated by SprintSkill AI to transform you into a high-caliber, industry-ready ${careerGoal}.`,
      estimatedDuration: "6 Months (15 hrs/week)",
      skillTree: [
        { name: "Core Fundamentals", level: "Beginner", description: "Basic blocks and standard tooling." },
        { name: "Advanced Framework Architectures", level: "Intermediate", description: "State design, caching, and styling systems." },
        { name: "Scalability & Performance", level: "Advanced", description: "Edge computation, optimizations, and clean delivery." }
      ],
      milestones: [
        {
          id: 1,
          title: "Foundations & Structural Design",
          duration: "Weeks 1-4",
          description: "Establish semantic structures, perfect layout spacing systems, and understand version control workflows.",
          skillsToLearn: ["Git & Team Workflow", "Semantic Architecture", "Tailwind & Responsive Grids"],
          project: {
            title: "Minimalist High-Contrast Content Deck",
            description: "Build a responsive content grid that features seamless transitions, strict access controls, and custom dark mode."
          },
          resources: [
            { name: "Advanced Grid Layouts and Flexbox Mechanics", type: "Article" },
            { name: "Version Control and Collaborative Workflows", type: "Doc" }
          ]
        },
        {
          id: 2,
          title: "Interactive Client Engine",
          duration: "Weeks 5-10",
          description: "Implement modern state machines, custom client hooks, and handle asynchronous data orchestration elegantly.",
          skillsToLearn: ["State Orchestration", "Async REST & GraphQL", "Framer Motion Animations"],
          project: {
            title: "Real-time Analytical Live Hub",
            description: "Build a data-driven dashboard that streams updates, displays custom charts, and utilizes local storage cache."
          },
          resources: [
            { name: "Mastering Asynchronous State with Custom Hooks", type: "Video" },
            { name: "Micro-interactions and Performance Optimization", type: "Article" }
          ]
        },
        {
          id: 3,
          title: "Scalable Production Delivery",
          duration: "Weeks 11-16",
          description: "Optimize build assets, implement server-side proxies, configure edge route rules, and run end-to-end testing.",
          skillsToLearn: ["Server Rendering Patterns", "Vulnerability Scans", "SEO & Performance Metrics"],
          project: {
            title: "High-Performance SaaS Enterprise Interface",
            description: "A Vercel-style dashboard with lightning-fast initial paints, strict TypeScript validation, and full screen responsiveness."
          },
          resources: [
            { name: "Edge Middleware and Caching Paradigms", type: "Doc" }
          ]
        }
      ]
    };
  }

  if (action === "quiz") {
    const topic = payload.topic || "General Software Engineering";
    return [
      {
        question: `In modern layout styling, what is the primary benefit of utilizing Tailwind's spacing standards over custom arbitrary values?`,
        options: [
          "It automatically compiles styles faster",
          "It enforces a strict visual rhythm and consistent spacing hierarchy",
          "It forces the browser to use hardware acceleration",
          "It automatically translates layout grids into 3D space"
        ],
        correctIndex: 1,
        explanation: "Consistent spacing scales (like multiples of 4px/8px) establish visual harmony and professional cadence across layouts, avoiding cluttered or random margin alignments."
      },
      {
        question: `When designing high-performance React applications, why is pushing client state down to leaf components highly recommended?`,
        options: [
          "It ensures the app automatically bypasses CORS rules",
          "It completely removes the need for compiling CSS styles",
          "It minimizes unnecessary parent and sibling component re-renders",
          "It increases the build bundle size to improve browser caching"
        ],
        correctIndex: 2,
        explanation: "By keeping interactive states localized to the exact elements that need them, you prevent large parent hierarchies from re-evaluating on simple user gestures, keeping visual frames locked at 60fps."
      },
      {
        question: `Which architectural property characterizes a premium 'glassmorphism' design standard?`,
        options: [
          "Opaque saturated neon borders with sharp drop shadows",
          "3D extruded wireframes revolving on canvas stages",
          "Subtle translucent backgrounds, delicate high-contrast borders, and background-blur filters",
          "Blinking marquee elements paired with solid primary colors"
        ],
        correctIndex: 2,
        explanation: "Glassmorphism blends translucent surfaces with delicate light-reflecting borders and a heavy background-blur (`backdrop-blur`), creating structural layers that feel light and physically layered."
      }
    ];
  }

  if (action === "resume_suggest") {
    const section = payload.section || "Experience";
    return {
      suggestions: [
        "Include quantifiable results (e.g., 'accelerated load times by 40%', 'reduced layout shift by 0.12').",
        "Use more active verbs at the start of bullets (e.g., 'Orchestrated', 'Architected', 'Engineered' instead of 'Worked on').",
        "Highlight standard SaaS integration workflows and state optimizations that recruiters love to see."
      ],
      rewritten: `Architected and engineered critical front-end components for high-traffic SaaS interfaces, resulting in a 35% reduction in time-to-interactive. Orchestrated seamless client-side state machine caching and standardized Tailwind styling, improving typography alignment and team delivery velocity by 20%.`
    };
  }

  return {};
}
