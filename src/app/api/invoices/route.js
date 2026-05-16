import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';

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

// Get the next invoice number
function getNextInvoiceNumber() {
  const data = readInvoices();
  if (data.invoices.length === 0) {
    return 'INV#001';
  }
  const lastNumber = data.invoices.length;
  const nextNumber = lastNumber + 1;
  return `INV#${String(nextNumber).padStart(3, '0')}`;
}

// GET: Fetch all invoices
export async function GET() {
  try {
    const data = readInvoices();
    return NextResponse.json(data.invoices, { status: 200 });
  } catch (error) {
    console.error('Error reading invoices:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invoices' },
      { status: 500 }
    );
  }
}

// POST: Create a new invoice
export async function POST(request) {
  try {
    const formData = await request.json();
    const data = readInvoices();

    const newInvoice = {
      id: randomUUID(),
      invoiceNumber: formData.invoiceNumber || getNextInvoiceNumber(),
      issuedDate: formData.issuedDate,
      dueDate: formData.dueDate,
      clientId: formData.clientId,
      clientName: formData.clientName,
      description: formData.description || '',
      additionalNote: formData.additionalNote || '',
      items: formData.items || [],
      totalAmount: formData.totalAmount || 0,
      discount: formData.discount || 0,
      discountType: formData.discountType || 'amount',
      discountAmount: formData.discountAmount || 0,
      status: formData.status || 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    data.invoices.push(newInvoice);
    writeInvoices(data);

    return NextResponse.json(newInvoice, { status: 201 });
  } catch (error) {
    console.error('Error creating invoice:', error);
    return NextResponse.json(
      { error: 'Failed to create invoice' },
      { status: 500 }
    );
  }
}
