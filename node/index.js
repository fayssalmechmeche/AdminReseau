const express = require("express");
const pg = require("pg");

const { Client } = pg;
const client = new Client();

const app = express();
const PORT = 8081;

app.use(express.json());

app.get("/", async (req, res) => {
  try {
    const { rows } = await client.query("SELECT * FROM users");
    res.send(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, async () => {
  await client.connect();
  console.log(`Server running on port ${PORT}`);
});
