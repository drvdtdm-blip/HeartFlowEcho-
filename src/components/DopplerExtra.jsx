import React from "react";

export default function DopplerExtra({ state, onChange }) {
  const handleDopplerChange = (key, val) => {
    onChange("doppler", { ...state.doppler, [key]: val });
  };

  const handlePericardiumChange = (key, val) => {
    onChange("pericardium", { ...state.pericardium, [key]: val });
  };

  const handleAortaChange = (key, val) => {
    onChange("aorta", { ...state.aorta, [key]: val });
  };

  const handleMassesChange = (key, val) => {
    onChange("masses", { ...state.masses, [key]: val });
  };

  // Helper to also update the PASP inside measurements if changed here
  const handlePaspNumberChange = (val) => {
    onChange("measurements", {
      ...state.measurements,
      rvspPasp: val,
    });
  };

  return (
    <div className="card shadow-sm animate-fade-in">
      <div className="card-header bg-primary text-white">
        <h2 className="card-title">Doppler Pressures & Extracardiac Assessment</h2>
      </div>
      <div className="card-body">
        <div className="space-y-6">
          {/* Pulmonary Pressures & IVC */}
          <div>
            <h3 className="text-md font-bold text-primary border-b pb-1 mb-4">Pulmonary Pressure & Doppler</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="form-group">
                <label className="form-label" htmlFor="tr-jet">TR Jet Status</label>
                <select
                  id="tr-jet"
                  className="form-control"
                  value={state.doppler.trJet}
                  onChange={(e) => handleDopplerChange("trJet", e.target.value)}
                >
                  <option value="Absent">Absent</option>
                  <option value="Present">Present</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="pasp-num">Estimated RVSP / PASP (mmHg)</label>
                <div className="input-group">
                  <input
                    type="number"
                    step="any"
                    id="pasp-num"
                    className="form-control"
                    placeholder="e.g. 30"
                    value={state.measurements.rvspPasp}
                    onChange={(e) => handlePaspNumberChange(e.target.value)}
                  />
                  <span className="input-group-text">mmHg</span>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="ph-severity">Pulmonary HTN Severity</label>
                <select
                  id="ph-severity"
                  className="form-control"
                  value={state.doppler.paspSeverity}
                  onChange={(e) => handleDopplerChange("paspSeverity", e.target.value)}
                >
                  <option value="Normal">Normal (&lt;35 mmHg)</option>
                  <option value="Mild PH">Mild PH (35-45 mmHg)</option>
                  <option value="Moderate PH">Moderate PH (46-59 mmHg)</option>
                  <option value="Severe PH">Severe PH (≥60 mmHg)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="ivc-collapsibility">Inferior Vena Cava (IVC)</label>
                <select
                  id="ivc-collapsibility"
                  className="form-control"
                  value={state.doppler.ivc}
                  onChange={(e) => handleDopplerChange("ivc", e.target.value)}
                >
                  <option value="Normal collapsible">Normal collapsible (&lt;2.1cm, &gt;50% collapse)</option>
                  <option value="Dilated with poor collapse">Dilated with poor collapse (&gt;2.1cm, &lt;50% collapse)</option>
                  <option value="Small collapsed">Small collapsed (hypovolemic pattern)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Pericardium & Aorta */}
          <div>
            <h3 className="text-md font-bold text-primary border-b pb-1 mb-4">Pericardium & Great Vessels</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="form-group">
                <label className="form-label" htmlFor="pericardial-effusion">Pericardial Effusion</label>
                <select
                  id="pericardial-effusion"
                  className="form-control"
                  value={state.pericardium.effusion}
                  onChange={(e) => handlePericardiumChange("effusion", e.target.value)}
                >
                  <option value="None">None</option>
                  <option value="Minimal">Minimal (fluid in systole only)</option>
                  <option value="Mild">Mild (&lt;10mm fluid space)</option>
                  <option value="Moderate">Moderate (10-20mm fluid space)</option>
                  <option value="Large">Large (&gt;20mm fluid space)</option>
                  <option value="Tamponade physiology">Tamponade Physiology (RV collapse/flow variations)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="ao-root">Aortic Root Size</label>
                <select
                  id="ao-root"
                  className="form-control"
                  value={state.aorta.root}
                  onChange={(e) => handleAortaChange("root", e.target.value)}
                >
                  <option value="Normal">Normal</option>
                  <option value="Dilated">Dilated</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="ao-ascending">Ascending Aorta Size</label>
                <select
                  id="ao-ascending"
                  className="form-control"
                  value={state.aorta.ascending}
                  onChange={(e) => handleAortaChange("ascending", e.target.value)}
                >
                  <option value="Normal">Normal</option>
                  <option value="Dilated">Dilated</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="clot-mass">Clots / Veg. / Masses</label>
                <select
                  id="clot-mass"
                  className="form-control"
                  value={state.masses.clotVegMass}
                  onChange={(e) => handleMassesChange("clotVegMass", e.target.value)}
                >
                  <option value="Absent">Absent</option>
                  <option value="Present">Present (Describe in Advice/Impression)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
