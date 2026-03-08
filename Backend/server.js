const app = require('./src/app')
const connectDB = require("./src/config/db.connection");

// Connect to MongoDB
connectDB();

// ─── Start Server ─────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on PORT :${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});