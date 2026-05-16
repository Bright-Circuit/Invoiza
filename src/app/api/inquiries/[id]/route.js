import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

const inquiriesFilePath = path.join(process.cwd(), 'src', 'data', 'inquiry.json');

// Helper to read inquiries
function readInquiries() {
  try {
    const data = fs.readFileSync(inquiriesFilePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return { inquiries: [] };
  }
}

// Helper to write inquiries
function writeInquiries(data) {
  fs.writeFileSync(inquiriesFilePath, JSON.stringify(data, null, 2));
}

// GET: Fetch a single inquiry
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const data = readInquiries();
    const inquiry = data.inquiries.find((inq) => inq.id === id);

    if (!inquiry) {
      return NextResponse.json(
        { error: 'Inquiry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(inquiry, { status: 200 });
  } catch (error) {
    console.error('Error reading inquiry:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inquiry' },
      { status: 500 }
    );
  }
}

// PUT: Update an inquiry
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const formData = await request.json();
    const data = readInquiries();
    const index = data.inquiries.findIndex((inq) => inq.id === id);

    if (index === -1) {
      return NextResponse.json(
        { error: 'Inquiry not found' },
        { status: 404 }
      );
    }

    const updatedInquiry = {
      ...data.inquiries[index],
      ...formData,
      id,
      inquiryNumber: data.inquiries[index].inquiryNumber,
      createdAt: data.inquiries[index].createdAt,
      updatedAt: new Date().toISOString(),
    };

    data.inquiries[index] = updatedInquiry;
    writeInquiries(data);

    return NextResponse.json(updatedInquiry, { status: 200 });
  } catch (error) {
    console.error('Error updating inquiry:', error);
    return NextResponse.json(
      { error: 'Failed to update inquiry' },
      { status: 500 }
    );
  }
}

// DELETE: Delete an inquiry
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const data = readInquiries();
    const index = data.inquiries.findIndex((inq) => inq.id === id);

    if (index === -1) {
      return NextResponse.json(
        { error: 'Inquiry not found' },
        { status: 404 }
      );
    }

    data.inquiries.splice(index, 1);
    writeInquiries(data);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting inquiry:', error);
    return NextResponse.json(
      { error: 'Failed to delete inquiry' },
      { status: 500 }
    );
  }
}
