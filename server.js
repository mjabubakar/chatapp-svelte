const express = require("express");
const app = express();
require("dotenv/config");

const PORT = process.env.PORT || 5000;
const TEMPLATE = "dist/__app.html";
 
// serve assets, if they exist
app.use(express.static("dist"));

// otherwise serve Routify
app.get("*", async (req, res) => {
  res.sendFile(TEMPLATE, { root: __dirname });
});

// start server
app.listen(PORT);
console.log("serving on port", PORT);
