// repositories/profile.repository.js
const prisma = require('../../prisma/client');

const createProfile = async ({ nom, couleur }) => {
  return prisma.profile.create({
    data: { nom, couleur },
  });
};

const updateProfile = async (id, data) => {
  return prisma.profile.update({
    where: { id: parseInt(id) },
    data,
  });
};

const deleteProfile = async (id) => {
    return prisma.profile.delete({
      where: { id: parseInt(id) },
    });
  };
  
  module.exports = {
    createProfile,
    updateProfile,
    deleteProfile,
  };
