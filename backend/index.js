const express = require("express");
const vaccineRouter = require('./routes/vaccine.routes');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/vaccine', vaccineRouter);
app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

