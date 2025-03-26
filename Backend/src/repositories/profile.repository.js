const prisma = require('../../prisma/client');


const getAllProfiles = async () => {
    return prisma.profile.findMany();
}

const getProfileById = async (id) => {
    return prisma.profile.findUnique({
      where: { id: parseInt(id) },
    });
  }

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
    getAllProfiles,
    getProfileById,
    createProfile,
    updateProfile,
    deleteProfile,
  };
