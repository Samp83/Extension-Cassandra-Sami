const express = require('express');
const {
  getAllProfilesHandler,
  getProfileByIdHandler,
  createProfileHandler,
  updateProfileHandler,
  deleteProfileHandler
} = require('../controllers/profile.controller');

const router = express.Router();

router.get('/profiles', getAllProfilesHandler);
router.get('/profiles/:id', getProfileByIdHandler);
router.post('/profiles', createProfileHandler);
router.put('/profiles/:id', updateProfileHandler);
router.delete('/profiles/:id', deleteProfileHandler); 

module.exports = router;
