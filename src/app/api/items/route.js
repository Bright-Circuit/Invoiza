import { readFile, writeFile } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";

const DATA_FILE = join(process.cwd(), "src", "data", "items.json");

async function readItems() {
  try {
    const data = await readFile(DATA_FILE, "utf8");
    return JSON.parse(data || "[]");
  } catch (error) {
    return [];
  }
}

async function writeItems(items) {
  await writeFile(DATA_FILE, JSON.stringify(items, null, 2));
}

export async function GET() {
  try {
    const items = await readItems();
    return new Response(JSON.stringify(items), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error reading items:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch items" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const items = await readItems();

    const newItem = {
      id: randomUUID(),
      itemName: body.itemName,
      price: parseFloat(body.price),
      description: body.description,
      createdAt: new Date().toISOString(),
    };

    items.push(newItem);
    await writeItems(items);

    return new Response(JSON.stringify(newItem), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating item:", error);
    return new Response(JSON.stringify({ error: "Failed to create item" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
