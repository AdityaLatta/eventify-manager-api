import express from "express";

const app = express();

const PORT = process.env.Port || 3000;

app.get("/", (req, res) => {
    res.json({
        message: "Hello world",
    });
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
