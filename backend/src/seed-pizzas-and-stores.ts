import { readFile } from "node:fs/promises";
import { prisma } from "./prisma";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dataStoresPath = join(__dirname, './data/stores.json');
const dataPizzasPath = join(__dirname, './data/pizzas.json');

/**
 * Helper function to read stores from JSON file
 */
async function getStores() {
    const data = await readFile(dataStoresPath, 'utf-8');
    return JSON.parse(data);
}

/**
 * Helper function to read pizzas from JSON file
 */
async function getPizzas() {
    const data = await readFile(dataPizzasPath, 'utf-8');
    return JSON.parse(data);
}

const seedStores = async () => {
    const stores = await getStores();

    await prisma.store.createMany({
        data: stores.map((store: any) => ({
            ...store,
            lat: store.coordenadas.lat,
            lng: store.coordenadas.lng,
            coordenadas: undefined,
        })),
    });
}

const seedPizzas = async () => {
    const pizzas = await getPizzas();

    await prisma.pizza.createMany({
        data: pizzas,
    });
}


const seed = async () => {
    // await seedStores();
    await seedPizzas();
}

seed();
