const { default: mongoose } = require("mongoose");
mongoose.set("strictQuery", false);

const dbConnect = () => {
  try {
    const conn = mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database Connect Successfully");
  } catch (error) {
    console.log("Database Error");
  }
};

module.exports = dbConnect;
