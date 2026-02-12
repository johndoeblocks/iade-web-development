import express from 'express';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dataPath = join(__dirname, '../data/stores.json');

/**
 * Helper function to read stores from JSON file
 */
async function getStores() {
  const data = await readFile(dataPath, 'utf-8');
  return JSON.parse(data);
}

/**
 * GET /api/stores
 * Returns all stores
 */
router.get('/', async (req, res) => {
  try {
    const stores = await getStores();
    res.json(stores);
  } catch (error) {
    console.error('Error reading stores:', error);
    res.status(500).json({ error: 'Erro ao carregar lojas' });
  }
});

/**
 * GET /api/stores/:id
 * Returns a single store by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const stores = await getStores();
    const store = stores.find(s => s.id === parseInt(req.params.id));

    if (!store) {
      return res.status(404).json({ error: 'Loja não encontrada' });
    }

    res.json(store);
  } catch (error) {
    console.error('Error reading store:', error);
    res.status(500).json({ error: 'Erro ao carregar loja' });
  }
});

export default router;
