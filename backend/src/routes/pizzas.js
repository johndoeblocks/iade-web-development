import express from 'express';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const router = express.Router();

// Get current directory (ES modules way)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dataPath = join(__dirname, '../data/pizzas.json');

/**
 * Helper function to read pizzas from JSON file
 */
async function getPizzas() {
  const data = await readFile(dataPath, 'utf-8');
  return JSON.parse(data);
}

/**
 * GET /api/pizzas
 * Returns all pizzas
 */


router.get('/', async (req, res) => {
  try {
    const pizzas = await getPizzas();

    // Optional filtering by category
    const { categoria } = req.query;
    if (categoria) {
      const filtered = pizzas.filter(p => p.categoria === categoria);
      return res.json(filtered);
    }

    res.json(pizzas);
  } catch (error) {
    console.error('Error reading pizzas:', error);
    res.status(500).json({ error: 'Erro ao carregar pizzas' });
  }
});

/**
 * GET /api/pizzas/pizza-of-the-day
 * Returns a random available pizza as pizza of the day
 */


router.get('/pizza-of-the-day', async (req, res) => {
  try {
    const pizzas = await getPizzas();
    const available = pizzas.filter(p => p.disponivel);

    // Simple "random" based on day of year
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
    const pizzaOfTheDay = available[dayOfYear % available.length];

    // Add a discount
    res.json({
      ...pizzaOfTheDay,
      precoOriginal: pizzaOfTheDay.preco * 1.2,
      destaque: true
    });
  } catch (error) {
    console.error('Error getting pizza of the day:', error);
    res.status(500).json({ error: 'Erro ao obter pizza do dia' });
  }
});

/**
 * GET /api/pizzas/:id
 * Returns a single pizza by ID
 */


// PATH PARAMETER


router.get('/:id', async (req, res) => {
  try {
    const pizzaId = parseInt(req.params.id);

    const pizzas = await getPizzas();

    const pizza = pizzas.find(p => p.id === pizzaId);

    if (!pizza) {
      return res.status(404).json({ error: 'Pizza não encontrada' });
    }

    res.json(pizza);
  } catch (error) {
    console.error('Error reading pizza:', error);
    res.status(500).json({ error: 'Erro ao carregar pizza' });
  }
});

export default router;
