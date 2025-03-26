const repo = require('../repositories/profileBoard.repository');

const linkProfileAndBoard = (profileId, boardId) => {
  return repo.linkProfileToBoard(profileId, boardId);
};

const getProfileBoards = async (profileId) => {
  const links = await repo.getBoardsForProfile(profileId);
  return links.map(link => link.board); 
};

module.exports = {
  linkProfileAndBoard,
  getProfileBoards,
};
