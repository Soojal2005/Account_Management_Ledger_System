import connectDB from "./config/db.js";
import app from "./app.js";

connectDB();
app.listen(process.env.PORT, () => {
  console.log(`Jerry is running on port ${process.env.PORT}`);
});