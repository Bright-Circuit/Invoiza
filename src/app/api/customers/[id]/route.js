import { NextResponse } from 'next/server';
import { readJsonFile, writeJsonFile } from '../../../../lib/fileStore';

// PUT: Update a customer by ID
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const jsonData = readJsonFile('customers.json') || { customers: [] };

    const customerIndex = jsonData.customers.findIndex((c) => c.id === id);
    if (customerIndex === -1) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    const updateData = await request.json();
    const updatedCustomer = {
      ...jsonData.customers[customerIndex],
      ...updateData,
      id, // Preserve ID
      createdAt: jsonData.customers[customerIndex].createdAt, // Preserve createdAt
      updatedAt: new Date().toISOString(),
    };

    jsonData.customers[customerIndex] = updatedCustomer;
    writeJsonFile('customers.json', jsonData);

    return NextResponse.json(updatedCustomer, { status: 200 });
  } catch (error) {
    console.error('Error updating customer:', error);
    return NextResponse.json(
      { error: 'Failed to update customer' },
      { status: 500 }
    );
  }
}

// DELETE: Delete a customer by ID
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const jsonData = readJsonFile('customers.json') || { customers: [] };

    const customerIndex = jsonData.customers.findIndex((c) => c.id === id);
    if (customerIndex === -1) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    jsonData.customers.splice(customerIndex, 1);
    writeJsonFile('customers.json', jsonData);

    return NextResponse.json({ message: 'Customer deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting customer:', error);
    return NextResponse.json(
      { error: 'Failed to delete customer' },
      { status: 500 }
    );
  }
}
