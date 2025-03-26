const prisma = require('../../prisma/client');

const createElement = async (data) => {
  return prisma.element.create({ data });
};

const getElementsByBoardId = async (boardId) => {
  return prisma.element.findMany({
    where: { boardId: parseInt(boardId) },
  });
};

const updateElement = async (id, data) => {
  return prisma.element.update({
    where: { id: parseInt(id) },
    data,
  });
};

const deleteElement = async (id) => {
  return prisma.element.delete({
    where: { id: parseInt(id) },
  });
};

module.exports = {
  createElement,
  getElementsByBoardId,
  updateElement,
  deleteElement,
};
