import express from 'express';
// import { readFile, writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { prisma } from '../../prisma';
import { OrderStatus } from '../../../generated/prisma/enums';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// const dataPath = join(__dirname, '../data/orders.json');

/**
 * Helper functions to read/write orders
 */
async function getOrders() {
    try {
        // const orders = await prisma.order.findMany();
        const orders = await prisma.order.findMany({
            include: {
                items: {
                    select: {
                        id: true,
                        quantidade: true,
                        preco: true,
                        pizza: {
                            select: {
                                id: true,
                                nome: true,
                                preco: true
                            }
                        }
                    }
                }
            }
        });
        return orders;
    } catch {
        return [];
    }
}

// async function saveOrders(orders: any) {
//     await writeFile(dataPath, JSON.stringify(orders, null, 2));
// }

/**
 * GET /api/orders
 * Returns all orders (in real app, would be protected)
 */
router.get('/', async (req, res) => {
    try {
        const orders = await getOrders();
        res.json(orders);
    } catch (error) {
        console.error('Error reading orders:', error);
        res.status(500).json({ error: 'Erro ao carregar encomendas' });
    }
});

/**
 * POST /api/orders
 * Creates a new order
 */
router.post('/', async (req, res) => {
    try {
        const { nome, telefone, morada, items, observacoes } = req.body;

        // Validation
        if (!nome || !telefone || !morada || !items || items.length === 0) {
            return res.status(400).json({
                error: 'Dados inválidos',
                required: ['nome', 'telefone', 'morada', 'items']
            });
        }

        // Calculate total
        const total = items.reduce((sum: number, item: any) => {
            return sum + (item.preco * item.quantidade);
        }, 0);

        // Create order
        const newOrder = {
            nome,
            telefone,
            morada,
            items,
            observacoes: observacoes || '',
            total,
            status: OrderStatus.PENDENTE
        };

        // orders.push(newOrder);
        await prisma.order.create({
            data: { ...newOrder, items: { create: items.map((i: any) => ({ ...i, id: undefined, nome: undefined, pizza: { connect: { id: i.id } } })) } }
        });

        res.status(201).json({
            message: 'Encomenda criada com sucesso!',
            order: newOrder
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Erro ao criar encomenda' });
    }
});

/**
 * GET /api/orders/:id
 * Returns a single order by ID
 */
router.get('/:id', async (req, res) => {
    try {
        const orders = await getOrders();
        const order = orders.find((o: any) => o.id === parseInt(req.params.id));

        if (!order) {
            return res.status(404).json({ error: 'Encomenda não encontrada' });
        }

        res.json(order);
    } catch (error) {
        console.error('Error reading order:', error);
        res.status(500).json({ error: 'Erro ao carregar encomenda' });
    }
});

/**
 * PATCH /api/orders/:id/status
 * Updates an order's status with valid state transitions
 * 
 * Valid transitions (state machine):
 *   pendente → em preparação | cancelado
 *   em preparação → a caminho | cancelado
 *   a caminho → entregue
 *   entregue → (final state)
 *   cancelado → (final state)
 */



const VALID_TRANSITIONS: Record<string, string[]> = {
    'PENDENTE': ['EM_PREPARACAO', 'cancelado'],
    'EM_PREPARACAO': ['cancelado'],
    'ENTREGUE': [],
    'cancelado': [],
};

router.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ error: 'Status é obrigatório' });
        }

        const orderId = parseInt(req.params.id);

        const order = await prisma.order.findUnique({
            where: { id: orderId }
        });

        if (!order) {
            return res.status(404).json({ error: 'Encomenda não encontrada' });
        }

        // Validate transition
        const allowedNext = VALID_TRANSITIONS[order.status];
        if (!allowedNext || !allowedNext.includes(status)) {
            return res.status(400).json({
                error: `Transição inválida: "${order.status}" → "${status}"`,
                currentStatus: order.status,
                allowedTransitions: allowedNext || [],
            });
        }

        // Update status
        // order.status = status;
        // order.updatedAt = new Date().toISOString();
        await prisma.order.update({
            where: { id: orderId },
            data: { status }
        });

        res.json({
            message: `Status atualizado para "${status}"`,
            order,
        });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ error: 'Erro ao atualizar status' });
    }
});

export default router;

