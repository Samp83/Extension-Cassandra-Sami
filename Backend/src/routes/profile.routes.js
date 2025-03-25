// routes/profile.routes.js
const express = require('express');
const {
  createProfileHandler,
  updateProfileHandler,
  deleteProfileHandler
} = require('../controllers/profile.controller');

const router = express.Router();

router.post('/profiles', createProfileHandler);
router.put('/profiles/:id', updateProfileHandler);
router.delete('/profiles/:id', deleteProfileHandler); 

module.exports = router;
