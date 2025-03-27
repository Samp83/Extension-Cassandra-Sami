const service = require('../services/board.service');

const createBoardHandler = async (req, res) => {
  try {
    const { title, description } = req.body;
    const board = await service.createNewBoard(title, description);
    res.status(201).json(board);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getBoardsHandler = async (req, res) => {
  const boards = await service.getBoards();
  res.json(boards);
};

const getBoardHandler = async (req, res) => {
  const { id } = req.params;
  const board = await service.getBoard(id);
  if (!board) return res.status(404).json({ error: 'Board non trouvé' });
  res.json(board);
};

const updateBoardHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const board = await service.updateExistingBoard(id, title, description);
    res.json(board);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteBoardHandler = async (req, res) => {
  try {
    const { id } = req.params;

    // Supprimer les relations dans ProfileBoards avant de supprimer le board
    await prisma.profileBoards.deleteMany({
      where: { boardId: parseInt(id) },
    });

    // Ensuite, supprimer le board
    await service.deleteExistingBoard(id);

    res.status(204).send(); // Renvoie un code 204 (pas de contenu) après suppression
  } catch (err) {
    console.error("Erreur lors de la suppression du board :", err);
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  createBoardHandler,
  getBoardsHandler,
  getBoardHandler,
  updateBoardHandler,
  deleteBoardHandler,
};
