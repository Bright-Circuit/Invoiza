import { NextResponse } from 'next/server';
import { readJsonFile, writeJsonFile, ensureJsonFile } from '../../../lib/fileStore';

const companyFileName = 'company.json';
const DEFAULT_COMPANY_LOGO = '/images/company-logo-default.svg';

// Ensure the file exists in writable dir and seed from project data
function ensureFile() {
  ensureJsonFile(companyFileName, {
    companyId: 'OXY12',
    companyName: 'OXY12',
    companyEmail: 'oxy2welve@gmail.com',
    businessNumber: '+94 71 195 0429',
    taxId: 'OXY12-TAX-001',
    logoBase64: DEFAULT_COMPANY_LOGO,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
}

// GET: Fetch company data
export async function GET() {
  try {
    ensureFile();
    const jsonData = readJsonFile(companyFileName) || {};
    jsonData.logoBase64 = DEFAULT_COMPANY_LOGO;
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

    const jsonData = readJsonFile(companyFileName) || {};

    // Update company data
    const updatedCompany = {
      ...jsonData,
      companyId: body.companyId,
      companyName: body.companyName,
      companyEmail: body.companyEmail || jsonData.companyEmail,
      businessNumber: body.businessNumber || jsonData.businessNumber,
      taxId: body.taxId || jsonData.taxId,
      logoBase64: DEFAULT_COMPANY_LOGO,
      createdAt: jsonData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    writeJsonFile(companyFileName, updatedCompany);

    return NextResponse.json(updatedCompany, { status: 200 });
  } catch (error) {
    console.error('Error updating company data:', error);
    return NextResponse.json({ error: 'Failed to update company data' }, { status: 500 });
  }
}
