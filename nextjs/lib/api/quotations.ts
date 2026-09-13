import { API_URL } from "./client";

export type QuotationStatus =
  | "draft"
  | "sent"
  | "accepted"
  | "rejected"
  | "expired";

export type QuotationItem = {
  id: number;
  quotationId: number;
  description: string;
  descriptionAr?: string | null;
  quantity: number;
  unitPrice: number;
  amount: number;
  createdAt: string;
};

export type Quotation = {
  id: number;
  quotationNo: string;
  leadId?: number | null;

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

  // Discount
  discountRate: number;
  discountAmount: number;

  // VAT
  taxRate: number;
  taxAmount: number;

  totalAmount: number;

  status: QuotationStatus;
  validUntil?: string | null;

  notes?: string | null;
  notesAr?: string | null;

  createdAt: string;
  updatedAt: string;

  items?: QuotationItem[];
};

export type QuotationItemInput = {
  description: string;
  descriptionAr?: string;
  quantity: number;
  unitPrice: number;
};

export type CreateQuotationInput = {
  leadId?: number;

  customerName: string;
  customerNameAr?: string;
  customerEmail?: string;

  company?: string;
  companyAr?: string;

  title: string;
  titleAr?: string;

  description?: string;
  descriptionAr?: string;

  currency?: string;

  // Discount percentage
  discountRate?: number;

  // VAT percentage
  taxRate?: number;

  validUntil?: string;

  notes?: string;
  notesAr?: string;

  items: QuotationItemInput[];
};

export type UpdateQuotationInput = {
  leadId?: number;

  customerName?: string;
  customerNameAr?: string;
  customerEmail?: string;

  company?: string;
  companyAr?: string;

  title?: string;
  titleAr?: string;

  description?: string;
  descriptionAr?: string;

  currency?: string;

  // Discount percentage
  discountRate?: number;

  // VAT percentage
  taxRate?: number;

  status?: QuotationStatus;
  validUntil?: string;

  notes?: string;
  notesAr?: string;

  items?: QuotationItemInput[];
};

// Get all quotations
export async function getQuotations(): Promise<Quotation[]> {
  const response = await fetch(`${API_URL}/quotations`, {
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch quotations");
  }

  return response.json();
}

// Get single quotation
export async function getQuotation(
  id: number,
): Promise<Quotation> {
  const response = await fetch(`${API_URL}/quotations/${id}`, {
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch quotation");
  }

  return response.json();
}

// Create quotation
export async function createQuotation(
  data: CreateQuotationInput,
): Promise<Quotation> {
  const response = await fetch(`${API_URL}/quotations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const result = await response.json().catch(() => null);

    throw new Error(
      result?.message || "Failed to create quotation",
    );
  }

  return response.json();
}

// Update quotation
export async function updateQuotation(
  id: number,
  data: UpdateQuotationInput,
): Promise<Quotation> {
  const response = await fetch(`${API_URL}/quotations/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const result = await response.json().catch(() => null);

    throw new Error(
      result?.message || "Failed to update quotation",
    );
  }

  return response.json();
}

// Delete quotation
export async function deleteQuotation(id: number) {
  const response = await fetch(`${API_URL}/quotations/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    const result = await response.json().catch(() => null);

    throw new Error(
      result?.message || "Failed to delete quotation",
    );
  }

  return response.json();
}

// Download English or Arabic PDF
export async function downloadQuotationPdf(
  id: number,
  quotationNo: string,
  lang: "en" | "ar",
) {
  const response = await fetch(
    `${API_URL}/quotations/${id}/pdf?lang=${lang}`,
    {
      credentials: "include",
    },
  );

  if (!response.ok) {
    throw new Error("Failed to download quotation PDF");
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${quotationNo}-${lang}.pdf`;

  document.body.appendChild(link);
  link.click();
  link.remove();

  window.URL.revokeObjectURL(url);
}