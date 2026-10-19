import axois from "axios";

const api = axois.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

/**
 * @description Generate new interview report based on the candidate's resume pdf, self-description, and job description
 */

export const generateInterviewReport = async ({
  jobDescription,
  selfDescription,
  resumeFile,
}) => {
  const formData = new FormData();
  formData.append("jobDescription", jobDescription);
  formData.append("selfDescription", selfDescription);
  formData.append("resume", resumeFile);

  const response = await api.post("/api/interview", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

/**
 * @description Get interview report by interviewId
 */
export const getInterviewReportById = async (interviewId) => {
  const response = await api.get(`/api/interview/report/${interviewId}`);
  return response.data;
};

/**
 * @description Get all interview reports
 */
export const getAllInterviewReports = async () => {
  const response = await api.get("/api/interview/");
  return response.data;
};

/**
 * @description Generate a PDF from the resume text based on user self-description, resume, and job description
 */
export const generateResumePdf = async ({ interviewReportId }) => {
  const response = await api.post(
    `/api/interview/resume/pdf/${interviewReportId}`,
    null,
    {
      responseType: "blob",
    },
  );
  return response.data;
};
