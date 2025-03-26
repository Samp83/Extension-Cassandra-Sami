const express = require('express');
const {
  linkProfileToBoardHandler,
  getProfileBoardsHandler,
} = require('../controllers/profileBoard.controller');

const router = express.Router();

router.post('/profiles/:profileId/boards/:boardId', linkProfileToBoardHandler);
router.get('/profiles/:profileId/boards', getProfileBoardsHandler);

module.exports = router;
