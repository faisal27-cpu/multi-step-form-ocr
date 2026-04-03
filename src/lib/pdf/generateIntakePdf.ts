import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import type { IntakeFormState } from "@/types/intake";

interface PdfInput {
  submissionId: string;
  fields: IntakeFormState;
  createdAt: string;
}

const PRIMARY = rgb(0.21, 0.33, 0.78); // blue
const DARK    = rgb(0.1, 0.1, 0.1);
const MUTED   = rgb(0.45, 0.45, 0.45);
const LIGHT   = rgb(0.96, 0.97, 1.0);
const WHITE   = rgb(1, 1, 1);

const CATEGORY_LABELS: Record<string, string> = {
  employment: "Employment",
  financial:  "Financial",
  medical:    "Medical",
  legal:      "Legal",
  other:      "Other",
};

export async function generateIntakePdf(input: PdfInput): Promise<Uint8Array> {
  const { submissionId, fields, createdAt } = input;

  const doc  = await PDFDocument.create();
  const page = doc.addPage([595, 842]); // A4
  const { width, height } = page.getSize();

  const fontBold    = await doc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await doc.embedFont(StandardFonts.Helvetica);

  let y = height;

  // ── Header bar ────────────────────────────────────────────────────────────
  const headerH = 72;
  page.drawRectangle({ x: 0, y: height - headerH, width, height: headerH, color: PRIMARY });

  page.drawText("Intake Submission Summary", {
    x: 40, y: height - 38, size: 18, font: fontBold, color: WHITE,
  });
  page.drawText(`ID: ${submissionId}`, {
    x: 40, y: height - 58, size: 9, font: fontRegular, color: rgb(0.8, 0.85, 1.0),
  });

  y = height - headerH - 28;

  // ── Section helper ────────────────────────────────────────────────────────
  const drawSection = (title: string, rows: [string, string][]) => {
    // Section heading
    page.drawText(title.toUpperCase(), {
      x: 40, y, size: 8, font: fontBold, color: PRIMARY,
    });
    y -= 6;
    // Divider
    page.drawLine({ start: { x: 40, y }, end: { x: width - 40, y }, thickness: 0.5, color: PRIMARY, opacity: 0.3 });
    y -= 14;

    rows.forEach(([label, value], i) => {
      // Alternating row background
      if (i % 2 === 0) {
        page.drawRectangle({ x: 38, y: y - 4, width: width - 76, height: 18, color: LIGHT });
      }
      page.drawText(label, { x: 44, y, size: 9, font: fontBold, color: MUTED });
      page.drawText(value || "—", { x: 220, y, size: 9, font: fontRegular, color: DARK });
      y -= 20;
    });

    y -= 12;
  };

  // ── Personal Information ──────────────────────────────────────────────────
  drawSection("Personal Information", [
    ["Full Name",            fields.fullName],
    ["Date of Birth",        fields.dateOfBirth],
    ["ID / Document Number", fields.idNumber],
    ["Email Address",        fields.email],
    ["Phone Number",         fields.phone],
    ["Address",              fields.address],
  ]);

  // ── Additional Details ────────────────────────────────────────────────────
  drawSection("Additional Details", [
    ["Submission Category", CATEGORY_LABELS[fields.submissionCategory] ?? fields.submissionCategory],
    ["Reference Number",    fields.referenceNumber || "—"],
    ["Notes",               fields.notes || "—"],
  ]);

  // ── Footer ────────────────────────────────────────────────────────────────
  const footerY = 36;
  page.drawLine({
    start: { x: 40, y: footerY + 16 },
    end:   { x: width - 40, y: footerY + 16 },
    thickness: 0.5, color: MUTED, opacity: 0.4,
  });

  const submittedAt = new Date(createdAt).toLocaleString("en-US", {
    dateStyle: "long", timeStyle: "short",
  });

  page.drawText(`Submitted: ${submittedAt}`, {
    x: 40, y: footerY, size: 8, font: fontRegular, color: MUTED,
  });
  page.drawText("Intake Form · Confidential", {
    x: width - 40 - fontRegular.widthOfTextAtSize("Intake Form · Confidential", 8),
    y: footerY, size: 8, font: fontRegular, color: MUTED,
  });

  return doc.save();
}
