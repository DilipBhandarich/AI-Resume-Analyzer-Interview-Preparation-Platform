const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const interviewRouter = express.Router();
const upload = require("../middleware/file.middleware");
const interviewController = require("../controllers/interview.controller");
/**
 * @route POST /api/interview
 * @description Generate new interview report based on the candidate's resume pdf, self-description, and job description
 * @access Private
 */

interviewRouter.post(
  "/",
  authMiddleware,
  upload.single("resume"),
  interviewController.generateInterviewReportController,
);

/**
 * @route GET /api/interview/report/:interviewId
 * @description Get interview report by interviewId
 * @access Private
 */

interviewRouter.get(
  "/report/:interviewId",
  authMiddleware,
  interviewController.getInterviewReportByIdController,
);

/**
 * @route GET /api/interview
 * @description Get all interview reports
 * @access Private
 */

interviewRouter.get(
  "/",
  authMiddleware,
  interviewController.getAllInterviewReportsController,
);

/**
 * @route POST /api/interview/resume/pdf/:interviewReportId
 * @description Generate a PDF from the resume text based on user self-description, resume, and job description
 * @access Private
 */

interviewRouter.post(
  "/resume/pdf/:interviewReportId",
  authMiddleware,
  interviewController.generateResumePdfController,
);
module.exports = interviewRouter;
