const mongoose = require("mongoose");

/**
 * - job description schema : String
 * - resume text : String
 * - Self description : String
 *
 * - matchScore : Number
 *
 * - Technical questions:
 *  [{
 *      questions:"",
 *      intention:"",
 *      answer:""
 *  }]
 *
 * - Behavioral questions:
 *  [{
 *      questions:"",
 *      intention:"",
 *      answer:""
 *  }]
 *
 * Skill gaps:[{
 *      skill:"",
 *      serverity:{
 *      type:String,
 *      enum:["low","medium","high"]
 * }
 * }]
 *
 * - preparaion plan : [{
 *      day : Number,
 *      focus:String,
 *      tasks[String]
 * }]
 *
 */

const technicalQuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, "question is required"],
    },
    intention: {
      type: String,
      required: [true, "intention is required"],
    },
    answer: {
      type: String,
      required: [true, "answer is required"],
    },
  },
  {
    id: false,
  },
);

const behavioralQuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, "question is required"],
    },
    intention: {
      type: String,
      required: [true, "intention is required"],
    },
    answer: {
      type: String,
      required: [true, "answer is required"],
    },
  },
  {
    id: false,
  },
);

const SkillGapSchema = new mongoose.Schema(
  {
    skill: {
      type: String,
      required: [true, "skill is required"],
    },
    severity: {
      type: String,
      enum: ["low", "medium", "high"],
      required: [true, "severity is required"],
    },
  },
  {
    id: false,
  },
);

const preparationPlanSchema = new mongoose.Schema({
  day: {
    type: Number,
    required: [true, "day is required"],
  },
  focus: {
    type: String,
    required: [true, "focus is required"],
  },
  tasks: [
    {
      type: String,
      required: [true, "task is required"],
    },
  ],
});
const intervReportSchema = new mongoose.Schema({
  jobDescription: {
    type: String,
    required: [true, "job description is required"],
  },
  resume: {
    type: String,
  },
  selfDescription: {
    type: String,
  },
  matchScore: {
    type: Number,
    min: 0,
    max: 100,
  },
  technicalQuestions: [technicalQuestionSchema],
  behavioralQuestions: [behavioralQuestionSchema],
  skillGaps: [SkillGapSchema],
  preparationPlan: [preparationPlanSchema],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  title: {
    type: String,
    required: [true, "title is required"],
  },
}, { timestamps: true });

const InterviewReport = mongoose.model("InterviewReport", intervReportSchema);

module.exports = InterviewReport;
