import html2pdf from "html2pdf.js";

interface Place {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  category: string;
}

interface ItineraryItem {
  id: number;
  trip_id: number;
  title: string;
  day_number: number | null;
  start_time: string;
  end_time: string;
  place_id: number;
  description: string;
  place?: Place;
  created_at?: string;
  updated_at?: string;
}

interface Trip {
  id: number;
  user_id: number;
  title: string;
  destination_country: string;
  destination_city: string;
  start_date: string;
  end_date: string;
  status: "planning" | "ongoing" | "completed";
  is_group: boolean;
  progress: string;
  duration_days: number | null;
  created_at: string;
  updated_at: string;
}

const formatTime = (timeString: string): string => {
  return timeString.slice(0, 5);
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
};

const getDateForDay = (startDate: string, dayNumber: number): string => {
  const date = new Date(startDate);
  date.setDate(date.getDate() + (dayNumber - 1));
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
};

// Escape HTML to prevent injection and formatting issues
const escapeHtml = (text: string): string => {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
};

/**
 * Export itinerary to PDF with Korean/Unicode support
 * Handles both cases: when day_number is present and when it's null
 * @param trip - Trip details
 * @param itineraryItems - All itinerary items (can have day_number or null)
 */
export const exportItineraryToPDF = (trip: Trip, itineraryItems: ItineraryItem[]) => {
  // Group items by day_number (null will be treated as "Unscheduled")
  const itemsByDay = itineraryItems.reduce(
    (acc, item) => {
      const key = item.day_number !== null ? `day_${item.day_number}` : "unscheduled";
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(item);
      return acc;
    },
    {} as Record<string, ItineraryItem[]>,
  );

  // Sort keys: numbered days first, then unscheduled
  const sortedKeys = Object.keys(itemsByDay).sort((a, b) => {
    if (a === "unscheduled") return 1;
    if (b === "unscheduled") return -1;
    const dayA = parseInt(a.replace("day_", ""));
    const dayB = parseInt(b.replace("day_", ""));
    return dayA - dayB;
  });

  // Build HTML content optimized for A4 PDF
  let htmlContent = `
    <div style="font-family: 'Malgun Gothic', Arial, sans-serif; padding: 15px; max-width: 100%; box-sizing: border-box;">
      <div style="border-bottom: 3px solid #428bca; padding-bottom: 12px; margin-bottom: 18px;">
        <h1 style="color: #333; margin: 0 0 8px 0; font-size: 22px; font-weight: bold;">${escapeHtml(trip.title)}</h1>
        <p style="color: #666; margin: 2px 0; font-size: 11px;">
          <strong>Destination:</strong> ${escapeHtml(trip.destination_city)}, ${escapeHtml(trip.destination_country)}
        </p>
        <p style="color: #666; margin: 2px 0; font-size: 11px;">
          <strong>Duration:</strong> ${formatDate(trip.start_date)} - ${formatDate(trip.end_date)}
        </p>
        <p style="color: #666; margin: 2px 0; font-size: 11px;">
          <strong>Status:</strong> ${trip.status.toUpperCase()}
        </p>
      </div>
  `;

  // Process each day or unscheduled section
  sortedKeys.forEach((key) => {
    const items = itemsByDay[key];

    let dayTitle: string;
    if (key === "unscheduled") {
      dayTitle = "Unscheduled Activities";
    } else {
      const dayNumber = parseInt(key.replace("day_", ""));
      const dateStr = getDateForDay(trip.start_date, dayNumber);
      dayTitle = `Day ${dayNumber} - ${dateStr}`;
    }

    htmlContent += `
      <div style="margin-bottom: 20px; page-break-inside: avoid;">
        <h2 style="color: #428bca; font-size: 15px; margin: 12px 0 8px 0; padding-bottom: 5px; border-bottom: 2px solid #e0e0e0; font-weight: bold;">
          ${dayTitle}
        </h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 12px; table-layout: fixed;">
          <thead>
            <tr style="background-color: #428bca; color: #ffffff;">
              <th style="padding: 7px 4px; text-align: left; font-size: 10px; border: 1px solid #366ba3; width: 13%;">Start</th>
              <th style="padding: 7px 4px; text-align: left; font-size: 10px; border: 1px solid #366ba3; width: 13%;">End</th>
              <th style="padding: 7px 4px; text-align: left; font-size: 10px; border: 1px solid #366ba3; width: 32%;">Activity</th>
              <th style="padding: 7px 4px; text-align: left; font-size: 10px; border: 1px solid #366ba3; width: 42%;">Location</th>
            </tr>
          </thead>
          <tbody>
    `;

    items.forEach((item) => {
      const description =
        item.description && item.description !== "-"
          ? `<br/><span style="font-weight: normal; font-size: 9px; color: #666;">${escapeHtml(item.description)}</span>`
          : "";
      htmlContent += `
        <tr style="background-color: #ffffff;">
          <td style="padding: 6px 4px; font-size: 9px; border: 1px solid #ddd; word-wrap: break-word; vertical-align: top;">${formatTime(item.start_time)}</td>
          <td style="padding: 6px 4px; font-size: 9px; border: 1px solid #ddd; word-wrap: break-word; vertical-align: top;">${formatTime(item.end_time)}</td>
          <td style="padding: 6px 4px; font-size: 9px; border: 1px solid #ddd; font-weight: 600; word-wrap: break-word; vertical-align: top; line-height: 1.3;">${escapeHtml(item.title)}${description}</td>
          <td style="padding: 6px 4px; font-size: 9px; border: 1px solid #ddd; word-wrap: break-word; vertical-align: top;">${escapeHtml(item.place?.address || "No address")}</td>
        </tr>
      `;
    });

    htmlContent += `
          </tbody>
        </table>
      </div>
    `;
  });

  // If no items
  if (itineraryItems.length === 0) {
    htmlContent += `
      <div style="text-align: center; padding: 40px; color: #999;">
        <p style="font-size: 16px;">No activities scheduled yet.</p>
      </div>
    `;
  }

  htmlContent += `</div>`;

  // Create an isolated iframe to avoid CSS conflicts with oklch colors
  const iframe = document.createElement("iframe");
  iframe.style.cssText = `
    position: absolute;
    left: -9999px;
    top: 0;
    width: 210mm;
    height: 297mm;
    border: none;
  `;
  document.body.appendChild(iframe);

  const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
  if (!iframeDoc) {
    console.error("Could not access iframe document");
    document.body.removeChild(iframe);
    return;
  }

  // Write clean HTML to iframe with explicit styles (no CSS variables or oklch)
  iframeDoc.open();
  iframeDoc.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          html, body {
            width: 100vh;
            height: 100%;
            margin: 0;
            padding: 0;
          }
          body {
            font-family: 'Malgun Gothic', 'Arial', 'Noto Sans KR', sans-serif;
            background: #ffffff !important;
            color: #000000 !important;
            font-size: 10px;
            line-height: 1.4;
          }
          table {
            width: 100% !important;
            table-layout: fixed !important;
            border-collapse: collapse !important;
            border-spacing: 0 !important;
          }
          td, th {
            word-wrap: break-word !important;
            word-break: break-word !important;
            overflow-wrap: break-word !important;
            white-space: normal !important;
            hyphens: auto !important;
          }
          th {
            background-color: #428bca !important;
            color: #ffffff !important;
            font-weight: bold !important;
          }
          td {
            background-color: #ffffff !important;
          }
          tr {
            background-color: #ffffff !important;
          }
          thead tr {
            background-color: #428bca !important;
          }
          h1, h2, h3 {
            page-break-after: avoid;
          }
        </style>
      </head>
      <body>
        ${htmlContent}
      </body>
    </html>
  `);
  iframeDoc.close();

  // Wait for iframe content to load and render
  setTimeout(() => {
    const element = iframeDoc.body;

    // Configure html2pdf options optimized for complete content rendering
    const opt = {
      margin: [10, 10, 10, 10] as [number, number, number, number],
      filename: `${trip.title.replace(/[^a-z0-9가-힣]/gi, "_").toLowerCase()}_itinerary.pdf`,
      image: { type: "jpeg" as const, quality: 0.95 },
      html2canvas: {
        scale: 1.5,
        useCORS: true,
        letterRendering: true,
        backgroundColor: "#ffffff",
        logging: false,
        scrollY: 0,
        scrollX: 0,
        foreignObjectRendering: false,
        allowTaint: true,
        onclone: (clonedDoc: Document) => {
          // Remove all link and style tags that might reference external CSS
          const links = clonedDoc.querySelectorAll('link[rel="stylesheet"]');
          links.forEach((link) => link.remove());

          const styles = clonedDoc.querySelectorAll("style");
          styles.forEach((style) => {
            if (style.innerHTML.includes("oklch")) {
              style.innerHTML = style.innerHTML.replace(/oklch\([^)]+\)/g, "rgb(0, 0, 0)");
            }
          });

          // Force all elements to use explicit RGB colors
          const allElements = clonedDoc.querySelectorAll("*");
          allElements.forEach((el: Element) => {
            if (el instanceof HTMLElement) {
              const inlineStyle = el.getAttribute("style");
              if (inlineStyle) {
                // Replace any oklch or var() with safe colors
                const cleanedStyle = inlineStyle
                  .replace(/oklch\([^)]+\)/gi, "rgb(0, 0, 0)")
                  .replace(/var\(--[^)]+\)/gi, "rgb(0, 0, 0)");
                el.setAttribute("style", cleanedStyle);
              }
            }
          });
        },
      },
      jsPDF: {
        unit: "mm" as const,
        format: "a4" as const,
        orientation: "portrait" as const,
        compress: true,
      },
      pagebreak: {
        mode: ["avoid-all", "css", "legacy"],
      },
    };

    // Generate PDF with complete content capture
    html2pdf()
      .set(opt)
      .from(element)
      .save()
      .then(() => {
        // Clean up
        document.body.removeChild(iframe);
        console.log("PDF generated successfully");
      })
      .catch((error: any) => {
        console.error("Error generating PDF:", error);
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      });
  }, 200);
};
