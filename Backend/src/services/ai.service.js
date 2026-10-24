const { GoogleGenAI } = require("@google/genai");
const puppeteer = require("puppeteer");
const { z } = require("zod");
const ai = process.env.GOOGLE_GENAI_API_KEY
  ? new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY })
  : null;

const interviewReportSchema = z.object({
  matchScore: z
    .number()
    .min(0)
    .max(100)
    .describe(
      "The match score between the candidate's resume and the job description",
    ),
  technicalQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe("The technical question can be asked in the interview"),
        intention: z
          .string()
          .describe("The intention behind the technical question"),
        answer: z
          .string()
          .describe(
            "How to answer this question,what points to cover in the answer",
          ),
      }),
    )
    .describe("Technical questions that can be asked in the interview"),
  behavioralQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe("The behavioral question can be asked in the interview"),
        intention: z
          .string()
          .describe("The intention behind the behavioral question"),
        answer: z
          .string()
          .describe(
            "How to answer this question,what points to cover in the answer",
          ),
      }),
    )
    .describe("Behavioral questions that can be asked in the interview"),

  skillGaps: z
    .array(
      z.object({
        skill: z.string().describe("The skill that the candidate is lacking"),
        severity: z
          .enum(["low", "medium", "high"])
          .describe("The severity of the skill gap"),
      }),
    )
    .describe("Skills that the candidate is lacking"),

  preparationPlan: z
    .array(
      z.object({
        day: z.number().describe("The day number of the preparation plan"),
        focus: z
          .string()
          .describe("The focus of the preparation plan for the day"),
        tasks: z
          .array(z.string())
          .describe("The tasks to be completed for the day"),
      }),
    )
    .describe(
      "A day-wise preparation plan for the candidate to improve their skills",
    ),

  title: z
    .string()
    .describe(
      "The title of the job for which the interview report is generated",
    ),
});
async function generateInterviweReport({
  resume,
  selfDescription,
  jobDescription,
}) {
  if (!ai) throw new Error("GOOGLE_GENAI_API_KEY is not configured");
  const prompt = `Generate an interview report for the candidate using the required JSON schema and the following information:
    Resume: ${resume}
    Self Description: ${selfDescription}
    Job Description: ${jobDescription}`;
  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash-lite",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: z.toJSONSchema(interviewReportSchema),
    },
  });

  const report = interviewReportSchema.parse(JSON.parse(response.text));
  return report;
}

async function generatePdfFromHtml(htmlContent) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: "networkidle0" });

  const pdfBuffer = await page.pdf({
    format: "A4",
    margin: { top: "20px", bottom: "20px", left: "20px", right: "20px" },
  });
  await browser.close();
  return pdfBuffer;
}

async function generateResumePdf({
  resume,
  selfDescription,
  jobDescription,
}) {
  if (!ai) throw new Error("GOOGLE_GENAI_API_KEY is not configured");
  const resumePdfSchema = z.object({
    html: z
      .string()
      .describe(
        "The HTML content of the resume which can be converted to PDF using any library like puppeteer",
      ),
  });

  const prompt = `You are an expert resume writer. Create a concise, professional, ATS-friendly resume tailored to the job description.

Candidate information:
--- Resume ---
${resume}

--- Self-description ---
${selfDescription}

--- Job description ---
${jobDescription}
--- End candidate information ---

Requirements:
1. Tailor the resume to the target role by emphasizing the candidate's relevant skills, experience, achievements, and keywords from the job description.
2. Use only information supported by the candidate's materials. Do not invent employers, dates, qualifications, metrics, or other details.
3. Write in a natural, human, professional tone. Avoid generic claims, repetition, unnecessary jargon, and AI-generated phrasing.
4. Keep the content concise and aim to fit it on one A4 page while preserving important information.
5. Use a standard, clearly structured resume layout with sections such as contact information, professional summary, skills, experience, education, and projects where applicable.
6. Make the HTML readable, print-friendly, and suitable for conversion to PDF with Puppeteer. Use simple semantic HTML and minimal inline CSS; do not use external assets, JavaScript, images, icons, tables for layout, or complex multi-column designs.
7. Ensure the content is easy for applicant tracking systems to parse. Do not include commentary, explanations, Markdown, or content outside the resume.

Return only a valid JSON object with exactly one key, "html". Its value must be a complete, self-contained HTML document containing the tailored resume.`;

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash-lite",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: z.toJSONSchema(resumePdfSchema),
    },
  });

  const { html } = resumePdfSchema.parse(JSON.parse(response.text));
  return generatePdfFromHtml(html);
}

module.exports = { generateInterviweReport, generateResumePdf };
