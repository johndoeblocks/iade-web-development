import express from 'express';

const app = express();

const pizzas = [{
    id: 1,
    name: 'MargheritaSSS',
    price: 10,
},
{
    id: 2,
    name: 'Pepperoni',
    price: 12,
},
{
    id: 3,
    name: 'Vegetariana',
    price: 11,
}]

app.get('/pizzas', (req, res) => {
    res.json(pizzas);
});

app.get('/', (req, res) => {
    res.send('Bem-vindo à API de Pizzas!');
});

app.listen(3000, () => {
    console.log('Servidor a correr na porta 3000');
});
