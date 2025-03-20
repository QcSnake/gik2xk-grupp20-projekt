const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Webbshop API funkar!');
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server körs på http://localhost:${PORT}`);
});