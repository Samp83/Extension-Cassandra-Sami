const service = require('../services/element.service');

const createElementHandler = async (req, res) => {
  try {
    const data = req.body;
    const element = await service.createNewElement(data);
    res.status(201).json(element);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getElementsHandler = async (req, res) => {
  const { boardId } = req.params;
  const elements = await service.getBoardElements(boardId);
  res.json(elements);
};

const updateElementHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await service.updateExistingElement(id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteElementHandler = async (req, res) => {
  try {
    const { id } = req.params;
    await service.deleteExistingElement(id);
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  createElementHandler,
  getElementsHandler,
  updateElementHandler,
  deleteElementHandler,
};
