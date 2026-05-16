import { NextResponse } from 'next/server';
import { readJsonFile, writeJsonFile, ensureJsonFile } from '../../../lib/fileStore';

// Ensure the file exists (in writable temp dir) and seed from project data
function ensureFile() {
  ensureJsonFile('customers.json', { customers: [] });
}

// GET: Fetch all customers
export async function GET() {
  try {
    ensureFile();
    const jsonData = readJsonFile('customers.json') || { customers: [] };
    return NextResponse.json(jsonData.customers || [], { status: 200 });
  } catch (error) {
    console.error('Error reading customers:', error);
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
  }
}

// POST: Create a new customer
export async function POST(request) {
  try {
    ensureFile();
    const body = await request.json();
    
    // Validate required fields
    if (!body.customerName || !body.email) {
      return NextResponse.json(
        { error: 'Customer name and email are required' },
        { status: 400 }
      );
    }

    const jsonData = readJsonFile('customers.json') || { customers: [] };
    
    // Create new customer object with unique ID
    const newCustomer = {
      id: Date.now().toString(),
      customerName: body.customerName,
      companyName: body.companyName || '',
      businessNumber: body.businessNumber || '',
      email: body.email,
      phoneNumber: body.phoneNumber || '',
      country: body.country || '',
      billingAddress: body.billingAddress || '',
      status: 'Completed',
      createdAt: new Date().toISOString(),
    };

    jsonData.customers.push(newCustomer);
    writeJsonFile('customers.json', jsonData);
    
    return NextResponse.json(newCustomer, { status: 201 });
  } catch (error) {
    console.error('Error creating customer:', error);
    return NextResponse.json(
      { error: 'Failed to create customer' },
      { status: 500 }
    );
  }
}
