import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

const invoicesFilePath = path.join(process.cwd(), 'src', 'data', 'invoices.json');

// Helper to read invoices
function readInvoices() {
  try {
    const data = fs.readFileSync(invoicesFilePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return { invoices: [] };
  }
}

// Helper to write invoices
function writeInvoices(data) {
  fs.writeFileSync(invoicesFilePath, JSON.stringify(data, null, 2));
}

// GET: Fetch a single invoice
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const data = readInvoices();
    const invoice = data.invoices.find((inv) => inv.id === id);

    if (!invoice) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(invoice, { status: 200 });
  } catch (error) {
    console.error('Error reading invoice:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invoice' },
      { status: 500 }
    );
  }
}

// PUT: Update an invoice
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const formData = await request.json();
    const data = readInvoices();
    const index = data.invoices.findIndex((inv) => inv.id === id);

    if (index === -1) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

    const updatedInvoice = {
      ...data.invoices[index],
      ...formData,
      id,
      invoiceNumber: data.invoices[index].invoiceNumber,
      createdAt: data.invoices[index].createdAt,
      updatedAt: new Date().toISOString(),
    };

    data.invoices[index] = updatedInvoice;
    writeInvoices(data);

    return NextResponse.json(updatedInvoice, { status: 200 });
  } catch (error) {
    console.error('Error updating invoice:', error);
    return NextResponse.json(
      { error: 'Failed to update invoice' },
      { status: 500 }
    );
  }
}

// DELETE: Delete an invoice
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const data = readInvoices();
    const index = data.invoices.findIndex((inv) => inv.id === id);

    if (index === -1) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

    data.invoices.splice(index, 1);
    writeInvoices(data);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting invoice:', error);
    return NextResponse.json(
      { error: 'Failed to delete invoice' },
      { status: 500 }
    );
  }
}
