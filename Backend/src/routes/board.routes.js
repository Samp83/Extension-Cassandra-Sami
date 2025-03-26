const express = require('express');
const {
  createBoardHandler,
  getBoardsHandler,
  getBoardHandler,
  updateBoardHandler,
  deleteBoardHandler,
} = require('../controllers/board.controller');

const router = express.Router();

router.post('/boards', createBoardHandler);
router.get('/boards', getBoardsHandler);
router.get('/boards/:id', getBoardHandler);
router.put('/boards/:id', updateBoardHandler);
router.delete('/boards/:id', deleteBoardHandler);

module.exports = router;
