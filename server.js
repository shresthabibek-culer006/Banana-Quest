const express = require("express");
const app = express();
const PORT = 3000;

// Serve index.html, css and js files
app.use(express.static(__dirname));

// Our own endpoint: the browser calls this, the server calls the Banana API
app.get("/api/puzzle", async (req, res) => {
  try {
    const response = await fetch("http://marcconrad.com/uob/banana/api.php");
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(502).json({ error: "Could not reach the Banana API" });
  }
});

app.listen(PORT, () => {
  console.log(`Banana Quest running at http://localhost:${PORT}`);
});