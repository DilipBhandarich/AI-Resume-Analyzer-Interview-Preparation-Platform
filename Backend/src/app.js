const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://ec2-54-160-155-15.compute-1.amazonaws.com",
    ],
    credentials: true,
  }),
);
// require all the routes here
const authRouter = require("./routes/auth.routes");
const interviewRouter = require("./routes/interview.routes");
// using all the routes here
app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);

app.use((err, _req, res, _next) => {
  if (err?.name === "ZodError") {
    return res.status(400).json({ message: "Invalid request data", issues: err.issues });
  }
  if (err?.message === "Only PDF resumes are supported" || err?.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ message: err.message || "Uploaded file is too large" });
  }
  console.error(err);
  return res.status(500).json({ message: "Internal server error" });
});

module.exports = app;
