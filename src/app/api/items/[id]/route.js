import { readFile, writeFile } from "fs/promises";
import { join } from "path";

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

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const items = await readItems();

    const itemIndex = items.findIndex((item) => item.id === id);

    if (itemIndex === -1) {
      return new Response(JSON.stringify({ error: "Item not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const updatedItem = {
      ...items[itemIndex],
      itemName: body.itemName,
      price: parseFloat(body.price),
      description: body.description,
      updatedAt: new Date().toISOString(),
    };

    items[itemIndex] = updatedItem;
    await writeItems(items);

    return new Response(JSON.stringify(updatedItem), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating item:", error);
    return new Response(JSON.stringify({ error: "Failed to update item" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const items = await readItems();

    const updatedItems = items.filter((item) => item.id !== id);

    if (updatedItems.length === items.length) {
      return new Response(JSON.stringify({ error: "Item not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    await writeItems(updatedItems);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error deleting item:", error);
    return new Response(JSON.stringify({ error: "Failed to delete item" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
