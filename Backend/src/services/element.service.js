const repo = require('../repositories/element.repository');

const createNewElement = (data) => {
  if (!data.type || !data.content || !data.posX || !data.posY  || !data.width || !data.height || !data.boardId) {
    throw new Error('Type, content, posX, posY, width, height et boardId sont requis');
  }
  return repo.createElement(data);
};

const getBoardElements = (boardId) => repo.getElementsByBoardId(boardId);
const updateExistingElement = (id, data) => repo.updateElement(id, data);
const deleteExistingElement = (id) => repo.deleteElement(id);

module.exports = {
  createNewElement,
  getBoardElements,
  updateExistingElement,
  deleteExistingElement,
};

