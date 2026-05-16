import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

const companyFilePath = path.join(process.cwd(), 'src', 'data', 'company.json');

// Ensure the file exists
function ensureFile() {
  if (!fs.existsSync(companyFilePath)) {
    fs.writeFileSync(
      companyFilePath,
      JSON.stringify(
        {
          companyId: 'OXY12',
          companyName: 'OXY12',
          companyEmail: 'oxy2welve@gmail.com',
          businessNumber: '+94 71 195 0429',
          taxId: 'OXY12-TAX-001',
          logoBase64: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        null,
        2
      )
    );
  }
}

// GET: Fetch company data
export async function GET() {
  try {
    ensureFile();
    const data = fs.readFileSync(companyFilePath, 'utf-8');
    const jsonData = JSON.parse(data);
    return NextResponse.json(jsonData, { status: 200 });
  } catch (error) {
    console.error('Error reading company data:', error);
    return NextResponse.json({ error: 'Failed to fetch company data' }, { status: 500 });
  }
}

// PUT: Update company data
export async function PUT(request) {
  try {
    ensureFile();
    const body = await request.json();

    // Validate required fields
    if (!body.companyId || !body.companyName) {
      return NextResponse.json(
        { error: 'Company ID and name are required' },
        { status: 400 }
      );
    }

    const data = fs.readFileSync(companyFilePath, 'utf-8');
    const jsonData = JSON.parse(data);

    // Update company data
    const updatedCompany = {
      ...jsonData,
      companyId: body.companyId,
      companyName: body.companyName,
      companyEmail: body.companyEmail || jsonData.companyEmail,
      businessNumber: body.businessNumber || jsonData.businessNumber,
      taxId: body.taxId || jsonData.taxId,
      logoBase64: body.logoBase64 !== undefined ? body.logoBase64 : jsonData.logoBase64,
      createdAt: jsonData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    fs.writeFileSync(companyFilePath, JSON.stringify(updatedCompany, null, 2));

    return NextResponse.json(updatedCompany, { status: 200 });
  } catch (error) {
    console.error('Error updating company data:', error);
    return NextResponse.json({ error: 'Failed to update company data' }, { status: 500 });
  }
}
