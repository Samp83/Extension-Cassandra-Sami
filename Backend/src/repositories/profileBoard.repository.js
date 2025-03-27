const prisma = require('../../prisma/client');

const linkProfileToBoard = async (profileId, boardId) => {
  const existing = await prisma.profileBoards.findUnique({
    where: {
      profileId_boardId: {
        profileId: parseInt(profileId),
        boardId: parseInt(boardId),
      },
    },
  });

  if (existing) {
    return existing; 
  }

  return prisma.profileBoards.create({
    data: {
      profileId: parseInt(profileId),
      boardId: parseInt(boardId),
    },
  });
};

const getBoardsForProfile = async (profileId) => {
  return prisma.profileBoards.findMany({
    where: {
      profileId: parseInt(profileId),
    },
    include: {
      board: true, 
    },
  });
};

module.exports = {
  linkProfileToBoard,
  getBoardsForProfile,
};
