require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/config/database");

connectDB();

app.get("/test", (req, res) => {
  res.send("Hello Mister Dileep Bhandari ");
});
app.listen(8080, () => {
  console.log("Server is running at port 8080");
});
