import {
  getAllInterviewReports,
  getInterviewReportById,
  generateInterviewReport,
  generateResumePdf,
} from "../services/interview.api.js";
import { useContext, useEffect } from "react";
import { InterviewContext } from "../interview.context.jsx";
import { useParams } from "react-router";
export const useInterview = () => {
  const context = useContext(InterviewContext);
  const { interviewId } = useParams();
  if (!context) {
    throw new Error("useInterview must be used within an InterviewProvider");
  }

  const {
    loading,
    setLoading,
    report,
    setReport,
    reports: reportList,
    setReports,
  } = context;

  const generateReport = async ({
    jobDescription,
    selfDescription,
    resumeFile,
  }) => {
    setLoading(true);
    let response = null;
    try {
      response = await generateInterviewReport({
        jobDescription,
        selfDescription,
        resumeFile,
      });
      setReport(response.interviewReport);
    } catch (error) {
      console.error("Error generating interview report:", error);
    } finally {
      setLoading(false);
    }
    return response?.interviewReport ?? null;
  };

  const getReportById = async (interviewId) => {
    setLoading(true);
    let response = null;
    try {
      response = await getInterviewReportById(interviewId);
      setReport(response.interviewReport);
    } catch (err) {
      console.log("Error fetching interview report by ID:", err);
    } finally {
      setLoading(false);
    }
    return response?.interviewReport ?? null;
  };

  const getReports = async () => {
    setLoading(true);
    let response = null;
    try {
      response = await getAllInterviewReports();
      setReports(response.interviewReports);
    } catch (err) {
      console.log("Error fetching all interview reports:", err);
    } finally {
      setLoading(false);
    }
    return response?.interviewReports ?? [];
  };

  const generateResumePdfReport = async ({ interviewReportId }) => {
    setLoading(true);
    let response = null;
    try {
      const pdfBlob = await generateResumePdf({ interviewReportId });
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `resume_${interviewReportId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      response = { pdfBuffer: pdfBlob };
    } catch (err) {
      console.log("Error generating resume PDF:", err);
    } finally {
      setLoading(false);
    }
    return response?.pdfBuffer ?? null;
  };

  useEffect(() => {
    if (interviewId) {
      getReportById(interviewId);
    } else {
      getReports();
    }
  }, [interviewId]);
  return {
    loading,
    report,
    reports: reportList,
    generateReport,
    getReportById,
    getReports,
    generateResumePdfReport,
  };
};
