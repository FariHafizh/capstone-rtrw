const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { registerUser, loginUser } = require("./handlers/authHandler");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/api/register", registerUser);
app.post("/api/login", loginUser);

app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});
