import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

const customersFilePath = path.join(process.cwd(), 'src', 'data', 'customers.json');

// Ensure the file exists
function ensureFile() {
  if (!fs.existsSync(customersFilePath)) {
    fs.writeFileSync(customersFilePath, JSON.stringify({ customers: [] }, null, 2));
  }
}

// GET: Fetch all customers
export async function GET() {
  try {
    ensureFile();
    const data = fs.readFileSync(customersFilePath, 'utf-8');
    const jsonData = JSON.parse(data);
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

    const data = fs.readFileSync(customersFilePath, 'utf-8');
    const jsonData = JSON.parse(data);
    
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
    fs.writeFileSync(customersFilePath, JSON.stringify(jsonData, null, 2));
    
    return NextResponse.json(newCustomer, { status: 201 });
  } catch (error) {
    console.error('Error creating customer:', error);
    return NextResponse.json(
      { error: 'Failed to create customer' },
      { status: 500 }
    );
  }
}
