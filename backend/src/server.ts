import express from "express";

const app = express();

app.get("/", (_, res) => {
  res.json({
    message: "API ONLINE"
  });
});

app.get("/health", (_, res) => {
  res.json({
    status: "online"
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
