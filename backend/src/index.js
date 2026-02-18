import express from "express";

import cors from "cors";

import { fileURLToPath } from "url";
import { dirname, join } from "path";

import pizzasRouter from "./routes/pizzas.js";
import storesRouter from "./routes/stores.js";
import ordersRouter from "./routes/orders.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files (admin page, etc.)
app.use(express.static(join(__dirname, "public")));

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use("/api/pizzas", pizzasRouter);
app.use("/api/stores", storesRouter);
app.use("/api/orders", ordersRouter);

// Admin page (served by Express)
app.get("/admin", (req, res) => {
  res.sendFile(join(__dirname, "public", "admin.html"));
});

// Lojas page
app.get("/lojas", (req, res) => {
  res.sendFile(join(__dirname, "public", "lojas.html"));
});

// Pizzas page
app.get("/pizzas", (req, res) => {
  res.sendFile(join(__dirname, "public", "pizzas.html"));
});

// Root route
app.get("/", (req, res) => {
  const dados = {
    message: "Bem-vindo à API da Padre Gino'ssss! 🍕",
    endpoints: {
      pizzas: "/api/pizzas",
      pizzaOfTheDay: "/api/pizzas/pizza-of-the-day",
      stores: "/api/stores",
      orders: "/api/orders",
    },
    pages: {
      lojas: "/lojas",
      pizzas: "/pizzas",
      admin: "/admin",
    },
  };

  res.json(dados);
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint não encontrado" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({ error: "Erro interno do servidor" });
});

// Start server
app.listen(PORT, () => {
  console.log(`🍕 Padre Gino's API running on http://localhost:${PORT}`);
});
