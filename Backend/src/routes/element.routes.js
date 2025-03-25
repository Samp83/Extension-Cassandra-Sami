const express = require('express');
const {
  createElementHandler,
  getElementsHandler,
  updateElementHandler,
  deleteElementHandler,
} = require('../controllers/element.controller');

const router = express.Router();

router.post('/elements', createElementHandler);
router.get('/boards/:boardId/elements', getElementsHandler); 
router.put('/elements/:id', updateElementHandler);
router.delete('/elements/:id', deleteElementHandler);

module.exports = router;
