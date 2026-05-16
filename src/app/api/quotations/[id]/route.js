import { NextResponse } from 'next/server';
import { readJsonFile, writeJsonFile } from '../../../../lib/fileStore';

// Helper to read/write quotations
function readQuotations() {
  return readJsonFile('quotations.json') || { quotations: [] };
}

function writeQuotations(data) {
  writeJsonFile('quotations.json', data);
}

// GET: Fetch a quotation by ID
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const data = readQuotations();

    const quotation = data.quotations.find((q) => q.id === id);
    if (!quotation) {
      return NextResponse.json(
        { error: 'Quotation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(quotation, { status: 200 });
  } catch (error) {
    console.error('Error fetching quotation:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quotation' },
      { status: 500 }
    );
  }
}

// PUT: Update a quotation by ID
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const data = readQuotations();

    const quotationIndex = data.quotations.findIndex((q) => q.id === id);
    if (quotationIndex === -1) {
      return NextResponse.json(
        { error: 'Quotation not found' },
        { status: 404 }
      );
    }

    const updateData = await request.json();
    const updatedQuotation = {
      ...data.quotations[quotationIndex],
      ...updateData,
      id, // Preserve ID
      quotationNumber: data.quotations[quotationIndex].quotationNumber, // Preserve quotation number
      createdAt: data.quotations[quotationIndex].createdAt, // Preserve createdAt
      updatedAt: new Date().toISOString(),
    };

    data.quotations[quotationIndex] = updatedQuotation;
    writeQuotations(data);

    return NextResponse.json(updatedQuotation, { status: 200 });
  } catch (error) {
    console.error('Error updating quotation:', error);
    return NextResponse.json(
      { error: 'Failed to update quotation' },
      { status: 500 }
    );
  }
}

// DELETE: Delete a quotation by ID
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const data = readQuotations();

    const quotationIndex = data.quotations.findIndex((q) => q.id === id);
    if (quotationIndex === -1) {
      return NextResponse.json(
        { error: 'Quotation not found' },
        { status: 404 }
      );
    }

    data.quotations.splice(quotationIndex, 1);
    writeQuotations(data);

    return NextResponse.json({ message: 'Quotation deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting quotation:', error);
    return NextResponse.json(
      { error: 'Failed to delete quotation' },
      { status: 500 }
    );
  }
}
