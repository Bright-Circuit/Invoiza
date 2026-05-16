import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';

const quotationsFilePath = path.join(process.cwd(), 'src', 'data', 'quotations.json');

// Helper to read quotations
function readQuotations() {
  try {
    const data = fs.readFileSync(quotationsFilePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return { quotations: [] };
  }
}

// Helper to write quotations
function writeQuotations(data) {
  fs.writeFileSync(quotationsFilePath, JSON.stringify(data, null, 2));
}

// Get the next quotation number
function getNextQuotationNumber() {
  const data = readQuotations();
  if (data.quotations.length === 0) {
    return 'QUO#001';
  }
  const lastNumber = data.quotations.length;
  const nextNumber = lastNumber + 1;
  return `QUO#${String(nextNumber).padStart(3, '0')}`;
}

// GET: Fetch all quotations
export async function GET() {
  try {
    const data = readQuotations();
    return NextResponse.json(data.quotations, { status: 200 });
  } catch (error) {
    console.error('Error reading quotations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quotations' },
      { status: 500 }
    );
  }
}

// POST: Create a new quotation
export async function POST(request) {
  try {
    const formData = await request.json();
    const data = readQuotations();

    const newQuotation = {
      id: randomUUID(),
      quotationNumber: formData.quotationNumber || getNextQuotationNumber(),
      issuedDate: formData.issuedDate,
      dueDate: formData.dueDate,
      clientId: formData.clientId,
      clientName: formData.clientName,
      description: formData.description || '',
      items: formData.items || [],
      totalAmount: formData.totalAmount || 0,
      discount: formData.discount || 0,
      discountType: formData.discountType || 'amount',
      discountAmount: formData.discountAmount || 0,
      status: formData.status || 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    data.quotations.push(newQuotation);
    writeQuotations(data);

    return NextResponse.json(newQuotation, { status: 201 });
  } catch (error) {
    console.error('Error creating quotation:', error);
    return NextResponse.json(
      { error: 'Failed to create quotation' },
      { status: 500 }
    );
  }
}
