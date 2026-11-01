const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const fs = require("node:fs");
const path = require("node:path");
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

// Serve the Vite production build when the frontend has been built. The SPA
// fallback is needed so routes such as /login work on a direct page refresh.
const frontendDist = path.resolve(__dirname, "../../Frontend/dist");
const frontendIndex = path.join(frontendDist, "index.html");
if (fs.existsSync(frontendIndex)) {
  app.use(express.static(frontendDist));
  app.get("/{*path}", (req, res, next) => {
    if (req.path.startsWith("/api/")) return next();
    return res.sendFile(frontendIndex, (error) => {
      if (error) next(error);
    });
  });
}

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
