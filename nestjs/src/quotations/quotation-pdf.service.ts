import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

type PdfLanguage = 'en' | 'ar';

type PdfQuotationItem = {
  description: string;
  descriptionAr?: string | null;
  quantity: number;
  unitPrice: number;
  amount: number;
};

type PdfQuotation = {
  id: number;
  quotationNo: string;

  customerName: string;
  customerNameAr?: string | null;
  customerEmail?: string | null;

  company?: string | null;
  companyAr?: string | null;

  title: string;
  titleAr?: string | null;

  description?: string | null;
  descriptionAr?: string | null;

  currency: string;

  subtotal: number;
  discountRate: number;
  discountAmount: number;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;

  status: string;
  validUntil?: string | null;

  notes?: string | null;
  notesAr?: string | null;

  createdAt: string;
  items?: PdfQuotationItem[];
};

@Injectable()
export class QuotationPdfService {
  async generate(
    quotation: PdfQuotation,
    lang: PdfLanguage = 'en',
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const isArabic = lang === 'ar';

      const doc = new PDFDocument({
        size: 'A4',
        margin: 40,
        info: {
          Title: `${quotation.quotationNo}-${lang}`,
          Author: 'Almajrah',
        },
      });

      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const width = doc.page.width;
      const height = doc.page.height;

      const left = 45;
      const right = 45;
      const contentWidth = width - left - right;
      const footerLimit = height - 95;

      const logoPath = join(
        process.cwd(),
        'src',
        'assets',
        'almajrah-logo.png',
      );

      // Saudi Riyal symbol image.
      const riyalSymbolPath = join(
        process.cwd(),
        'src',
        'assets',
        'saudi-riyal-symbol.png',
      );

      const arabicRegularPath = join(
        process.cwd(),
        'src',
        'assets',
        'fonts',
        'NotoSansArabic-Regular.ttf',
      );

      const arabicBoldPath = join(
        process.cwd(),
        'src',
        'assets',
        'fonts',
        'NotoSansArabic-Bold.ttf',
      );

      const hasArabicFonts =
        existsSync(arabicRegularPath) &&
        existsSync(arabicBoldPath);

      const hasRiyalSymbol =
        existsSync(riyalSymbolPath);

      if (isArabic && !hasArabicFonts) {
        reject(
          new Error(
            'Arabic quotation fonts not found in src/assets/fonts',
          ),
        );
        return;
      }

      if (hasArabicFonts) {
        doc.registerFont('Arabic', arabicRegularPath);
        doc.registerFont('Arabic-Bold', arabicBoldPath);
      }

      const regularFont =
        isArabic && hasArabicFonts
          ? 'Arabic'
          : 'Helvetica';

      const boldFont =
        isArabic && hasArabicFonts
          ? 'Arabic-Bold'
          : 'Helvetica-Bold';

      const align: 'left' | 'right' =
        isArabic ? 'right' : 'left';

      const labels = isArabic
        ? {
            quotation: 'عرض السعر',
            quotationNo: 'رقم العرض',
            date: 'التاريخ',
            validUntil: 'صالح حتى',
            status: 'الحالة',
            preparedFor: 'مقدم إلى',
            projectService: 'المشروع / الخدمة',
            description: 'الوصف',
            qty: 'الكمية',
            unitPrice: 'سعر الوحدة',
            amount: 'الإجمالي',
            subtotal: 'المجموع الفرعي',
            discount: 'الخصم',
            vat: 'ضريبة القيمة المضافة',
            originalPrice: 'السعر الأصلي',
            grandTotal: 'الإجمالي النهائي',
            notes: 'ملاحظات',
            footer: 'المجرة للحلول التقنية والرقمية',
          }
        : {
            quotation: 'QUOTATION',
            quotationNo: 'QUOTATION NO.',
            date: 'DATE',
            validUntil: 'VALID UNTIL',
            status: 'STATUS',
            preparedFor: 'PREPARED FOR',
            projectService: 'PROJECT / SERVICE',
            description: 'DESCRIPTION',
            qty: 'QTY',
            unitPrice: 'UNIT PRICE',
            amount: 'AMOUNT',
            subtotal: 'Subtotal',
            discount: 'Discount',
            vat: 'VAT',
            originalPrice: 'Original Price',
            grandTotal: 'Grand Total',
            notes: 'NOTES',
            footer: 'ALMAJRAH | Technology & Digital Solutions',
          };

      // Reverse Arabic word order for PDFKit's LTR text engine.
      const pdfText = (value: string) => {
        if (!isArabic || !this.containsArabic(value)) {
          return value;
        }

        return this.prepareArabicForPdf(value);
      };

      const customerName = isArabic
        ? pdfText(quotation.customerNameAr?.trim() || '-')
        : quotation.customerName.trim();

      const company = isArabic
        ? pdfText(quotation.companyAr?.trim() || '')
        : quotation.company?.trim() || '';

      const title = isArabic
        ? pdfText(quotation.titleAr?.trim() || '-')
        : quotation.title.trim();

      const description = isArabic
        ? pdfText(quotation.descriptionAr?.trim() || '')
        : quotation.description?.trim() || '';

      const notes = isArabic
        ? pdfText(quotation.notesAr?.trim() || '')
        : quotation.notes?.trim() || '';

      const hasDiscount =
        quotation.discountRate > 0 &&
        quotation.discountAmount > 0;

      const originalPrice =
        quotation.subtotal +
        quotation.subtotal * (quotation.taxRate / 100);

      const getFontForText = (
        value: string,
        bold = false,
      ) => {
        if (!isArabic || !hasArabicFonts) {
          return bold ? 'Helvetica-Bold' : 'Helvetica';
        }

        if (!this.containsArabic(value)) {
          return bold ? 'Helvetica-Bold' : 'Helvetica';
        }

        return bold ? 'Arabic-Bold' : 'Arabic';
      };

      const drawMoney = (
        amount: number,
        currency: string,
        x: number,
        y: number,
        boxWidth: number,
        options?: {
          align?: 'left' | 'right' | 'center';
          bold?: boolean;
          strong?: boolean;
          fontSize?: number;
          strike?: boolean;
        },
      ) => {
        const valueAlign = options?.align ?? 'right';
        const fontSize = options?.fontSize ?? 8.5;
        const bold = options?.bold ?? false;
        const strong = options?.strong ?? false;
        const strike = options?.strike ?? false;

        const number = this.formatAmount(amount);
        const textColor = strong ? '#0F766E' : '#0F172A';

        // SAR uses the actual Riyal symbol image instead of font glyph.
        if (
          currency === 'SAR' &&
          hasRiyalSymbol
        ) {
          const font =
            bold || strong
              ? 'Helvetica-Bold'
              : 'Helvetica';

          doc.font(font).fontSize(fontSize);

          const numberWidth =
            doc.widthOfString(number);

          const symbolSize =
            Math.max(8, fontSize + 1);

          const gap = 3;

          const totalWidth =
            symbolSize +
            gap +
            numberWidth;

          let startX = x;

          if (valueAlign === 'right') {
            startX =
              x +
              boxWidth -
              totalWidth;
          }

          if (valueAlign === 'center') {
            startX =
              x +
              (boxWidth - totalWidth) / 2;
          }

          doc.image(
            riyalSymbolPath,
            startX,
            y - 1,
            {
              width: symbolSize,
              height: symbolSize,
            },
          );

          doc
            .fillColor(textColor)
            .font(font)
            .fontSize(fontSize)
            .text(
              number,
              startX +
                symbolSize +
                gap,
              y,
              {
                width:
                  numberWidth + 2,
                lineBreak: false,
              },
            );

          if (strike) {
            const lineY =
              y +
              fontSize * 0.58;

            doc
              .moveTo(
                startX,
                lineY,
              )
              .lineTo(
                startX +
                  totalWidth,
                lineY,
              )
              .strokeColor('#94A3B8')
              .lineWidth(0.8)
              .stroke();
          }

          return;
        }

        let value = `${currency} ${number}`;
        let font = bold || strong ? 'Helvetica-Bold' : 'Helvetica';

        if (currency === 'USD') {
          value = `$ ${number}`;
        }

        if (currency === 'AED') {
          value = `AED ${number}`;
        }

        doc
          .fillColor(textColor)
          .font(font)
          .fontSize(fontSize)
          .text(value, x, y, {
            width: boxWidth,
            align: valueAlign,
            lineBreak: false,
          });

        if (!strike) {
          return;
        }

        const textWidth = Math.min(
          doc.widthOfString(value),
          boxWidth,
        );

        let startX = x;

        if (valueAlign === 'right') {
          startX =
            x +
            boxWidth -
            textWidth;
        }

        if (valueAlign === 'center') {
          startX =
            x +
            (boxWidth - textWidth) / 2;
        }

        const lineY =
          y +
          fontSize * 0.58;

        doc
          .moveTo(startX, lineY)
          .lineTo(
            startX + textWidth,
            lineY,
          )
          .strokeColor('#94A3B8')
          .lineWidth(0.8)
          .stroke();
      };

      const drawHeader = () => {
        doc.rect(0, 0, width, 92).fill('#07111F');

        if (existsSync(logoPath)) {
          doc.image(logoPath, left, 18, {
            fit: [90, 54],
          });
        }

        doc
          .fillColor('#FFFFFF')
          .font(boldFont)
          .fontSize(isArabic ? 18 : 20)
          .text(
            pdfText(labels.quotation),
            width - 265,
            24,
            {
              width: 220,
              align: 'right',
              lineBreak: false,
            },
          );

        doc
          .fillColor('#94A3B8')
          .font('Helvetica')
          .fontSize(8)
          .text(
            quotation.quotationNo,
            width - 265,
            57,
            {
              width: 220,
              align: 'right',
              lineBreak: false,
            },
          );
      };

      const drawFooter = () => {
        const footerY = height - 72;

        doc
          .moveTo(left, footerY - 12)
          .lineTo(
            width - right,
            footerY - 12,
          )
          .strokeColor('#E2E8F0')
          .lineWidth(1)
          .stroke();

        doc
          .fillColor('#64748B')
          .font(regularFont)
          .fontSize(7.5)
          .text(
            pdfText(labels.footer),
            left,
            footerY,
            {
              width: contentWidth,
              align,
              lineBreak: false,
            },
          );
      };

      const startNewPage = () => {
        doc.addPage({
          size: 'A4',
          margin: 40,
        });

        drawHeader();
        drawFooter();

        return 112;
      };

      const ensureSpace = (
        currentY: number,
        requiredHeight: number,
      ) => {
        if (
          currentY + requiredHeight <=
          footerLimit
        ) {
          return currentY;
        }

        return startNewPage();
      };

      const sectionLabel = (
        text: string,
        y: number,
      ) => {
        doc
          .fillColor('#0F766E')
          .font(boldFont)
          .fontSize(8.5)
          .text(
            pdfText(text),
            left,
            y,
            {
              width: contentWidth,
              align,
              lineBreak: false,
            },
          );
      };

      const infoGap = 10;

      const infoWidth =
        (contentWidth - infoGap * 3) / 4;

      const infoX = (index: number) => {
        if (isArabic) {
          return (
            width -
            right -
            infoWidth -
            index *
              (infoWidth +
                infoGap)
          );
        }

        return (
          left +
          index *
            (infoWidth +
              infoGap)
        );
      };

      const infoBlock = (
        label: string,
        value: string,
        index: number,
        blockY: number,
      ) => {
        const x = infoX(index);

        const displayLabel =
          pdfText(label);

        const displayValue =
          pdfText(value);

        doc
          .fillColor('#94A3B8')
          .font(boldFont)
          .fontSize(6.7)
          .text(
            displayLabel,
            x,
            blockY,
            {
              width: infoWidth,
              align,
              lineBreak: false,
            },
          );

        doc
          .fillColor('#0F172A')
          .font(
            getFontForText(
              displayValue,
              true,
            ),
          )
          .fontSize(8.5)
          .text(
            displayValue,
            x,
            blockY + 17,
            {
              width: infoWidth,
              align,
              lineBreak: false,
            },
          );
      };

      drawHeader();
      drawFooter();

      let y = 116;

      infoBlock(
        labels.quotationNo,
        quotation.quotationNo,
        0,
        y,
      );

      infoBlock(
        labels.date,
        this.formatDate(
          quotation.createdAt,
          lang,
        ),
        1,
        y,
      );

      infoBlock(
        labels.validUntil,
        quotation.validUntil
          ? this.formatDate(
              quotation.validUntil,
              lang,
            )
          : '-',
        2,
        y,
      );

      infoBlock(
        labels.status,
        this.formatStatus(
          quotation.status,
          lang,
        ),
        3,
        y,
      );

      y += 48;

      doc
        .moveTo(left, y)
        .lineTo(width - right, y)
        .strokeColor('#E2E8F0')
        .stroke();

      y += 19;

      // Customer
      sectionLabel(
        labels.preparedFor,
        y,
      );

      y += 17;

      doc
        .fillColor('#0F172A')
        .font(
          getFontForText(
            customerName,
            true,
          ),
        )
        .fontSize(15)
        .text(
          customerName,
          left,
          y,
          {
            width: contentWidth,
            align,
          },
        );

      const customerHeight = doc
        .font(
          getFontForText(
            customerName,
            true,
          ),
        )
        .fontSize(15)
        .heightOfString(
          customerName,
          {
            width: contentWidth,
            align,
          },
        );

      y +=
        Math.max(
          customerHeight,
          18,
        ) + 4;

      if (company) {
        doc
          .fillColor('#475569')
          .font(
            getFontForText(company),
          )
          .fontSize(9)
          .text(
            company,
            left,
            y,
            {
              width: contentWidth,
              align,
            },
          );

        const companyHeight = doc
          .font(
            getFontForText(company),
          )
          .fontSize(9)
          .heightOfString(
            company,
            {
              width: contentWidth,
              align,
            },
          );

        y +=
          Math.max(
            companyHeight,
            13,
          ) + 3;
      }

      if (quotation.customerEmail) {
        doc
          .fillColor('#64748B')
          .font('Helvetica')
          .fontSize(8.5)
          .text(
            quotation.customerEmail,
            left,
            y,
            {
              width: contentWidth,
              align,
            },
          );

        y += 16;
      }

      y += 7;

      // Project / service
      sectionLabel(
        labels.projectService,
        y,
      );

      y += 17;

      doc
        .fillColor('#0F172A')
        .font(
          getFontForText(
            title,
            true,
          ),
        )
        .fontSize(14)
        .text(
          title,
          left,
          y,
          {
            width: contentWidth,
            align,
          },
        );

      const titleHeight = doc
        .font(
          getFontForText(
            title,
            true,
          ),
        )
        .fontSize(14)
        .heightOfString(
          title,
          {
            width: contentWidth,
            align,
          },
        );

      y +=
        Math.max(
          titleHeight,
          18,
        ) + 5;

      if (description) {
        doc
          .fillColor('#475569')
          .font(
            getFontForText(
              description,
            ),
          )
          .fontSize(9)
          .text(
            description,
            left,
            y,
            {
              width: contentWidth,
              align,
              lineGap: 2,
            },
          );

        const descriptionHeight = doc
          .font(
            getFontForText(
              description,
            ),
          )
          .fontSize(9)
          .heightOfString(
            description,
            {
              width: contentWidth,
              align,
              lineGap: 2,
            },
          );

        y +=
          descriptionHeight +
          15;
      } else {
        y += 10;
      }

      y = ensureSpace(y, 70);

      // Items table
      const tableWidth =
        contentWidth;

      const descriptionWidth =
        250;

      const quantityWidth =
        55;

      const priceWidth =
        100;

      const amountWidth =
        tableWidth -
        descriptionWidth -
        quantityWidth -
        priceWidth;

      const tableHeaderHeight =
        32;

      const drawTableHeader = (
        tableY: number,
      ) => {
        doc
          .rect(
            left,
            tableY,
            tableWidth,
            tableHeaderHeight,
          )
          .fill('#0F172A');

        if (!isArabic) {
          doc
            .fillColor('#FFFFFF')
            .font('Helvetica-Bold')
            .fontSize(7.5)
            .text(
              labels.description,
              left + 9,
              tableY + 11,
              {
                width:
                  descriptionWidth -
                  18,
                lineBreak: false,
              },
            );

          doc.text(
            labels.qty,
            left +
              descriptionWidth,
            tableY + 11,
            {
              width: quantityWidth,
              align: 'center',
              lineBreak: false,
            },
          );

          doc.text(
            labels.unitPrice,
            left +
              descriptionWidth +
              quantityWidth,
            tableY + 11,
            {
              width:
                priceWidth - 8,
              align: 'right',
              lineBreak: false,
            },
          );

          doc.text(
            labels.amount,
            left +
              descriptionWidth +
              quantityWidth +
              priceWidth,
            tableY + 11,
            {
              width:
                amountWidth - 8,
              align: 'right',
              lineBreak: false,
            },
          );
        } else {
          const amountX = left;
          const priceX =
            amountX +
            amountWidth;

          const quantityX =
            priceX +
            priceWidth;

          const descriptionX =
            quantityX +
            quantityWidth;

          doc
            .fillColor('#FFFFFF')
            .font('Arabic-Bold')
            .fontSize(7.5)
            .text(
              pdfText(
                labels.description,
              ),
              descriptionX + 8,
              tableY + 9,
              {
                width:
                  descriptionWidth -
                  16,
                align: 'right',
                lineBreak: false,
              },
            );

          doc.text(
            pdfText(labels.qty),
            quantityX,
            tableY + 9,
            {
              width: quantityWidth,
              align: 'center',
              lineBreak: false,
            },
          );

          doc.text(
            pdfText(
              labels.unitPrice,
            ),
            priceX + 5,
            tableY + 9,
            {
              width:
                priceWidth - 10,
              align: 'right',
              lineBreak: false,
            },
          );

          doc.text(
            pdfText(labels.amount),
            amountX + 5,
            tableY + 9,
            {
              width:
                amountWidth - 10,
              align: 'right',
              lineBreak: false,
            },
          );
        }

        return (
          tableY +
          tableHeaderHeight
        );
      };

      y = drawTableHeader(y);

      for (
        const item of quotation.items ??
        []
      ) {
        const rawDescription =
          isArabic
            ? item.descriptionAr?.trim() ||
              '-'
            : item.description;

        const itemDescription =
          isArabic
            ? pdfText(rawDescription)
            : rawDescription;

        const itemFont =
          getFontForText(
            itemDescription,
          );

        doc
          .font(itemFont)
          .fontSize(8.5);

        const itemDescriptionHeight =
          doc.heightOfString(
            itemDescription,
            {
              width:
                descriptionWidth -
                18,
              align,
            },
          );

        const rowHeight =
          Math.max(
            36,
            itemDescriptionHeight +
              16,
          );

        if (
          y + rowHeight >
          footerLimit
        ) {
          y = startNewPage();
          y =
            drawTableHeader(y);
        }

        doc
          .rect(
            left,
            y,
            tableWidth,
            rowHeight,
          )
          .fill('#F8FAFC');

        if (!isArabic) {
          doc
            .fillColor('#334155')
            .font(itemFont)
            .fontSize(8.5)
            .text(
              itemDescription,
              left + 9,
              y + 9,
              {
                width:
                  descriptionWidth -
                  18,
              },
            );

          doc
            .fillColor('#334155')
            .font('Helvetica')
            .fontSize(8.5)
            .text(
              this.formatNumber(
                item.quantity,
              ),
              left +
                descriptionWidth,
              y +
                rowHeight /
                  2 -
                5,
              {
                width:
                  quantityWidth,
                align: 'center',
                lineBreak: false,
              },
            );

          drawMoney(
            item.unitPrice,
            quotation.currency,
            left +
              descriptionWidth +
              quantityWidth,
            y +
              rowHeight /
                2 -
              5,
            priceWidth - 8,
            {
              align: 'right',
              fontSize: 8.5,
            },
          );

          drawMoney(
            item.amount,
            quotation.currency,
            left +
              descriptionWidth +
              quantityWidth +
              priceWidth,
            y +
              rowHeight /
                2 -
              5,
            amountWidth - 8,
            {
              align: 'right',
              bold: true,
              fontSize: 8.5,
            },
          );
        } else {
          const amountX = left;

          const priceX =
            amountX +
            amountWidth;

          const quantityX =
            priceX +
            priceWidth;

          const descriptionX =
            quantityX +
            quantityWidth;

          doc
            .fillColor('#334155')
            .font(itemFont)
            .fontSize(8.5)
            .text(
              itemDescription,
              descriptionX + 8,
              y + 8,
              {
                width:
                  descriptionWidth -
                  16,
                align: 'right',
              },
            );

          doc
            .fillColor('#334155')
            .font('Helvetica')
            .fontSize(8.5)
            .text(
              this.formatNumber(
                item.quantity,
              ),
              quantityX,
              y +
                rowHeight /
                  2 -
                5,
              {
                width:
                  quantityWidth,
                align: 'center',
                lineBreak: false,
              },
            );

          drawMoney(
            item.unitPrice,
            quotation.currency,
            priceX + 5,
            y +
              rowHeight /
                2 -
              5,
            priceWidth - 10,
            {
              align: 'right',
              fontSize: 8.5,
            },
          );

          drawMoney(
            item.amount,
            quotation.currency,
            amountX + 5,
            y +
              rowHeight /
                2 -
              5,
            amountWidth - 10,
            {
              align: 'right',
              bold: true,
              fontSize: 8.5,
            },
          );
        }

        y +=
          rowHeight + 2;
      }

      y += 16;

      // Totals
      const totalBoxWidth =
        260;

      const totalBoxHeight =
        hasDiscount
          ? 158
          : 112;

      y = ensureSpace(
        y,
        totalBoxHeight + 15,
      );

      const totalX =
        isArabic
          ? left
          : width -
            right -
            totalBoxWidth;

      doc
        .roundedRect(
          totalX,
          y,
          totalBoxWidth,
          totalBoxHeight,
          8,
        )
        .fill('#F8FAFC');

      const totalLabel = (
        label: string,
        rowY: number,
        strong = false,
      ) => {
        const displayLabel =
          pdfText(label);

        if (!isArabic) {
          doc
            .fillColor(
              strong
                ? '#0F172A'
                : '#64748B',
            )
            .font(
              strong
                ? 'Helvetica-Bold'
                : 'Helvetica',
            )
            .fontSize(
              strong
                ? 9.5
                : 8.5,
            )
            .text(
              displayLabel,
              totalX + 14,
              rowY,
              {
                width: 118,
                lineBreak: false,
              },
            );

          return;
        }

        doc
          .fillColor(
            strong
              ? '#0F172A'
              : '#64748B',
          )
          .font(
            strong
              ? 'Arabic-Bold'
              : 'Arabic',
          )
          .fontSize(
            strong
              ? 9.5
              : 8.5,
          )
          .text(
            displayLabel,
            totalX + 122,
            rowY - 2,
            {
              width: 124,
              align: 'right',
              lineBreak: false,
            },
          );
      };

      const totalAmount = (
        amount: number,
        rowY: number,
        options?: {
          strong?: boolean;
          strike?: boolean;
        },
      ) => {
        if (!isArabic) {
          drawMoney(
            amount,
            quotation.currency,
            totalX + 132,
            rowY,
            114,
            {
              align: 'right',
              bold: true,
              strong:
                options?.strong,
              strike:
                options?.strike,
              fontSize:
                options?.strong
                  ? 10.5
                  : 8.5,
            },
          );

          return;
        }

        drawMoney(
          amount,
          quotation.currency,
          totalX + 14,
          rowY,
          103,
          {
            align: 'left',
            bold: true,
            strong:
              options?.strong,
            strike:
              options?.strike,
            fontSize:
              options?.strong
                ? 10.5
                : 8.5,
          },
        );
      };

      const subtotalY =
        y + 15;

      totalLabel(
        labels.subtotal,
        subtotalY,
      );

      totalAmount(
        quotation.subtotal,
        subtotalY,
      );

      if (hasDiscount) {
        const discountY =
          y + 42;

        const vatY =
          y + 69;

        const discountLabel =
          isArabic
            ? `${labels.discount} ${this.formatNumber(
                quotation.discountRate,
              )}%`
            : `${labels.discount} (${this.formatNumber(
                quotation.discountRate,
              )}%)`;

        const vatLabel =
          isArabic
            ? `${labels.vat} ${this.formatNumber(
                quotation.taxRate,
              )}%`
            : `${labels.vat} (${this.formatNumber(
                quotation.taxRate,
              )}%)`;

        totalLabel(
          discountLabel,
          discountY,
        );

        totalAmount(
          quotation.discountAmount,
          discountY,
        );

        totalLabel(
          vatLabel,
          vatY,
        );

        totalAmount(
          quotation.taxAmount,
          vatY,
        );

        doc
          .moveTo(
            totalX + 14,
            y + 94,
          )
          .lineTo(
            totalX +
              totalBoxWidth -
              14,
            y + 94,
          )
          .strokeColor('#CBD5E1')
          .stroke();

        const originalY =
          y + 105;

        const grandY =
          y + 132;

        totalLabel(
          labels.originalPrice,
          originalY,
        );

        totalAmount(
          originalPrice,
          originalY,
          {
            strike: true,
          },
        );

        totalLabel(
          labels.grandTotal,
          grandY,
          true,
        );

        totalAmount(
          quotation.totalAmount,
          grandY,
          {
            strong: true,
          },
        );
      } else {
        const vatY =
          y + 43;

        const vatLabel =
          isArabic
            ? `${labels.vat} ${this.formatNumber(
                quotation.taxRate,
              )}%`
            : `${labels.vat} (${this.formatNumber(
                quotation.taxRate,
              )}%)`;

        totalLabel(
          vatLabel,
          vatY,
        );

        totalAmount(
          quotation.taxAmount,
          vatY,
        );

        doc
          .moveTo(
            totalX + 14,
            y + 72,
          )
          .lineTo(
            totalX +
              totalBoxWidth -
              14,
            y + 72,
          )
          .strokeColor('#CBD5E1')
          .stroke();

        const grandY =
          y + 85;

        totalLabel(
          labels.grandTotal,
          grandY,
          true,
        );

        totalAmount(
          quotation.totalAmount,
          grandY,
          {
            strong: true,
          },
        );
      }

      y +=
        totalBoxHeight +
        18;

      // Notes
      if (notes) {
        const notesFont =
          getFontForText(notes);

        doc
          .font(notesFont)
          .fontSize(8.5);

        const notesHeight =
          doc.heightOfString(
            notes,
            {
              width:
                contentWidth,
              align,
              lineGap: 2,
            },
          );

        y = ensureSpace(
          y,
          notesHeight + 40,
        );

        sectionLabel(
          labels.notes,
          y,
        );

        y += 17;

        doc
          .fillColor('#475569')
          .font(notesFont)
          .fontSize(8.5)
          .text(
            notes,
            left,
            y,
            {
              width:
                contentWidth,
              align,
              lineGap: 2,
            },
          );
      }

      doc.end();
    });
  }

  // Western digits in both EN and AR PDFs.
  private formatAmount(amount: number) {
    return new Intl.NumberFormat('en-US', {
      useGrouping: false,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(Number(amount) || 0);
  }

  private formatNumber(value: number) {
    return new Intl.NumberFormat('en-US', {
      useGrouping: false,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(Number(value) || 0);
  }

  private formatDate(
    value: string,
    lang: PdfLanguage,
  ) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    if (lang === 'ar') {
      const day = String(
        date.getDate(),
      ).padStart(2, '0');

      const month = String(
        date.getMonth() + 1,
      ).padStart(2, '0');

      const year =
        date.getFullYear();

      return `${day}/${month}/${year}`;
    }

    return date.toLocaleDateString(
      'en-GB',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      },
    );
  }

  private formatStatus(
    status: string,
    lang: PdfLanguage,
  ) {
    if (lang === 'en') {
      return status.toUpperCase();
    }

    const statuses: Record<string, string> = {
      draft: 'مسودة',
      sent: 'مرسل',
      accepted: 'مقبول',
      rejected: 'مرفوض',
      expired: 'منتهي',
    };

    return statuses[status] || status;
  }

  private containsArabic(value: string) {
    return /[\u0600-\u06FF]/.test(value);
  }

  private cleanArabicText(value: string) {
    return value
      .normalize('NFKC')
      .replace(
        /[\u200B-\u200F\u202A-\u202E\u2066-\u2069]/g,
        '',
      )
      .replace(/\u00A0/g, ' ')
      .replace(/&/g, ' و ')
      .replace(/[ \t]+/g, ' ')
      .trim();
  }

  // PDFKit does not perform full Arabic bidi word ordering.
  // Reverse word order while keeping the Arabic letters themselves intact.
  private prepareArabicForPdf(value: string) {
    const cleaned =
      this.cleanArabicText(value);

    return cleaned
      .split('\n')
      .map((line) => {
        if (!this.containsArabic(line)) {
          return line;
        }

        return line
          .trim()
          .split(/\s+/)
          .reverse()
          .join(' ');
      })
      .join('\n');
  }
}