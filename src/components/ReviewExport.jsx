import React, { useState } from "react";
import { generateAutoImpression } from "../utils/echoCalculations";
import { exportReportToPDF } from "../utils/pdfGenerator";
import { NORMAL_RANGES } from "../utils/echoCalculations";

export default function ReviewExport({ state, onChange, onSaveReport, hospitalHeader }) {
  const [showPreview, setShowPreview] = useState(false);
  const autoImpression = generateAutoImpression(state);

  const applyAutoImpression = () => {
    onChange("finalImpression", autoImpression);
  };

  const handleImpressionChange = (e) => {
    onChange("finalImpression", e.target.value);
  };

  const handleAdviceChange = (e) => {
    onChange("advice", e.target.value);
  };

  const triggerPDF = () => {
    exportReportToPDF(state, hospitalHeader);
  };

  const triggerPrint = () => {
    window.print();
  };

  return (
    <div className="card shadow-sm animate-fade-in">
      <div className="card-header bg-primary text-white">
        <h2 className="card-title">Review & Finalize Report</h2>
      </div>
      <div className="card-body space-y-6">
        {/* Comparison Alert/Advice */}
        <div className="bg-primary-light border-l-4 border-primary p-4 rounded-r-lg">
          <h3 className="font-semibold text-primary mb-1 text-sm">Clinical Decision Support System</h3>
          <p className="text-xs text-gray-700">
            The system compiles data fields into an interpretation draft below. You can overwrite, add custom measurements, or insert local clinical remarks.
          </p>
        </div>

        {/* Live Impression Generation Box */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* System draft */}
          <div className="border border-dashed border-primary-light-opacity p-4 rounded-lg bg-gray-50 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Auto-Generated Draft</h4>
              <p className="text-sm text-gray-800 leading-relaxed italic">{autoImpression || "No findings entered yet."}</p>
            </div>
            <button
              onClick={applyAutoImpression}
              className="btn btn-secondary btn-sm self-start mt-4"
              disabled={!autoImpression}
            >
              Use System Draft
            </button>
          </div>

          {/* Final impression textarea */}
          <div className="form-group flex flex-col justify-between">
            <div>
              <label className="form-label font-bold text-gray-700" htmlFor="final-impression">
                Final Impression (Editable) *
              </label>
              <textarea
                id="final-impression"
                className="form-control text-sm font-semibold"
                rows="6"
                placeholder="Type the final echo impression here..."
                value={state.finalImpression}
                onChange={handleImpressionChange}
              ></textarea>
            </div>
            <p className="help-text text-gray-400 mt-1">This text block will be printed in bold in the final report.</p>
          </div>
        </div>

        {/* Advice / Recommendations */}
        <div className="form-group pt-2">
          <label className="form-label font-bold text-gray-700" htmlFor="advice-input">
            Advice / Recommendations
          </label>
          <input
            type="text"
            id="advice-input"
            className="form-control"
            placeholder="e.g. Medical therapy as advised, repeat TTE in 6 months, coronary angiogram correlation..."
            value={state.advice || ""}
            onChange={handleAdviceChange}
          />
        </div>

        {/* Medical disclaimer */}
        <div className="border border-red-200 bg-red-50 p-4 rounded-lg text-xs text-red-800">
          <strong>Important Safety Notice:</strong> The auto-generated echo interpretations are decision-support aids only and are not final diagnoses. The registered cardiologist is solely responsible for confirming, editing, signing, and releasing this clinical report.
        </div>

        {/* Control Actions */}
        <div className="flex flex-wrap gap-4 pt-4 border-t">
          <button
            onClick={onSaveReport}
            className="btn btn-primary flex-1 min-w-[140px] justify-center"
          >
            Save Report
          </button>
          <button
            onClick={() => setShowPreview(true)}
            className="btn btn-secondary flex-1 min-w-[140px] justify-center"
          >
            Preview Report
          </button>
          <button
            onClick={triggerPDF}
            className="btn btn-accent text-white flex-1 min-w-[140px] justify-center"
          >
            Export PDF
          </button>
          <button
            onClick={triggerPrint}
            className="btn btn-outline flex-1 min-w-[140px] justify-center"
          >
            Print / System Print
          </button>
        </div>
      </div>

      {/* A4 Preview Modal */}
      {showPreview && (
        <div className="modal-overlay" onClick={() => setShowPreview(false)}>
          <div className="modal-content max-w-[800px]" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header border-b pb-3 mb-4 flex justify-between items-center">
              <h3 className="text-lg font-bold text-primary">Pre-print Report View (A4)</h3>
              <button className="btn btn-outline btn-sm font-bold" onClick={() => setShowPreview(false)}>
                &times; Close
              </button>
            </div>
            
            {/* Simulation of the printed sheet */}
            <div className="a4-sheet-container bg-gray-100 p-6 overflow-y-auto max-h-[70vh] flex justify-center">
              <div className="a4-sheet bg-white p-8 shadow-lg text-gray-900 border text-xs" style={{ width: "210mm", minHeight: "297mm", fontFamily: "Helvetica, Arial, sans-serif" }}>
                {/* Header */}
                <div className="border-b-2 border-primary pb-3 mb-4 text-left">
                  <h1 className="text-xl font-bold text-primary m-0 uppercase">{hospitalHeader.hospitalName || "VISION HEART CENTRE, REWA"}</h1>
                  <p className="text-gray-500 m-0 text-[10px] mt-1">
                    {hospitalHeader.department || "Comprehensive Echocardiography Lab"} | {hospitalHeader.address || "Cardiology Clinical Service"} | {hospitalHeader.contact || "Tel: Clinical Office"}
                  </p>
                </div>

                <div className="text-center font-bold text-sm mb-4 text-primary">ADULT TRANSTHORACIC ECHOCARDIOGRAPHY REPORT</div>

                {/* Patient Table */}
                <table className="w-full border-collapse border border-gray-300 text-[10px] mb-4">
                  <tbody>
                    <tr className="border-b border-gray-300">
                      <td className="p-1-5 font-bold bg-gray-50 border-r border-gray-300" style={{ width: "18%" }}>Name:</td>
                      <td className="p-1-5 border-r border-gray-300" style={{ width: "32%" }}>{state.patient.name || "N/A"}</td>
                      <td className="p-1-5 font-bold bg-gray-50 border-r border-gray-300" style={{ width: "18%" }}>UHID / Reg:</td>
                      <td className="p-1-5" style={{ width: "32%" }}>{state.patient.uhid || "N/A"}</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="p-1-5 font-bold bg-gray-50 border-r border-gray-300">Age / Gender:</td>
                      <td className="p-1-5 border-r border-gray-300">{state.patient.age || "N/A"} / {state.patient.sex}</td>
                      <td className="p-1-5 font-bold bg-gray-50 border-r border-gray-300">Date:</td>
                      <td className="p-1-5">{state.patient.date || "N/A"}</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="p-1-5 font-bold bg-gray-50 border-r border-gray-300">Referring Dr:</td>
                      <td className="p-1-5 border-r border-gray-300">{state.patient.referringDoctor || "N/A"}</td>
                      <td className="p-1-5 font-bold bg-gray-50 border-r border-gray-300">Indication:</td>
                      <td className="p-1-5">{state.patient.indication || "N/A"}</td>
                    </tr>
                    <tr>
                      <td className="p-1-5 font-bold bg-gray-50 border-r border-gray-300">Type:</td>
                      <td className="p-1-5 border-r border-gray-300">{state.patient.opdIpd} {state.patient.wardBed ? `(${state.patient.wardBed})` : ""}</td>
                      <td className="p-1-5 font-bold bg-gray-50 border-r border-gray-300">Clinician:</td>
                      <td className="p-1-5">{state.echocardiographer || "N/A"}</td>
                    </tr>
                  </tbody>
                </table>

                {/* Measurements Grid */}
                <div className="font-bold text-primary mb-1 border-b pb-0.5 text-[11px]">ECHOCARDIOGRAPHIC MEASUREMENTS</div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {/* Left measurements */}
                  <table className="w-full border-collapse border border-gray-200 text-[9px]">
                    <thead>
                      <tr className="bg-gray-100 border-b border-gray-200">
                        <th className="p-1 text-left border-r border-gray-200">Parameter</th>
                        <th className="p-1 text-left border-r border-gray-200">Value</th>
                        <th className="p-1 text-left">Normal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { k: "ivsd", label: "IVSd" },
                        { k: "lvidd", label: "LVIDd" },
                        { k: "lvids", label: "LVIDs" },
                        { k: "lvpwd", label: "LVPWd" },
                        { k: "laSize", label: "LA Dimension" },
                        { k: "aorticRoot", label: "Aortic Root" },
                        { k: "ef", label: "LVEF %" },
                        { k: "fs", label: "FS %" },
                        { k: "lvMass", label: "LV Mass" },
                        { k: "tapse", label: "TAPSE" },
                      ].map(({ k, label }) => (
                        <tr className="border-b border-gray-200" key={k}>
                          <td className="p-1 font-bold border-r border-gray-200">{label}</td>
                          <td className="p-1 border-r border-gray-200">{state.measurements[k] ? `${state.measurements[k]} ${NORMAL_RANGES[k].unit}` : "-"}</td>
                          <td className="p-1 text-gray-500">{NORMAL_RANGES[k].hint}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Right measurements */}
                  <table className="w-full border-collapse border border-gray-200 text-[9px]">
                    <thead>
                      <tr className="bg-gray-100 border-b border-gray-200">
                        <th className="p-1 text-left border-r border-gray-200">Parameter</th>
                        <th className="p-1 text-left border-r border-gray-200">Value</th>
                        <th className="p-1 text-left">Normal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { k: "rvspPasp", label: "RVSP / PASP" },
                        { k: "trVelocity", label: "TR Velocity" },
                        { k: "ivcDiameter", label: "IVC Diameter" },
                        { k: "eaRatio", label: "Mitral E/A" },
                        { k: "eePrime", label: "Mitral E/e'" },
                        { k: "decelTime", label: "MV Decel Time" },
                        { k: "lvotVti", label: "LVOT VTI" },
                        { k: "avPeakGradient", label: "AV Peak Grad" },
                        { k: "avMeanGradient", label: "AV Mean Grad" },
                        { k: "mvGradient", label: "MV Mean Grad (MS)" },
                      ].map(({ k, label }) => (
                        <tr className="border-b border-gray-200" key={k}>
                          <td className="p-1 font-bold border-r border-gray-200">{label}</td>
                          <td className="p-1 border-r border-gray-200">{state.measurements[k] ? `${state.measurements[k]} ${NORMAL_RANGES[k].unit}` : "-"}</td>
                          <td className="p-1 text-gray-500">{NORMAL_RANGES[k].hint}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Structured Findings */}
                <div className="font-bold text-primary mb-1 border-b pb-0.5 text-[11px]">2D AND DOPPLER VALVE FINDINGS</div>
                <div className="space-y-1 text-[10px] mb-4">
                  <div><strong>Left Ventricle (LV):</strong> Cavity: {state.lv.size}, Systolic: {state.lv.systolic}, RWMA: {state.lv.rwma === "Present" ? `Present in ${state.lv.rwmaTerritory}` : "Absent"}, Diastolic: {state.lv.diastolic}, LVH: {state.lv.lvh}</div>
                  <div><strong>Right Ventricle (RV):</strong> Size: {state.rv.size}, Systolic function: {state.rv.function}</div>
                  <div><strong>Atria & Septa:</strong> LA Size: {state.laRa.laSize}, RA Size: {state.laRa.raSize}, IAS: {state.ias}</div>
                  
                  {["mitral", "aortic", "tricuspid", "pulmonary"].map(v => {
                    const valve = state.valves[v];
                    return (
                      <div key={v}>
                        <strong>{v.charAt(0).toUpperCase() + v.slice(1)} Valve:</strong> Morphology: {valve.morphology}, Stenosis: {valve.stenosis}, Regurgitation: {valve.regurgitation} {valve.remarks ? ` | Remarks: ${valve.remarks}` : ""}
                      </div>
                    );
                  })}

                  <div><strong>Doppler & Extra:</strong> Effusion: {state.pericardium.effusion}, Aorta Root: {state.aorta.root}, Ascending Aorta: {state.aorta.ascending}, Clot/Vegetation/Mass: {state.masses.clotVegMass}</div>
                </div>

                {/* Final Impression Box */}
                <div className="font-bold text-primary mb-1 text-[11px]">FINAL CLINICAL IMPRESSION</div>
                <div className="p-3 border border-blue-200 bg-blue-50 rounded text-[10px] leading-relaxed font-bold text-gray-900 mb-4">
                  {state.finalImpression || "Normal adult transthoracic echocardiogram."}
                </div>

                {/* Advice */}
                {state.advice && (
                  <div className="text-[10px] mb-6">
                    <strong>Advice / Clinical Recommendation:</strong> {state.advice}
                  </div>
                )}

                {/* Footer Signature */}
                <div className="flex justify-between items-end mt-8 pt-4 border-t border-gray-200">
                  <div className="text-[9px] text-gray-500">
                    <div>Generated: {new Date().toLocaleString()}</div>
                    <div>Vision Heart Centre, Rewa, MP, India (IAE TTE standard layout)</div>
                  </div>
                  <div className="text-right text-[10px]">
                    <div className="w-40 border-b border-gray-400 pb-1 mb-1"></div>
                    <div className="font-bold">{state.echocardiographer}</div>
                    <div className="text-gray-500">Cardiology Specialist</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer border-t pt-3 mt-4 flex justify-end space-x-3">
              <button onClick={triggerPDF} className="btn btn-accent text-white">
                Download PDF
              </button>
              <button onClick={() => setShowPreview(false)} className="btn btn-outline">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
