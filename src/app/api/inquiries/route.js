import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';

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

// Get the next inquiry number
function getNextInquiryNumber() {
  const data = readInquiries();
  if (data.inquiries.length === 0) {
    return 'INQ#001';
  }
  const lastNumber = data.inquiries.length;
  const nextNumber = lastNumber + 1;
  return `INQ#${String(nextNumber).padStart(3, '0')}`;
}

// GET: Fetch all inquiries
export async function GET() {
  try {
    const data = readInquiries();
    return NextResponse.json(data.inquiries, { status: 200 });
  } catch (error) {
    console.error('Error reading inquiries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inquiries' },
      { status: 500 }
    );
  }
}

// POST: Create a new inquiry
export async function POST(request) {
  try {
    const formData = await request.json();
    const data = readInquiries();

    const newInquiry = {
      id: randomUUID(),
      inquiryNumber: getNextInquiryNumber(),
      date: formData.date,
      customerName: formData.customerName,
      phoneNumber: formData.phoneNumber,
      callStatus: formData.callStatus || 'pending',
      project: formData.project,
      comment: formData.comment || '',
      projectStatus: formData.projectStatus || 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    data.inquiries.push(newInquiry);
    writeInquiries(data);

    return NextResponse.json(newInquiry, { status: 201 });
  } catch (error) {
    console.error('Error creating inquiry:', error);
    return NextResponse.json(
      { error: 'Failed to create inquiry' },
      { status: 500 }
    );
  }
}
