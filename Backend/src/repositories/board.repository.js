const prisma = require('../../prisma/client');

const createBoard = async ({ title, description }) => {
  return prisma.boards.create({ data: { title, description } });
};

const getAllBoards = async () => {
  return prisma.boards.findMany();
};

const getBoardById = async (id) => {
  return prisma.boards.findUnique({ where: { id: parseInt(id) } });
};

const updateBoard = async (id, data) => {
  return prisma.boards.update({ where: { id: parseInt(id) }, data });
};

const deleteBoard = async (id) => {
  return prisma.boards.delete({ where: { id: parseInt(id) } });
};

module.exports = {
  createBoard,
  getAllBoards,
  getBoardById,
  updateBoard,
  deleteBoard,
};
