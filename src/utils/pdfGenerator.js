import { jsPDF } from "jspdf";
import { NORMAL_RANGES } from "./echoCalculations";

export function exportReportToPDF(state, hospitalHeader = {}) {
  // Create PDF in A4 size (portrait, unit: mm)
  // A4 size is 210 x 297 mm
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageHeight = 297;
  const pageWidth = 210;
  const margin = 15;
  let y = 15;

  // Helper functions for layouts
  const printHeader = () => {
    // Top border accent
    doc.setFillColor(30, 64, 175); // primary clinical blue (#1e40af)
    doc.rect(0, 0, pageWidth, 4, "F");

    y = 12;
    // Hospital / Clinic Title
    const title = hospitalHeader.hospitalName || "VISION HEART CENTRE, REWA";
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(30, 64, 175);
    doc.text(title, margin, y);
    
    // Hospital details (address, contact, etc.)
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(75, 85, 99); // gray-600
    
    const details = [];
    if (hospitalHeader.department) details.push(hospitalHeader.department);
    if (hospitalHeader.address) details.push(hospitalHeader.address);
    if (hospitalHeader.contact) details.push(`Contact: ${hospitalHeader.contact}`);
    
    const detailsStr = details.length > 0 ? details.join(" | ") : "Comprehensive Echocardiography Lab | Clinical Cardiology Service";
    y += 5;
    doc.text(detailsStr, margin, y);

    // Separator line
    y += 4;
    doc.setDrawColor(209, 213, 219); // gray-300
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += 5;
  };

  printHeader();

  // --- Patient Details Section ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(30, 64, 175);
  doc.text("PATIENT DEMOGRAPHICS", margin, y);
  y += 4;

  // Patient table background
  doc.setFillColor(249, 250, 251); // gray-50
  doc.rect(margin, y, pageWidth - (margin * 2), 26, "F");
  // Patient table border
  doc.setDrawColor(229, 231, 235); // gray-200
  doc.rect(margin, y, pageWidth - (margin * 2), 26, "S");

  // Grid content for demographics
  doc.setFontSize(9.5);
  doc.setTextColor(17, 24, 39); // gray-900

  // Col 1 X coordinates
  const c1Label = margin + 3;
  const c1Val = margin + 32;
  // Col 2 X coordinates
  const c2Label = margin + 92;
  const c2Val = margin + 120;

  // Row 1
  y += 5;
  doc.setFont("helvetica", "bold"); doc.text("Patient Name:", c1Label, y);
  doc.setFont("helvetica", "normal"); doc.text(state.patient.name || "N/A", c1Val, y);
  doc.setFont("helvetica", "bold"); doc.text("UHID / Reg No:", c2Label, y);
  doc.setFont("helvetica", "normal"); doc.text(state.patient.uhid || "N/A", c2Val, y);

  // Row 2
  y += 6;
  doc.setFont("helvetica", "bold"); doc.text("Age / Gender:", c1Label, y);
  doc.setFont("helvetica", "normal"); doc.text(`${state.patient.age || "N/A"} / ${state.patient.sex || "N/A"}`, c1Val, y);
  doc.setFont("helvetica", "bold"); doc.text("Report Date:", c2Label, y);
  doc.setFont("helvetica", "normal"); doc.text(state.patient.date || "N/A", c2Val, y);

  // Row 3
  y += 6;
  doc.setFont("helvetica", "bold"); doc.text("Referring Dr:", c1Label, y);
  doc.setFont("helvetica", "normal"); doc.text(state.patient.referringDoctor || "N/A", c1Val, y);
  doc.setFont("helvetica", "bold"); doc.text("Indication:", c2Label, y);
  doc.setFont("helvetica", "normal"); doc.text(state.patient.indication || "N/A", c2Val, y);

  // Row 4
  y += 6;
  doc.setFont("helvetica", "bold"); doc.text("OPD / IPD / Ward:", c1Label, y);
  doc.setFont("helvetica", "normal"); doc.text(`${state.patient.opdIpd}${state.patient.wardBed ? ` (${state.patient.wardBed})` : ""}`, c1Val, y);
  doc.setFont("helvetica", "bold"); doc.text("Echocardiographer:", c2Label, y);
  doc.setFont("helvetica", "normal"); doc.text(state.echocardiographer || "N/A", c2Val, y);

  y += 6; // Clear the demographics box

  // --- Measurements Section ---
  y += 4;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(30, 64, 175);
  doc.text("ECHOCARDIOGRAPHIC MEASUREMENTS", margin, y);
  y += 4;

  // We set up a side-by-side double column layout for the 20 measurements
  const colWidth = (pageWidth - (margin * 2) - 6) / 2; // ~87mm each
  const col2X = margin + colWidth + 6;

  // Let's split measurements into Col A and Col B based on active entries
  const allMeasDefs = [
    { key: "ivsd", label: "IVSd" },
    { key: "lvidd", label: "LVIDd" },
    { key: "lvids", label: "LVIDs" },
    { key: "lvpwd", label: "LVPWd" },
    { key: "laSize", label: "LA Dimension" },
    { key: "aorticRoot", label: "Aortic Root" },
    { key: "ef", label: "LVEF" },
    { key: "fs", label: "Fractional Shortening" },
    { key: "lvMass", label: "LV Mass" },
    { key: "tapse", label: "TAPSE" },
    { key: "rvspPasp", label: "RVSP / PASP" },
    { key: "trVelocity", label: "TR Jet Velocity" },
    { key: "ivcDiameter", label: "IVC Diameter" },
    { key: "eaRatio", label: "Mitral E/A Ratio" },
    { key: "eePrime", label: "Mitral E/e' Ratio" },
    { key: "decelTime", label: "MV Decel Time" },
    { key: "lvotVti", label: "LVOT VTI" },
    { key: "avPeakGradient", label: "AV Peak Gradient" },
    { key: "avMeanGradient", label: "AV Mean Gradient" },
    { key: "mvGradient", label: "MV Mean Gradient (if MS)" },
    { key: "mva", label: "Mitral Valve Area (MVA)" },
  ];

  const activeMeas = allMeasDefs.filter(
    (item) => state.measurements[item.key] !== undefined && state.measurements[item.key] !== null && state.measurements[item.key] !== ""
  );

  const half = Math.ceil(activeMeas.length / 2);
  const colAMeas = activeMeas.slice(0, half);
  const colBMeas = activeMeas.slice(half);

  if (activeMeas.length > 0) {
    // Draw table header for both columns
    doc.setFillColor(243, 244, 246); // gray-100
    doc.rect(margin, y, colWidth, 6, "F");
    if (colBMeas.length > 0) {
      doc.rect(col2X, y, colWidth, 6, "F");
    }
    
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(31, 41, 55);

    const drawMeasHeader = (startX) => {
      doc.text("Parameter", startX + 2, y + 4.5);
      doc.text("Value", startX + 46, y + 4.5);
      doc.text("Normal Range", startX + 62, y + 4.5);
    };
    drawMeasHeader(margin);
    if (colBMeas.length > 0) {
      drawMeasHeader(col2X);
    }
    y += 6;

    // Let's render the rows
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);

    const maxRows = Math.max(colAMeas.length, colBMeas.length);
    for (let i = 0; i < maxRows; i++) {
      // Alternate row styling background
      if (i % 2 === 1) {
        doc.setFillColor(249, 250, 251); // gray-50
        if (i < colAMeas.length) {
          doc.rect(margin, y, colWidth, 5.5, "F");
        }
        if (i < colBMeas.length) {
          doc.rect(col2X, y, colWidth, 5.5, "F");
        }
      }
      
      // Draw horizontal dividers
      doc.setDrawColor(243, 244, 246); // gray-100
      if (i < colAMeas.length) {
        doc.line(margin, y + 5.5, margin + colWidth, y + 5.5);
      }
      if (i < colBMeas.length) {
        doc.line(col2X, y + 5.5, col2X + colWidth, y + 5.5);
      }

      // Left Column A
      if (i < colAMeas.length) {
        const item = colAMeas[i];
        const val = state.measurements[item.key];
        const info = NORMAL_RANGES[item.key] || { hint: "", unit: "" };
        
        doc.setFont("helvetica", "bold");
        doc.text(item.label, margin + 2, y + 4);
        doc.setFont("helvetica", "normal");
        
        const valText = val ? `${val} ${info.unit}` : "-";
        doc.text(valText, margin + 46, y + 4);
        doc.setFont("helvetica", "normal");
        doc.text(info.hint || "", margin + 62, y + 4);
      }

      // Right Column B
      if (i < colBMeas.length) {
        const item = colBMeas[i];
        const val = state.measurements[item.key];
        const info = NORMAL_RANGES[item.key] || { hint: "", unit: "" };
        
        doc.setFont("helvetica", "bold");
        doc.text(item.label, col2X + 2, y + 4);
        doc.setFont("helvetica", "normal");

        const valText = val ? `${val} ${info.unit}` : "-";
        doc.text(valText, col2X + 46, y + 4);
        doc.setFont("helvetica", "normal");
        doc.text(info.hint || "", col2X + 62, y + 4);
      }

      y += 5.5;
    }
    y += 6; // spacing after measurements
  } else {
    doc.setFont("helvetica", "oblique");
    doc.setFontSize(8.5);
    doc.setTextColor(107, 114, 128);
    doc.text("No echocardiographic measurements recorded.", margin, y + 4);
    y += 10;
  }

  // --- Chambers and Valves Section ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(30, 64, 175);
  doc.text("2D & DOPPLER VALVE FINDINGS", margin, y);
  y += 4;

  doc.setFontSize(9);
  doc.setTextColor(17, 24, 39);

  // Helper to print a line with bold category
  const printFindingLine = (category, description) => {
    // Page overflow safety checks
    if (y > pageHeight - 35) {
      doc.addPage();
      printHeader();
      y = 25;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(30, 64, 175);
      doc.text("2D & DOPPLER VALVE FINDINGS (CONTINUED)", margin, y);
      y += 4;
      doc.setFontSize(9);
      doc.setTextColor(17, 24, 39);
    }

    doc.setFont("helvetica", "bold");
    doc.text(category + ":", margin, y + 3.5);
    doc.setFont("helvetica", "normal");
    
    // Handle text wrap
    const textX = margin + 35;
    const maxTextWidth = pageWidth - textX - margin;
    const splitLines = doc.splitTextToSize(description, maxTextWidth);
    
    splitLines.forEach((line, idx) => {
      if (idx > 0) {
        y += 4.5;
        if (y > pageHeight - 20) {
          doc.addPage();
          printHeader();
          y = 25;
        }
      }
      doc.text(line, textX, y + 3.5);
    });
    
    y += 5.5;
  };

  // LV findings summary
  const isLvNormal = (state.lv.size || "Normal") === "Normal" &&
                     (state.lv.systolic || "Normal") === "Normal" &&
                     (state.lv.rwma || "Absent") === "Absent" &&
                     (state.lv.diastolic || "Normal") === "Normal" &&
                     (state.lv.lvh || "None") === "None";
  const lvSumm = isLvNormal
    ? "Normal"
    : `Cavity: ${state.lv.size || "Normal"}. Systolic function: ${state.lv.systolic || "Normal"}. RWMA: ${state.lv.rwma || "Absent"}${state.lv.rwma === "Present" ? ` (${state.lv.rwmaTerritory} territory)` : ""}. Diastolic function: ${state.lv.diastolic || "Normal"}. LVH: ${state.lv.lvh || "None"}.`;
  printFindingLine("Left Ventricle (LV)", lvSumm);

  // RV findings summary
  const isRvNormal = (state.rv.size || "Normal") === "Normal" &&
                     (state.rv.function || "Normal") === "Normal";
  const rvSumm = isRvNormal
    ? "Normal"
    : `Size: ${state.rv.size || "Normal"}. Systolic function: ${state.rv.function || "Normal"}. TAPSE: ${state.measurements.tapse ? `${state.measurements.tapse} mm` : "N/A"}.`;
  printFindingLine("Right Ventricle (RV)", rvSumm);

  // Atria & Septum findings summary
  const isAtriaNormal = (state.laRa.laSize || "Normal") === "Normal" &&
                        (state.laRa.raSize || "Normal") === "Normal" &&
                        (state.ias || "Intact") === "Intact";
  const atriaSumm = isAtriaNormal
    ? "Normal"
    : `LA Chamber: ${state.laRa.laSize || "Normal"}. RA Chamber: ${state.laRa.raSize || "Normal"}. Interatrial Septum (IAS): ${state.ias || "Intact"}.`;
  printFindingLine("Atria & Septa", atriaSumm);

  // Valves
  const valvesArr = ["mitral", "aortic", "tricuspid", "pulmonary"];
  valvesArr.forEach(vKey => {
    const valve = state.valves[vKey];
    const vName = vKey.charAt(0).toUpperCase() + vKey.slice(1);
    const isValveNormal = (valve.morphology || "Normal") === "Normal" &&
                          (valve.stenosis || "None") === "None" &&
                          (valve.regurgitation || "None") === "None" &&
                          !valve.remarks;
    const vDetails = isValveNormal
      ? "Normal"
      : `Morphology: ${valve.morphology || "Normal"}. Regurgitation: ${valve.regurgitation || "None"}. Stenosis: ${valve.stenosis || "None"}.${valve.remarks ? ` Remarks: ${valve.remarks}` : ""}`;
    printFindingLine(`${vName} Valve`, vDetails);
  });

  // Extra (Pericardium, Aorta, Clots)
  const isExtraNormal = (state.pericardium.effusion || "None") === "None" &&
                        (state.aorta.root || "Normal") === "Normal" &&
                        (state.aorta.ascending || "Normal") === "Normal" &&
                        (state.masses.clotVegMass || "Absent") === "Absent";
  const extraSumm = isExtraNormal
    ? "Normal"
    : `Pericardial Effusion: ${state.pericardium.effusion || "None"}. Aortic Root: ${state.aorta.root || "Normal"}. Ascending Aorta: ${state.aorta.ascending || "Normal"}. Intracardiac Masses/Clots: ${state.masses.clotVegMass || "Absent"}.`;
  printFindingLine("Pericardium & Aorta", extraSumm);

  y += 4;

  // --- Final Impression Section ---
  // Ensure we have enough space for the Impression Box, otherwise trigger page break
  if (y > pageHeight - 65) {
    doc.addPage();
    printHeader();
    y = 25;
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(30, 64, 175);
  doc.text("FINAL CLINICAL IMPRESSION", margin, y);
  y += 4;

  // Wrap impression text
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(17, 24, 39);

  const impressionText = state.finalImpression || "Normal adult transthoracic echocardiogram.";
  const maxImpWidth = pageWidth - (margin * 2) - 8;
  const splitImpression = doc.splitTextToSize(impressionText, maxImpWidth);
  const boxHeight = (splitImpression.length * 4.5) + 8;

  // Double check if page overflow happens with this box height
  if (y + boxHeight > pageHeight - 35) {
    doc.addPage();
    printHeader();
    y = 25;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(30, 64, 175);
    doc.text("FINAL CLINICAL IMPRESSION (CONTINUED)", margin, y);
    y += 4;
  }

  // Draw Impression Box (light blue tinted background with dark blue border)
  doc.setFillColor(239, 246, 255); // primary-light (#eff6ff)
  doc.setDrawColor(191, 219, 254); // border light blue
  doc.setLineWidth(0.6);
  doc.rect(margin, y, pageWidth - (margin * 2), boxHeight, "FD");

  let textY = y + 6;
  splitImpression.forEach(line => {
    doc.text(line, margin + 4, textY);
    textY += 4.5;
  });

  y += boxHeight + 4;

  // --- Advice Section ---
  if (state.advice) {
    if (y > pageHeight - 35) {
      doc.addPage();
      printHeader();
      y = 25;
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(30, 64, 175);
    doc.text("Advice / Clinical Recommendations:", margin, y);
    y += 4.5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(31, 41, 55);
    
    const splitAdvice = doc.splitTextToSize(state.advice, pageWidth - (margin * 2));
    splitAdvice.forEach(line => {
      doc.text(line, margin, y);
      y += 4.5;
    });
    y += 2;
  }

  // --- Signature and Footer Section ---
  const signHeight = 25;
  if (y > pageHeight - signHeight - 15) {
    doc.addPage();
    printHeader();
    y = 25;
  }

  // Space for sign
  y += 4;
  doc.setDrawColor(209, 213, 219); // gray-300
  doc.setLineWidth(0.25);
  doc.line(pageWidth - margin - 60, y, pageWidth - margin, y); // signature line
  
  y += 4;
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(31, 41, 55);
  doc.text(state.echocardiographer || "Report Signee", pageWidth - margin - 60, y);
  
  y += 4;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(75, 85, 99);
  doc.text("Clinical Cardiologist", pageWidth - margin - 60, y);

  // Time generated stamp (on bottom left)
  doc.text(`Generated: ${new Date().toLocaleString()}`, margin, y);

  // --- Medical Disclaimer (Sticky to page bottom) ---
  const disclaimerY = 285;
  doc.setDrawColor(229, 231, 235);
  doc.setLineWidth(0.25);
  doc.line(margin, disclaimerY - 2, pageWidth - margin, disclaimerY - 2);

  doc.setFont("helvetica", "oblique");
  doc.setFontSize(7.5);
  doc.setTextColor(107, 114, 128); // gray-500
  doc.text(
    "This report must be interpreted in clinical context by a registered cardiac specialist.",
    margin,
    disclaimerY + 1.5
  );

  // Save the PDF
  const safeName = (state.patient.name || "Echo_Report").replace(/[^a-z0-9]/gi, "_").toLowerCase();
  doc.save(`${safeName}_echo_report.pdf`);
}
