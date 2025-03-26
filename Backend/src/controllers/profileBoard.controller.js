const service = require('../services/profileBoard.service');

const linkProfileToBoardHandler = async (req, res) => {
  try {
    const { profileId, boardId } = req.params;
    const result = await service.linkProfileAndBoard(profileId, boardId);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getProfileBoardsHandler = async (req, res) => {
  try {
    const { profileId } = req.params;
    const boards = await service.getProfileBoards(profileId);
    res.json(boards);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  linkProfileToBoardHandler,
  getProfileBoardsHandler,
};
