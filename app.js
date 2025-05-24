const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 9876;

// Correct Test Server API base URL
const BASE_URL = "http://20.244.56.144/test/numbers";

// Valid types
const VALID_TYPES = ['p', 'f', 'e', 'r']; // 'r' is the 4th one (random numbers)
const WINDOW_SIZE = 10;

// Your JWT token
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  // (use your full token here)

// In-memory window
let numberWindow = [];

app.get('/numbers/:numberid', async (req, res) => {
  const type = req.params.numberid;

  if (!VALID_TYPES.includes(type)) {
    return res.status(400).json({ error: "Invalid number type" });
  }

  const prevWindow = [...numberWindow];
  let newNumbers = [];

  try {
    const response = await Promise.race([
      axios.get(`${BASE_URL}/${type}`, {
        headers: { Authorization: `Bearer ${TOKEN}` }
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Timeout")), 500)
      )
    ]);

    if (response?.data?.numbers && Array.isArray(response.data.numbers)) {
      newNumbers = response.data.numbers;
      for (const num of newNumbers) {
        if (!numberWindow.includes(num)) {
          numberWindow.push(num);
          if (numberWindow.length > WINDOW_SIZE) {
            numberWindow.shift(); // remove oldest
          }
        }
      }
    }
  } catch (err) {
    console.error("Error or timeout:", err.message);
  }

  const avg =
    numberWindow.length > 0
      ? (
          numberWindow.reduce((sum, num) => sum + num, 0) /
          numberWindow.length
        ).toFixed(2)
      : 0;

  res.json({
    numbers: newNumbers,
    windowPrevState: prevWindow,
    windowCurrState: numberWindow,
    avg: parseFloat(avg),
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
