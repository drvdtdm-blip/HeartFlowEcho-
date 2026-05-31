import React, { useState } from "react";

export default function ChamberValves({ state, onChange }) {
  const [activeSubTab, setActiveSubTab] = useState("chambers"); // "chambers" or "valves"
  const [activeValve, setActiveValve] = useState("mitral"); // "mitral", "aortic", "tricuspid", "pulmonary"

  const handleLvChange = (key, val) => {
    onChange("lv", { ...state.lv, [key]: val });
  };

  const handleRvChange = (key, val) => {
    onChange("rv", { ...state.rv, [key]: val });
  };

  const handleLaRaChange = (key, val) => {
    onChange("laRa", { ...state.laRa, [key]: val });
  };

  const handleValveChange = (valveKey, field, val) => {
    onChange("valves", {
      ...state.valves,
      [valveKey]: {
        ...state.valves[valveKey],
        [field]: val,
      },
    });
  };

  return (
    <div className="card shadow-sm animate-fade-in">
      <div className="card-header bg-primary text-white pb-0">
        <h2 className="card-title mb-2">Chamber Assessment & Valvular Morphology</h2>
        {/* Sub-tab navigation */}
        <div className="flex space-x-1 mt-2">
          <button
            onClick={() => setActiveSubTab("chambers")}
            className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors ${
              activeSubTab === "chambers"
                ? "bg-white text-primary"
                : "bg-primary-dark text-white-opacity hover:bg-primary-light-opacity"
            }`}
          >
            Chambers & Septa
          </button>
          <button
            onClick={() => setActiveSubTab("valves")}
            className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors ${
              activeSubTab === "valves"
                ? "bg-white text-primary"
                : "bg-primary-dark text-white-opacity hover:bg-primary-light-opacity"
            }`}
          >
            Valvular Assessment
          </button>
        </div>
      </div>

      <div className="card-body">
        {activeSubTab === "chambers" ? (
          <div className="space-y-6">
            {/* LV Section */}
            <div>
              <h3 className="text-md font-bold text-primary border-b pb-1 mb-4">Left Ventricle (LV)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="form-group">
                  <label className="form-label" htmlFor="lv-size">LV Cavity Size</label>
                  <select
                    id="lv-size"
                    className="form-control"
                    value={state.lv.size}
                    onChange={(e) => handleLvChange("size", e.target.value)}
                  >
                    <option value="Normal">Normal</option>
                    <option value="Dilated">Dilated</option>
                    <option value="Small">Small</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="lv-systolic">LV Systolic Function</label>
                  <select
                    id="lv-systolic"
                    className="form-control"
                    value={state.lv.systolic}
                    onChange={(e) => handleLvChange("systolic", e.target.value)}
                  >
                    <option value="Normal">Normal</option>
                    <option value="Mild LV dysfunction">Mild LV dysfunction</option>
                    <option value="Moderate LV dysfunction">Moderate LV dysfunction</option>
                    <option value="Severe LV dysfunction">Severe LV dysfunction</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="lv-lvh">LV Hypertrophy (LVH)</label>
                  <select
                    id="lv-lvh"
                    className="form-control"
                    value={state.lv.lvh}
                    onChange={(e) => handleLvChange("lvh", e.target.value)}
                  >
                    <option value="None">None</option>
                    <option value="Concentric LVH">Concentric LVH</option>
                    <option value="Eccentric LVH">Eccentric LVH</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="lv-diastolic">LV Diastolic Function</label>
                  <select
                    id="lv-diastolic"
                    className="form-control"
                    value={state.lv.diastolic}
                    onChange={(e) => handleLvChange("diastolic", e.target.value)}
                  >
                    <option value="Normal">Normal</option>
                    <option value="Grade I">Grade I (Impaired Relaxation)</option>
                    <option value="Grade II">Grade II (Pseudonormal)</option>
                    <option value="Grade III">Grade III (Restrictive)</option>
                    <option value="Indeterminate">Indeterminate</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="lv-rwma">Regional Wall Motion (RWMA)</label>
                  <select
                    id="lv-rwma"
                    className="form-control"
                    value={state.lv.rwma}
                    onChange={(e) => handleLvChange("rwma", e.target.value)}
                  >
                    <option value="Absent">Absent</option>
                    <option value="Present">Present</option>
                  </select>
                </div>

                {state.lv.rwma === "Present" && (
                  <div className="form-group animate-slide-down">
                    <label className="form-label" htmlFor="lv-rwma-territory">RWMA Territory</label>
                    <select
                      id="lv-rwma-territory"
                      className="form-control"
                      value={state.lv.rwmaTerritory}
                      onChange={(e) => handleLvChange("rwmaTerritory", e.target.value)}
                    >
                      <option value="None">-- Select Territory --</option>
                      <option value="LAD">LAD (Anterior/Anteroseptal/Apical)</option>
                      <option value="LCX">LCX (Lateral/Posterior)</option>
                      <option value="RCA">RCA (Inferior/Inferoseptal)</option>
                      <option value="Global hypokinesia">Global hypokinesia</option>
                      <option value="Other">Other Territory</option>
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* RV & Atria & Septum Section */}
            <div>
              <h3 className="text-md font-bold text-primary border-b pb-1 mb-4">Right Ventricle & Atria & Septa</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="form-group">
                  <label className="form-label" htmlFor="rv-size">RV Cavity Size</label>
                  <select
                    id="rv-size"
                    className="form-control"
                    value={state.rv.size}
                    onChange={(e) => handleRvChange("size", e.target.value)}
                  >
                    <option value="Normal">Normal</option>
                    <option value="Dilated">Dilated</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="rv-function">RV Systolic Function</label>
                  <select
                    id="rv-function"
                    className="form-control"
                    value={state.rv.function}
                    onChange={(e) => handleRvChange("function", e.target.value)}
                  >
                    <option value="Normal">Normal</option>
                    <option value="Mildly reduced">Mildly reduced</option>
                    <option value="Moderately reduced">Moderately reduced</option>
                    <option value="Severely reduced">Severely reduced</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="la-size">LA Chamber Size</label>
                  <select
                    id="la-size"
                    className="form-control"
                    value={state.laRa.laSize}
                    onChange={(e) => handleLaRaChange("laSize", e.target.value)}
                  >
                    <option value="Normal">Normal</option>
                    <option value="Mildly dilated">Mildly dilated</option>
                    <option value="Moderately dilated">Moderately dilated</option>
                    <option value="Severely dilated">Severely dilated</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="ra-size">RA Chamber Size</label>
                  <select
                    id="ra-size"
                    className="form-control"
                    value={state.laRa.raSize}
                    onChange={(e) => handleLaRaChange("raSize", e.target.value)}
                  >
                    <option value="Normal">Normal</option>
                    <option value="Dilated">Dilated</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="ias-status">Interatrial Septum (IAS)</label>
                  <select
                    id="ias-status"
                    className="form-control"
                    value={state.ias}
                    onChange={(e) => onChange("ias", e.target.value)}
                  >
                    <option value="Intact">Intact</option>
                    <option value="ASD suspected">ASD suspected</option>
                    <option value="PFO suspected">PFO suspected</option>
                    <option value="Aneurysmal IAS">Aneurysmal IAS</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Valve Mini Tabs */}
            <div className="flex border-b border-gray-200">
              {["mitral", "aortic", "tricuspid", "pulmonary"].map((vKey) => (
                <button
                  key={vKey}
                  onClick={() => setActiveValve(vKey)}
                  className={`flex-1 py-3 text-center text-sm font-semibold border-b-2 transition-all ${
                    activeValve === vKey
                      ? "border-primary text-primary bg-primary-light"
                      : "border-transparent text-gray-500 hover:text-primary hover:bg-gray-50"
                  }`}
                >
                  {vKey.charAt(0).toUpperCase() + vKey.slice(1)} Valve
                </button>
              ))}
            </div>

            {/* Selected Valve Details Form */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 animate-fade-in">
              <div className="form-group">
                <label className="form-label" htmlFor={`valve-morphology-${activeValve}`}>
                  Leaflet Morphology
                </label>
                <select
                  id={`valve-morphology-${activeValve}`}
                  className="form-control"
                  value={state.valves[activeValve].morphology}
                  onChange={(e) => handleValveChange(activeValve, "morphology", e.target.value)}
                >
                  <option value="Normal">Normal</option>
                  <option value="Thickened">Thickened</option>
                  <option value="Calcified">Calcified</option>
                  <option value="Prolapse">Prolapse</option>
                  <option value="Restricted">Restricted</option>
                  <option value="Rheumatic">Rheumatic</option>
                  <option value="Degenerative">Degenerative</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor={`valve-stenosis-${activeValve}`}>
                  Stenosis Severity
                </label>
                <select
                  id={`valve-stenosis-${activeValve}`}
                  className="form-control"
                  value={state.valves[activeValve].stenosis}
                  onChange={(e) => handleValveChange(activeValve, "stenosis", e.target.value)}
                >
                  <option value="None">None</option>
                  <option value="Mild">Mild</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Severe">Severe</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor={`valve-regurgitation-${activeValve}`}>
                  Regurgitation Severity
                </label>
                <select
                  id={`valve-regurgitation-${activeValve}`}
                  className="form-control"
                  value={state.valves[activeValve].regurgitation}
                  onChange={(e) => handleValveChange(activeValve, "regurgitation", e.target.value)}
                >
                  <option value="None">None</option>
                  <option value="Trivial">Trivial</option>
                  <option value="Mild">Mild</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Severe">Severe</option>
                </select>
              </div>

              <div className="form-group col-span-full">
                <label className="form-label" htmlFor={`valve-remarks-${activeValve}`}>
                  Valve Details & Remarks (Free text)
                </label>
                <textarea
                  id={`valve-remarks-${activeValve}`}
                  className="form-control"
                  rows="3"
                  placeholder={`Describe mobility, calcification level, jet location or measurements for the ${activeValve} valve...`}
                  value={state.valves[activeValve].remarks}
                  onChange={(e) => handleValveChange(activeValve, "remarks", e.target.value)}
                ></textarea>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
