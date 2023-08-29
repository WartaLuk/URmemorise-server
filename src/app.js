const express = require("express");
const app = express();
const userRoutes = require("./routes/userRoutes");
const photoRoutes = require("./routes/photoRoutes");
const commentRoutes = require("./routes/commentRoutes");

app.use(express.json());

// Middleware do obsługi statycznych zasobów
app.use("/uploads", express.static("uploads"));

// Definicje tras
app.use("/api/users", userRoutes);
app.use("/api/photos", photoRoutes);
app.use("/api/comments", commentRoutes);

// Obsługa błędów (prosty przykład)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Server ERROR!", { error: err.message });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
