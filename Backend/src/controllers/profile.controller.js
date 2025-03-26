const { getAllProfilesService, getProfileByIdService, createNewProfile, updateExistingProfile, deleteExistingProfile } = require('../services/profile.service');

const getAllProfilesHandler = async (req, res) => {
  try {
    const profiles = await getAllProfilesService();
    res.status(200).json(profiles);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getProfileByIdHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const profile = await getProfileByIdService(id);
    if (!profile) return res.status(404).json({ error: 'Profile non trouvé' });
    res.status(200).json(profile);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const createProfileHandler = async (req, res) => {
  try {
    const { nom, couleur } = req.body;
    const profile = await createNewProfile(nom, couleur);
    res.status(201).json(profile);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const updateProfileHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, couleur } = req.body;
    const updatedProfile = await updateExistingProfile(id, nom, couleur);
    res.status(200).json(updatedProfile);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteProfileHandler = async (req, res) => {
    try {
      const { id } = req.params;
      await deleteExistingProfile(id);
      res.status(204).send(); // No Content
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };
  
  module.exports = {
    getAllProfilesHandler,
    getProfileByIdHandler,
    createProfileHandler,
    updateProfileHandler,
    deleteProfileHandler,
  };
