export const NORMAL_RANGES = {
  ivsd: { hint: "6-10 mm", min: 6, max: 10, unit: "mm" },
  lvidd: { hint: "38-58 mm", min: 38, max: 58, unit: "mm" },
  lvids: { hint: "22-40 mm", min: 22, max: 40, unit: "mm" },
  lvpwd: { hint: "6-10 mm", min: 6, max: 10, unit: "mm" },
  laSize: { hint: "27-40 mm", min: 27, max: 40, unit: "mm" },
  aorticRoot: { hint: "20-37 mm", min: 20, max: 37, unit: "mm" },
  ef: { hint: "≥55 %", min: 55, max: 80, unit: "%" },
  fs: { hint: "25-45 %", min: 25, max: 45, unit: "%" },
  lvMass: { hint: "Male: <224g, Female: <162g", min: 50, max: 224, unit: "g" },
  tapse: { hint: "17-30 mm", min: 17, max: 30, unit: "mm" },
  rvspPasp: { hint: "<35 mmHg", min: 10, max: 35, unit: "mmHg" },
  ivcDiameter: { hint: "15-21 mm", min: 15, max: 21, unit: "mm" },
  eaRatio: { hint: "0.8-1.5", min: 0.8, max: 1.5, unit: "" },
  eePrime: { hint: "<14", min: 3, max: 14, unit: "" },
  decelTime: { hint: "160-240 ms", min: 160, max: 240, unit: "ms" },
  lvotVti: { hint: "15-25 cm", min: 15, max: 25, unit: "cm" },
  avPeakGradient: { hint: "<10 mmHg", min: 2, max: 10, unit: "mmHg" },
  avMeanGradient: { hint: "<5 mmHg", min: 1, max: 5, unit: "mmHg" },
  mvGradient: { hint: "<3 mmHg", min: 0.5, max: 3, unit: "mmHg" },
  trVelocity: { hint: "<2.8 m/s", min: 1.0, max: 2.8, unit: "m/s" },
  mva: { hint: "4.0-6.0 cm²", min: 4.0, max: 6.0, unit: "cm²" },
};

/**
 * Calculates Fractional Shortening (FS %)
 */
export function calculateFS(lvidd, lvids) {
  const d = parseFloat(lvidd);
  const s = parseFloat(lvids);
  if (!isNaN(d) && !isNaN(s) && d > 0) {
    return Math.round(((d - s) / d) * 100);
  }
  return "";
}

/**
 * Calculates LV Mass (g) using Devereux formula:
 * LV Mass = 0.8 * 1.04 * [((LVIDd + IVSd + LVPWd)/10)^3 - (LVIDd/10)^3] + 0.6
 */
export function calculateLVMass(lvidd, ivsd, lvpwd) {
  const d = parseFloat(lvidd);
  const ivs = parseFloat(ivsd);
  const pw = parseFloat(lvpwd);

  if (!isNaN(d) && !isNaN(ivs) && !isNaN(pw) && d > 0 && ivs > 0 && pw > 0) {
    const totalDiameterCm = (d + ivs + pw) / 10;
    const internalDiameterCm = d / 10;
    const mass = 0.8 * 1.04 * (Math.pow(totalDiameterCm, 3) - Math.pow(internalDiameterCm, 3)) + 0.6;
    return Math.round(mass);
  }
  return "";
}

/**
 * Automatically interprets EF percentage based on IAE/ASE guidelines
 */
export function interpretEF(efVal) {
  const ef = parseFloat(efVal);
  if (isNaN(ef)) return "";
  if (ef >= 55) return "Normal (≥55%)";
  if (ef >= 45 && ef < 55) return "Mildly reduced (45-54%)";
  if (ef >= 30 && ef < 45) return "Moderately reduced (30-44%)";
  return "Severely reduced (<30%)";
}

/**
 * Auto-generates final impression from reporting inputs
 */
export function generateAutoImpression(state) {
  const findings = [];

  // 1. LV Chamber & Systolic Function
  const lvSize = state.lv.size || "Normal";
  const lvSystolic = state.lv.systolic || "Normal";
  const ef = state.measurements.ef;
  
  let lvText = "";
  if (lvSize === "Normal") {
    lvText += "Normal LV chamber size";
  } else {
    lvText += `${lvSize} LV cavity`;
  }

  if (lvSystolic === "Normal") {
    lvText += ` with normal LV systolic function`;
  } else {
    lvText += ` with ${lvSystolic.toLowerCase()}`;
  }

  if (ef) {
    lvText += ` (EF ${ef}%)`;
  }
  lvText += ".";
  findings.push(lvText);

  // 2. RWMA
  const rwma = state.lv.rwma;
  const rwmaTerritory = state.lv.rwmaTerritory;
  if (rwma === "Present") {
    if (rwmaTerritory && rwmaTerritory !== "None") {
      findings.push(`Regional wall motion abnormality (RWMA) present in ${rwmaTerritory} territory.`);
    } else {
      findings.push("Regional wall motion abnormality (RWMA) present.");
    }
  } else {
    findings.push("No regional wall motion abnormality (RWMA) detected.");
  }

  // 3. Diastolic Function
  const diastolic = state.lv.diastolic;
  if (diastolic && diastolic !== "Normal") {
    findings.push(`${diastolic} diastolic dysfunction.`);
  } else if (diastolic === "Normal") {
    findings.push("Normal LV diastolic function.");
  }

  // 4. RV Size & Function
  const rvSize = state.rv.size || "Normal";
  const rvFunc = state.rv.function || "Normal";
  let rvText = "";
  if (rvSize === "Normal" && rvFunc === "Normal") {
    rvText = "Normal RV chamber size and systolic function.";
  } else {
    rvText = `${rvSize} RV cavity with ${rvFunc.toLowerCase()} systolic function.`;
  }
  findings.push(rvText);

  // 5. Atria & IAS
  const laSize = state.laRa.laSize || "Normal";
  const raSize = state.laRa.raSize || "Normal";
  const ias = state.ias;

  let atriaText = [];
  if (laSize !== "Normal") atriaText.push(`LA is ${laSize.toLowerCase()}`);
  if (raSize !== "Normal") atriaText.push(`RA is ${raSize.toLowerCase()}`);
  
  if (atriaText.length > 0) {
    findings.push(atriaText.join(", ") + ".");
  } else {
    findings.push("Normal bi-atrial chamber dimensions.");
  }

  if (ias && ias !== "Intact") {
    findings.push(`Interatrial septum (IAS): ${ias}.`);
  }

  // 6. Valves (Mitral, Aortic, Tricuspid, Pulmonary)
  const valveFindings = [];
  const valveKeys = ["mitral", "aortic", "tricuspid", "pulmonary"];
  
  valveKeys.forEach(key => {
    const valve = state.valves[key];
    const vName = key.charAt(0).toUpperCase() + key.slice(1);
    
    let parts = [];
    if (valve.stenosis && valve.stenosis !== "None") {
      let stenText = `${valve.stenosis.toLowerCase()} ${vName} Stenosis`;
      if (key === "mitral" && state.measurements.mva) {
        stenText += ` (MVA ${state.measurements.mva} cm²)`;
      }
      parts.push(stenText);
    }
    if (valve.regurgitation && valve.regurgitation !== "None") {
      parts.push(`${valve.regurgitation.toLowerCase()} ${vName} Regurgitation`);
    }
    
    if (parts.length > 0) {
      let desc = parts.join(" and ");
      if (valve.morphology && valve.morphology !== "Normal") {
        desc += ` (${valve.morphology.toLowerCase()} morphology)`;
      }
      if (key === "mitral" && state.measurements.mva && valve.stenosis === "None") {
        desc += ` (MVA ${state.measurements.mva} cm²)`;
      }
      if (valve.remarks) {
        desc += ` - ${valve.remarks}`;
      }
      valveFindings.push(desc);
    } else if (valve.morphology && valve.morphology !== "Normal") {
      let desc = `${vName} valve morphology is ${valve.morphology.toLowerCase()}`;
      if (key === "mitral" && state.measurements.mva) {
        desc += ` (MVA ${state.measurements.mva} cm²)`;
      }
      if (valve.remarks) {
        desc += ` (${valve.remarks})`;
      }
      valveFindings.push(desc);
    } else if (key === "mitral" && state.measurements.mva) {
      let desc = `Mitral Valve Area (MVA) is ${state.measurements.mva} cm²`;
      if (valve.remarks) {
        desc += ` - ${valve.remarks}`;
      }
      valveFindings.push(desc);
    }
  });

  if (valveFindings.length > 0) {
    findings.push("Valvular findings: " + valveFindings.join("; ") + ".");
  } else {
    findings.push("Normal valve morphology with no significant stenosis or regurgitation.");
  }

  // 7. Doppler & Pulmonary Pressures
  const paspVal = state.measurements.rvspPasp;
  const paspSeverity = state.doppler.paspSeverity || "Normal";
  const trJet = state.doppler.trJet;
  const ivc = state.doppler.ivc;

  let pulmonaryText = "";
  if (paspVal || paspSeverity !== "Normal") {
    pulmonaryText = `${paspSeverity} Pulmonary Hypertension`;
    if (paspVal) {
      pulmonaryText += ` (estimated PASP ${paspVal} mmHg)`;
    }
    pulmonaryText += ".";
    findings.push(pulmonaryText);
  }

  if (ivc) {
    findings.push(`IVC is ${ivc.toLowerCase()}.`);
  }

  // 8. Pericardium & Aorta
  const effusion = state.pericardium.effusion || "None";
  if (effusion !== "None") {
    findings.push(`${effusion} pericardial effusion.`);
  } else {
    findings.push("No pericardial effusion.");
  }

  const aoRoot = state.aorta.root || "Normal";
  const aoAsc = state.aorta.ascending || "Normal";
  if (aoRoot !== "Normal" || aoAsc !== "Normal") {
    let aortaParts = [];
    if (aoRoot !== "Normal") aortaParts.push(`dilated aortic root`);
    if (aoAsc !== "Normal") aortaParts.push(`dilated ascending aorta`);
    findings.push("Aorta: " + aortaParts.join(" and ") + ".");
  }

  // 9. Masses
  if (state.masses.clotVegMass === "Present") {
    findings.push("Intracardiac mass, clot, or vegetation suspected (correlate clinically).");
  }

  return findings.join(" ");
}
