export const pizzas = [
  {
    id: 1,
    nome: 'Margherita',
    descricao: 'Molho de tomate, mozzarella fresca, manjericão',
    preco: 8.50,
    imagem: '/pizzas/margherita.jpg',
    categoria: 'classicas',
    disponivel: true
  },
  {
    id: 2,
    nome: 'Pepperoni',
    descricao: 'Molho de tomate, mozzarella, pepperoni picante',
    preco: 10.00,
    imagem: '/pizzas/pepperoni.jpg',
    categoria: 'classicas',
    disponivel: true
  },
  {
    id: 3,
    nome: 'Quatro Queijos',
    descricao: 'Mozzarella, gorgonzola, parmesão, provolone',
    preco: 11.50,
    imagem: '/pizzas/quatro-queijos.jpg',
    categoria: 'especiais',
    disponivel: true
  },
  {
    id: 4,
    nome: 'Portuguesa',
    descricao: 'Molho de tomate, mozzarella, fiambre, ovo, azeitonas',
    preco: 9.50,
    imagem: '/pizzas/portuguesa.jpg',
    categoria: 'classicas',
    disponivel: true
  },
  {
    id: 5,
    nome: 'Diavola',
    descricao: 'Molho de tomate, mozzarella, salame picante, piri-piri',
    preco: 10.50,
    imagem: '/pizzas/diavola.jpg',
    categoria: 'especiais',
    disponivel: false
  },
  {
    id: 6,
    nome: 'Vegetariana',
    descricao: 'Molho de tomate, mozzarella, cogumelos, pimentos, cebola, azeitonas',
    preco: 9.00,
    imagem: '/pizzas/vegetariana.jpg',
    categoria: 'especiais',
    disponivel: true
  }
];

export const lojas = [
  {
    id: 1,
    nome: 'Padre Gino\'s - Chiado',
    morada: 'Rua Garrett 25, Lisboa',
    telefone: '+351 21 123 4567',
    horario: '11:00 - 23:00',
    coordenadas: { lat: 38.7103, lng: -9.1422 }
  },
  {
    id: 2,
    nome: 'Padre Gino\'s - Ribeira',
    morada: 'Cais da Ribeira 45, Porto',
    telefone: '+351 22 987 6543',
    horario: '12:00 - 00:00',
    coordenadas: { lat: 41.1408, lng: -8.6135 }
  },
  {
    id: 3,
    nome: 'Padre Gino\'s - Marina',
    morada: 'Marina de Vilamoura 12, Faro',
    telefone: '+351 28 555 1234',
    horario: '11:30 - 23:30',
    coordenadas: { lat: 37.0748, lng: -8.1175 }
  }
];
