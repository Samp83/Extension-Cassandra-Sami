const express = require('express');
const cors = require('cors');
const app = express();
const profileRoutes = require('./src/routes/profile.routes.js');
const boardRoutes = require('./src/routes/board.routes');
const elementRoutes = require('./src/routes/element.routes');
const profileBoardRoutes = require('./src/routes/profileBoard.routes');
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Hello from Express!' });
});
app.use('/api', profileRoutes);
app.use('/api', boardRoutes);
app.use('/api', elementRoutes);
app.use('/api', profileBoardRoutes);

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});