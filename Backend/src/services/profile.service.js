const { getAllProfiles, getProfileById, createProfile, updateProfile, deleteProfile } = require('../repositories/profile.repository');


const getAllProfilesService = async () => {
  return await getAllProfiles();
};

const getProfileByIdService = async (id) => {
  return await getProfileById(id);
};


const createNewProfile = async (nom, couleur) => {
  if (!nom) throw new Error('Le nom est obligatoire');
  return await createProfile({ nom, couleur });
};

const updateExistingProfile = async (id, nom, couleur) => {
  if (!nom && !couleur) throw new Error('Aucune donnée à mettre à jour');

  const data = {};
  if (nom) data.nom = nom;
  if (couleur) data.couleur = couleur;

  return await updateProfile(id, data);
};

const deleteExistingProfile = async (id) => {
    return await deleteProfile(id);
  };
  
  module.exports = {
    getAllProfilesService,
    getProfileByIdService,
    createNewProfile,
    updateExistingProfile,
    deleteExistingProfile,
  };
