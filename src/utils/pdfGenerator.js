import { jsPDF } from 'jspdf';
// eslint-disable-next-line no-unused-vars
import autoTable from 'jspdf-autotable';

const DEFAULT_COMPANY_LOGO = '/images/company-logo-default.svg';

const toBase64 = (value) => {
  if (typeof window === 'undefined') return null;

  return window.btoa(
    unescape(encodeURIComponent(value))
  );
};

const logoSourceToPngDataUrl = async (logoSource) => {
  const source = logoSource || DEFAULT_COMPANY_LOGO;

  if (!source) return null;
  if (source.startsWith('data:image/png')) return source;

  let svgText = '';

  if (source.startsWith('data:image/svg+xml')) {
    const commaIndex = source.indexOf(',');
    if (commaIndex === -1) return null;
    const encoded = source.slice(commaIndex + 1);
    try {
      svgText = decodeURIComponent(escape(window.atob(encoded)));
    } catch {
      svgText = window.atob(encoded);
    }
  } else {
    const response = await fetch(source);
    svgText = await response.text();
  }

  const svgDataUrl = `data:image/svg+xml;base64,${toBase64(svgText)}`;

  return await new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth || image.width || 160;
      canvas.height = image.naturalHeight || image.height || 160;

      const context = canvas.getContext('2d');
      if (!context) {
        resolve(svgDataUrl);
        return;
      }

      context.drawImage(image, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    image.onerror = reject;
    image.src = svgDataUrl;
  });
};

/**
 * Generate an invoice PDF with company details and items
 * @param {Object} invoiceData - Invoice data containing items, totals, etc.
 * @param {Object} companyData - Company data with logo, name, contact info
 * @param {Object} customerData - Customer data
 * @returns {Promise<void>} - Downloads the PDF
 */
export const generateInvoicePDF = async (invoiceData, companyData, customerData) => {
  try {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();   // 210mm
    const pageHeight = doc.internal.pageSize.getHeight(); // 297mm
    const margin = 15;
    let yPosition = margin;

    // Set default font
    doc.setFont('Helvetica');

    // ─── Header Section with Logo ──────────────────────────────────────────
    const logoWidth = 40;
    const logoHeight = 16;

    const companyLogo = await logoSourceToPngDataUrl(companyData?.logoBase64);

    if (companyLogo) {
      try {
        doc.addImage(
          companyLogo,
          'PNG',
          margin,
          yPosition,
          logoWidth,
          logoHeight
        );
      } catch (error) {
        console.error('Error adding logo:', error);
      }
    }

    // ─── Invoice Title (Right Aligned, wide letter-spacing) ────────────────
    doc.setFontSize(22);
    doc.setFont('Helvetica', 'normal');
    doc.text('INVOICE', pageWidth - 25, yPosition + 12, { align: 'right', charSpace: 2 });

    yPosition += 30;

    // ─── Issued To  (left) + Invoice details (right) ───────────────────────
    doc.setFontSize(8.5);
    doc.setFont('Helvetica', 'bold');
    doc.text('ISSUED TO:', margin, yPosition);

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(customerData?.customerName  || 'John Deo',            margin, yPosition + 7);
    doc.text(customerData?.email         || 'johndeo@example.com', margin, yPosition + 13);
    doc.text(customerData?.phoneNumber   || '+94 71 526 8956',     margin, yPosition + 19);

    // Right column – labels start at ~pageWidth/2, values right-aligned
    const rightLabelX = pageWidth / 2 + 10;   // ~115mm  – label left edge
    const rightValueX = pageWidth - margin;    // ~195mm  – value right edge

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.text('INVOICE NO:', rightLabelX, yPosition);
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(invoiceData?.invoiceNumber || 'INV#001', rightValueX, yPosition, { align: 'right' });

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.text('DATE:', rightLabelX, yPosition + 7);
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(invoiceData?.issuedDate || '14.03.2026', rightValueX, yPosition + 7, { align: 'right' });

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.text('DUE DATE:', rightLabelX, yPosition + 14);
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(invoiceData?.dueDate || '15.03.2026', rightValueX, yPosition + 14, { align: 'right' });

    yPosition += 34;

    // ─── Pay To Section ────────────────────────────────────────────────────
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.text('PAY TO:', margin, yPosition);

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(companyData?.companyName    || 'OXY12',               margin, yPosition + 7);
    doc.text(companyData?.companyEmail   || 'oxy2welve@gmail.com',  margin, yPosition + 13);
    doc.text(companyData?.businessNumber || '+94 71 195 0429',      margin, yPosition + 19);

    yPosition += 34;

    // ─── Items Table ───────────────────────────────────────────────────────
    const columns = ['DESCRIPTION', 'UNIT PRICE (LKR)', 'QTY', 'TOTAL (LKR)'];
    const rows = (invoiceData?.items || []).map((item) => [
      item.itemName,
      `${item.price?.toFixed(2)    ?? '0.00'}`,
      `${item.quantity             ?? 0}`,
      `${item.subtotal?.toFixed(2) ?? '0.00'}`,
    ]);

    doc.autoTable({
      columns,
      body: rows,
      startY: yPosition,
      margin: { left: margin, right: margin, top: 0, bottom: 0 },
      theme: 'plain',
      styles: {
        font: 'Helvetica',
        fontSize: 10,
        cellPadding: { top: 5, bottom: 5, left: 2, right: 2 },
        overflow: 'linebreak',
        halign: 'left',
        textColor: [40, 40, 40],
        lineWidth: 0,
      },
      headStyles: {
        fontStyle: 'bold',
        fontSize: 8.5,
        font: 'Helvetica',
        textColor: [40, 40, 40],
        // top and bottom border only (plain theme draws no lines; we add via didDrawPage)
        lineWidth: 0,
      },
      bodyStyles: {
        font: 'Helvetica',
        textColor: [40, 40, 40],
        lineWidth: 0,
      },
      columnStyles: {
        0: { halign: 'left'   },
        1: { halign: 'left'  },
        2: { halign: 'left' },
        3: { halign: 'left'  },
      },
      // Draw top & bottom rules around the header row manually
      didDrawCell(data) {
        if (data.section === 'head') {  
          const { doc: d, cell, row } = data;
          if (row.index === 0) {
            // top rule above header
            d.setDrawColor(100, 100, 100);
            d.setLineWidth(0.1);
            d.line(margin, cell.y, pageWidth - margin, cell.y);
            // bottom rule below header
            d.line(margin, cell.y + cell.height, pageWidth - margin, cell.y + cell.height);
          }
        }
      },
    });

    const tableBottom = doc.lastAutoTable.finalY;

    // Bottom rule below last body row
    doc.setDrawColor(100, 100, 100);
    doc.setLineWidth(0.1);
    doc.line(margin, tableBottom, pageWidth - margin, tableBottom);

    yPosition = tableBottom + 10;

    // ─── Totals Section ────────────────────────────────────────────────────
    const subtotal       = invoiceData?.items?.reduce((s, i) => s + (i.subtotal || 0), 0) ?? 0;
    const discountAmount = invoiceData?.discountAmount ?? 0;
    const discountPct    = subtotal > 0 ? Math.round((discountAmount / subtotal) * 100) : 0;
    const total          = subtotal - discountAmount;

    const totLabelX = margin;
    const totValueX = pageWidth - margin;

    // SUBTOTAL – label left, value right
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('SUBTOTAL', totLabelX, yPosition);
    doc.text(`Rs ${subtotal.toFixed(2)}`, totValueX, yPosition, { align: 'right' });

    yPosition += 8;

    // DISCOUNT – both label and value right-aligned (matches the image)
    if (discountAmount > 0) {
      const discLabelX = totValueX - 40; // label sits ~40 mm left of right margin
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(10);
      doc.text('DISCOUNT', discLabelX, yPosition, { align: 'right' });
      doc.text(`${discountPct}%`, totValueX, yPosition, { align: 'right' });
      yPosition += 8;
    }

    // TOTAL – both bold, right-aligned
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('TOTAL', totLabelX, yPosition, { align: 'left' });
    doc.text(`Rs ${total.toFixed(2)}`, totValueX, yPosition, { align: 'right' });

    // ─── Footer ────────────────────────────────────────────────────────────
    // Placed near the bottom of the page, centred
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('Thank you for your business!', pageWidth / 2, pageHeight - 25, { align: 'center' });

    // ─── Save ──────────────────────────────────────────────────────────────
    const fileName = `invoice-${invoiceData?.invoiceNumber || 'draft'}.pdf`;
    doc.save(fileName);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

/**
 * Generate a quotation PDF with company details and items (similar template to invoice)
 * @param {Object} quotationData - Quotation data containing items, totals, etc.
 * @param {Object} companyData - Company data with logo, name, contact info
 * @param {Object} customerData - Customer data
 * @returns {Promise<void>} - Downloads the PDF
 */
export const generateQuotationPDF = async (quotationData, companyData, customerData) => {
  try {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();   // 210mm
    const pageHeight = doc.internal.pageSize.getHeight(); // 297mm
    const margin = 15;
    let yPosition = margin;

    // Set default font
    doc.setFont('Helvetica');

    // ─── Header Section with Logo ──────────────────────────────────────────
    const logoWidth = 40;
    const logoHeight = 16;

    const companyLogo = await logoSourceToPngDataUrl(companyData?.logoBase64);

    if (companyLogo) {
      try {
        doc.addImage(
          companyLogo,
          'PNG',
          margin,
          yPosition,
          logoWidth,
          logoHeight
        );
      } catch (error) {
        console.error('Error adding logo:', error);
      }
    }

    // ─── Quotation Title (Right Aligned, wide letter-spacing) ────────────────
    doc.setFontSize(22);
    doc.setFont('Helvetica', 'normal');
    doc.text('QUOTATION', pageWidth - 30, yPosition + 12, { align: 'right', charSpace: 2 });

    yPosition += 30;

    // ─── Issued To  (left) + Quotation details (right) ───────────────────────
    doc.setFontSize(8.5);
    doc.setFont('Helvetica', 'bold');
    doc.text('ISSUED TO:', margin, yPosition);

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(customerData?.customerName  || 'John Deo',            margin, yPosition + 7);
    doc.text(customerData?.phoneNumber         || 'johndeo@example.com', margin, yPosition + 13);
    // doc.text(customerData?.phoneNumber   || '+94 71 526 8956',     margin, yPosition + 19);

    // Right column – labels start at ~pageWidth/2, values right-aligned
    const rightLabelX = pageWidth / 2 + 10;   // ~115mm  – label left edge
    const rightValueX = pageWidth - margin;    // ~195mm  – value right edge

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.text('QUOTATION NO:', rightLabelX, yPosition);
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(quotationData?.quotationNumber || 'QT#001', rightValueX, yPosition, { align: 'right' });

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.text('DATE:', rightLabelX, yPosition + 7);
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(quotationData?.issuedDate || '14.03.2026', rightValueX, yPosition + 7, { align: 'right' });

    yPosition += 34;

    // ─── Pay To Section ────────────────────────────────────────────────────
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.text('PAY TO:', margin, yPosition);

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(companyData?.companyName    || 'OXY12',               margin, yPosition + 7);
    doc.text(companyData?.companyEmail   || 'oxy2welve@gmail.com',  margin, yPosition + 13);
    doc.text(companyData?.businessNumber || '+94 71 195 0429',      margin, yPosition + 19);

    yPosition += 34;

    // ─── Items Table ───────────────────────────────────────────────────────
    const columns = ['DESCRIPTION', 'UNIT PRICE (LKR)', 'QTY', 'TOTAL (LKR)'];
    const rows = (quotationData?.items || []).map((item) => [
      item.itemName,
      `${item.price?.toFixed(2)    ?? '0.00'}`,
      `${item.quantity             ?? 0}`,
      `${item.subtotal?.toFixed(2) ?? '0.00'}`,
    ]);

    doc.autoTable({
      columns,
      body: rows,
      startY: yPosition,
      margin: { left: margin, right: margin, top: 0, bottom: 0 },
      theme: 'plain',
      styles: {
        font: 'Helvetica',
        fontSize: 10,
        cellPadding: { top: 5, bottom: 5, left: 2, right: 2 },
        overflow: 'linebreak',
        halign: 'left',
        textColor: [40, 40, 40],
        lineWidth: 0,
      },
      headStyles: {
        fontStyle: 'bold',
        fontSize: 8.5,
        font: 'Helvetica',
        textColor: [40, 40, 40],
        // top and bottom border only (plain theme draws no lines; we add via didDrawPage)
        lineWidth: 0,
      },
      bodyStyles: {
        font: 'Helvetica',
        textColor: [40, 40, 40],
        lineWidth: 0,
      },
      columnStyles: {
        0: { halign: 'left'   },
        1: { halign: 'left'  },
        2: { halign: 'left' },
        3: { halign: 'left'  },
      },
      // Draw top & bottom rules around the header row manually
      didDrawCell(data) {
        if (data.section === 'head') {
          const { doc: d, cell, row } = data;
          if (row.index === 0) {
            // top rule above header
            d.setDrawColor(100, 100, 100);
            d.setLineWidth(0.1);
            d.line(margin, cell.y, pageWidth - margin, cell.y);
            // bottom rule below header
            d.line(margin, cell.y + cell.height, pageWidth - margin, cell.y + cell.height);
          }
        }
      },
    });

    const tableBottom = doc.lastAutoTable.finalY;

    // Bottom rule below last body row
    doc.setDrawColor(100, 100, 100);
    doc.setLineWidth(0.1);
    doc.line(margin, tableBottom, pageWidth - margin, tableBottom);

    yPosition = tableBottom + 10;

    // ─── Totals Section ────────────────────────────────────────────────────
    const subtotal       = quotationData?.items?.reduce((s, i) => s + (i.subtotal || 0), 0) ?? 0;
    const discountAmount = quotationData?.discountAmount ?? 0;
    const discountPct    = subtotal > 0 ? Math.round((discountAmount / subtotal) * 100) : 0;
    const total          = subtotal - discountAmount;

    const totLabelX = margin;
    const totValueX = pageWidth - margin;

    // SUBTOTAL – label left, value right
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('SUBTOTAL', totLabelX, yPosition);
    doc.text(`Rs ${subtotal.toFixed(2)}`, totValueX, yPosition, { align: 'right' });

    yPosition += 8;

    // DISCOUNT – both label and value right-aligned (matches the image)
    if (discountAmount > 0) {
      const discLabelX = totValueX - 40; // label sits ~40 mm left of right margin
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(10);
      doc.text('DISCOUNT', discLabelX, yPosition, { align: 'right' });
      doc.text(`${discountPct}%`, totValueX, yPosition, { align: 'right' });
      yPosition += 8;
    }

    // TOTAL – both bold, right-aligned
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('TOTAL', totLabelX, yPosition, { align: 'left' });
    doc.text(`Rs ${total.toFixed(2)}`, totValueX, yPosition, { align: 'right' });

    // ─── Footer ────────────────────────────────────────────────────────────
    // Placed near the bottom of the page, centred
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('Thank you for your business!', pageWidth / 2, pageHeight - 25, { align: 'center' });

    // ─── Save ──────────────────────────────────────────────────────────────
    const fileName = `quotation-${quotationData?.quotationNumber || 'draft'}.pdf`;
    doc.save(fileName);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

/**
 * Add a base64-encoded logo image to an existing jsPDF document.
 */
export const addLogoToPDF = (logoBase64, doc, x, y, width, height) => {
  if (logoBase64) {
    try {
      doc.addImage(logoBase64, 'PNG', x, y, width, height);
    } catch (error) {
      console.error('Error adding logo to PDF:', error);
    }
  }
};