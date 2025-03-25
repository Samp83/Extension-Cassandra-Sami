const repo = require('../repositories/board.repository');

const createNewBoard = async (title, description) => {
  if (!title) throw new Error('Le titre est requis');
  return repo.createBoard({ title, description });
};

const getBoards = () => repo.getAllBoards();
const getBoard = (id) => repo.getBoardById(id);
const updateExistingBoard = (id, title, description) =>
  repo.updateBoard(id, { title, description });
const deleteExistingBoard = (id) => repo.deleteBoard(id);

module.exports = {
  createNewBoard,
  getBoards,
  getBoard,
  updateExistingBoard,
  deleteExistingBoard,
};
