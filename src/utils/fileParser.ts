// utils/fileParser.ts
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
// Remove: import type { ContactInput, ImportResult } from '../types';

const EMAIL_REGEX = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g;

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function extractEmailsFromText(text: string): string[] {
  return [...new Set((text.match(EMAIL_REGEX) || []).map(e => e.toLowerCase()))];
}

function buildContact(email: string, row?: Record<string, string>): any {
  const firstName = row?.['first_name'] || row?.['firstname'] || row?.['first name'] || '';
  const lastName = row?.['last_name'] || row?.['lastname'] || row?.['last name'] || '';

  return {
    email: email.toLowerCase(),
    first_name: firstName || row?.['name']?.split(' ')[0] || '',
    last_name: lastName || row?.['name']?.split(' ').slice(1).join(' ') || '',
    company: row?.['company'] || row?.['organization'] || '',
    phone: row?.['phone'] || row?.['phone_number'] || '',
    tags: [],
    status: 'active' as const,
    custom_fields: {},
  };
}

export async function parseFile(file: File): Promise<any> {
  const ext = file.name.split('.').pop()?.toLowerCase();

  if (ext === 'csv') return parseCSV(file);
  if (ext === 'txt') return parseTXT(file);
  if (ext === 'xlsx' || ext === 'xls') return parseExcel(file);
  if (ext === 'json') return parseJSON(file);

  throw new Error(`Unsupported file type: .${ext}`);
}

async function parseCSV(file: File): Promise<any> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h) => h.toLowerCase().trim(),
      complete: (results) => {
        const seen = new Set<string>();
        let invalid = 0, duplicates = 0;
        const contacts: any[] = [];

        for (const row of results.data as Record<string, string>[]) {
          const emailKey = Object.keys(row).find(k => k.includes('email'));
          const email = (emailKey ? row[emailKey] : '').toLowerCase().trim();

          if (!isValidEmail(email)) { invalid++; continue; }
          if (seen.has(email)) { duplicates++; continue; }
          seen.add(email);
          contacts.push(buildContact(email, row));
        }

        resolve({
          total: results.data.length,
          valid: contacts.length,
          invalid,
          duplicates,
          contacts,
        });
      },
      error: reject,
    });
  });
}

async function parseTXT(file: File): Promise<any> {
  const text = await file.text();
  const emails = extractEmailsFromText(text);
  const seen = new Set<string>();
  let duplicates = 0;
  const contacts: any[] = [];

  for (const email of emails) {
    if (seen.has(email)) { duplicates++; continue; }
    seen.add(email);
    contacts.push(buildContact(email));
  }

  return {
    total: emails.length + duplicates,
    valid: contacts.length,
    invalid: 0,
    duplicates,
    contacts,
  };
}

async function parseExcel(file: File): Promise<any> {
  const buffer = await file.arrayBuffer();
  const wb = XLSX.read(buffer, { type: 'array' });
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<Record<string, string>>(ws, { defval: '' });

  const normalizedRows = rows.map(r =>
    Object.fromEntries(Object.entries(r).map(([k, v]) => [k.toLowerCase().trim(), String(v)]))
  );

  const seen = new Set<string>();
  let invalid = 0, duplicates = 0;
  const contacts: any[] = [];

  for (const row of normalizedRows) {
    const emailKey = Object.keys(row).find(k => k.includes('email'));
    const email = (emailKey ? row[emailKey] : '').toLowerCase().trim();

    if (!isValidEmail(email)) { invalid++; continue; }
    if (seen.has(email)) { duplicates++; continue; }
    seen.add(email);
    contacts.push(buildContact(email, row));
  }

  return {
    total: normalizedRows.length,
    valid: contacts.length,
    invalid,
    duplicates,
    contacts,
  };
}

async function parseJSON(file: File): Promise<any> {
  const text = await file.text();
  const data = JSON.parse(text);
  const rows = Array.isArray(data) ? data : [data];
  const seen = new Set<string>();
  let invalid = 0, duplicates = 0;
  const contacts: any[] = [];

  for (const row of rows) {
    const email = (row.email || '').toLowerCase().trim();
    if (!isValidEmail(email)) { invalid++; continue; }
    if (seen.has(email)) { duplicates++; continue; }
    seen.add(email);
    contacts.push(buildContact(email, row));
  }

  return {
    total: rows.length,
    valid: contacts.length,
    invalid,
    duplicates,
    contacts,
  };
}