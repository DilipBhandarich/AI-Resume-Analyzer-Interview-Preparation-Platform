const pdfParse = require("pdf-parse");
const {
  generateInterviweReport,
  generateResumePdf,
} = require("../services/ai.service");
const interviewReportModel = require("../models/interviewReport.model");
const mongoose = require("mongoose");

/**
 * @description Generate new interview report based on the candidate's resume pdf, self-description, and job description
 */
async function generateInterviewReportController(req, res) {
  if (!req.file) {
    return res.status(400).json({
      message:
        'Resume PDF is required. Send it as a multipart/form-data file field named "resume".',
      receivedContentType: req.get("content-type") || null,
      receivedTextFields: Object.keys(req.body || {}),
    });
  }

  const { selfDescription, jobDescription } = req.body;
  if (!selfDescription || !jobDescription) {
    return res.status(400).json({
      message: "Both selfDescription and jobDescription are required.",
    });
  }

  const resumeContent = await new pdfParse.PDFParse(
    Uint8Array.from(req.file.buffer),
  ).getText();

  const interviewReportByAi = await generateInterviweReport({
    resume: resumeContent.text,
    selfDescription,
    jobDescription,
  });

  const interviewReport = await interviewReportModel.create({
    user: req.user.id,
    resume: resumeContent.text,
    selfDescription,
    jobDescription,
    ...interviewReportByAi,
  });

  res.status(200).json({
    message: "Interview report generated successfully",
    interviewReport,
  });
}

/**
 * @description Get interview report by interviewId
 */
async function getInterviewReportByIdController(req, res) {
  const { interviewId } = req.params;

  const interviewReport = await interviewReportModel.findOne({
    _id: interviewId,
    user: req.user.id,
  });
  if (!interviewReport) {
    return res.status(404).json({
      message: "Interview report not found",
    });
  }

  res.status(200).json({
    message: "Interview report retrieved successfully",
    interviewReport,
  });
}

/**
 * @route GET /api/interview
 * @description get all interview reports
 * @abstraction Private
 */

async function getAllInterviewReportsController(req, res) {
  const interviewReports = await interviewReportModel
    .find({ user: req.user.id })
    .sort({ createdAt: -1 })
    .select(
      "-resume -selfDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan",
    );

  res.status(200).json({
    message: "Interview reports retrieved successfully",
    interviewReports,
  });
}
/**
 * @description Controller to generate a PDF from the resume text based on user selfdescription resume and job description
 */
async function generateResumePdfController(req, res) {
  const { interviewReportId } = req.params;

  if (!mongoose.isValidObjectId(interviewReportId)) {
    return res.status(400).json({
      message: "Invalid interview report ID",
    });
  }

  const interviewReport =
    await interviewReportModel.findOne({
      _id: interviewReportId,
      user: req.user.id,
    });

  if (!interviewReport) {
    return res.status(404).json({
      message: "Interview report not found",
    });
  }

  const { resume, selfDescription, jobDescription } = interviewReport;

  const pdfBuffer = await generateResumePdf({
    resume,
    selfDescription,
    jobDescription,
  });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=resume_${interviewReportId}.pdf`,
  );

  res.send(pdfBuffer);
}

module.exports = {
  generateInterviewReportController,
  getInterviewReportByIdController,
  getAllInterviewReportsController,
  generateResumePdfController,
};
