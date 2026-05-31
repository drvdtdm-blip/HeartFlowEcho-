import React, { useEffect } from "react";
import { NORMAL_RANGES, calculateFS, calculateLVMass, interpretEF } from "../utils/echoCalculations";

export default function Measurements({ state, onChange }) {
  const handleValChange = (key, val) => {
    const updated = {
      ...state.measurements,
      [key]: val,
    };

    // Calculate FS% if LVIDd and LVIDs are modified
    if (key === "lvidd" || key === "lvids") {
      const fsCalc = calculateFS(updated.lvidd, updated.lvids);
      if (fsCalc !== "") {
        updated.fs = fsCalc.toString();
      }
    }

    // Calculate LV Mass if IVSd, LVIDd, or LVPWd are modified
    if (key === "lvidd" || key === "ivsd" || key === "lvpwd") {
      const massCalc = calculateLVMass(updated.lvidd, updated.ivsd, updated.lvpwd);
      if (massCalc !== "") {
        updated.lvMass = massCalc.toString();
      }
    }

    onChange("measurements", updated);
  };

  // Check if a measurement value is out of range
  const isOutOfRange = (key, valueStr) => {
    const val = parseFloat(valueStr);
    if (isNaN(val)) return false;
    const range = NORMAL_RANGES[key];
    if (!range) return false;

    if (range.min !== undefined && val < range.min) return true;
    if (range.max !== undefined && val > range.max) return true;
    return false;
  };

  return (
    <div className="card shadow-sm animate-fade-in">
      <div className="card-header bg-primary text-white flex justify-between items-center">
        <h2 className="card-title">Echocardiographic Measurements</h2>
        <span className="badge bg-white-opacity text-white text-xs">Range Guided</span>
      </div>
      <div className="card-body">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* M-Mode & 2D LV Dimensions */}
          <div className="col-span-full border-b pb-2 mb-2">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              LV Chamber Dimensions (M-Mode/2D)
            </h3>
          </div>

          {[
            { key: "ivsd", label: "IVSd", placeholder: "e.g. 9" },
            { key: "lvidd", label: "LVIDd", placeholder: "e.g. 45" },
            { key: "lvids", label: "LVIDs", placeholder: "e.g. 30" },
            { key: "lvpwd", label: "LVPWd", placeholder: "e.g. 9" },
          ].map(({ key, label, placeholder }) => {
            const outRange = isOutOfRange(key, state.measurements[key]);
            return (
              <div className="form-group" key={key}>
                <label className="form-label font-semibold flex justify-between" htmlFor={`meas-${key}`}>
                  <span>{label}</span>
                  <span className="text-xs text-gray-400 font-normal">{NORMAL_RANGES[key].hint}</span>
                </label>
                <div className="input-group">
                  <input
                    type="number"
                    step="any"
                    id={`meas-${key}`}
                    className={`form-control ${outRange ? "input-warning" : ""}`}
                    placeholder={placeholder}
                    value={state.measurements[key]}
                    onChange={(e) => handleValChange(key, e.target.value)}
                  />
                  <span className="input-group-text">{NORMAL_RANGES[key].unit}</span>
                </div>
              </div>
            );
          })}

          {/* Computed Parameters */}
          <div className="col-span-full border-b pb-2 mb-2 pt-2">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Computed & LV Function Metrics
            </h3>
          </div>

          {/* EF % */}
          <div className="form-group">
            <label className="form-label font-semibold flex justify-between" htmlFor="meas-ef">
              <span>EF % (LVEF)</span>
              <span className="text-xs text-gray-400 font-normal">{NORMAL_RANGES.ef.hint}</span>
            </label>
            <div className="input-group">
              <input
                type="number"
                step="any"
                id="meas-ef"
                className={`form-control ${isOutOfRange("ef", state.measurements.ef) ? "input-warning" : ""}`}
                placeholder="e.g. 60"
                value={state.measurements.ef}
                onChange={(e) => handleValChange("ef", e.target.value)}
              />
              <span className="input-group-text">%</span>
            </div>
            {state.measurements.ef && (
              <p className="help-text text-primary font-medium mt-1">
                Interpretation: {interpretEF(state.measurements.ef)}
              </p>
            )}
          </div>

          {/* FS % */}
          <div className="form-group">
            <label className="form-label font-semibold flex justify-between" htmlFor="meas-fs">
              <span>FS %</span>
              <span className="text-xs text-gray-400 font-normal">{NORMAL_RANGES.fs.hint}</span>
            </label>
            <div className="input-group">
              <input
                type="number"
                step="any"
                id="meas-fs"
                className={`form-control ${isOutOfRange("fs", state.measurements.fs) ? "input-warning" : ""}`}
                placeholder="Auto calculated"
                value={state.measurements.fs}
                onChange={(e) => handleValChange("fs", e.target.value)}
              />
              <span className="input-group-text">%</span>
            </div>
            <p className="help-text text-gray-400 mt-1">Auto-computed from LVIDd/s</p>
          </div>

          {/* LV Mass */}
          <div className="form-group">
            <label className="form-label font-semibold flex justify-between" htmlFor="meas-lvMass">
              <span>LV Mass</span>
              <span className="text-xs text-gray-400 font-normal">Normal: &lt;224g</span>
            </label>
            <div className="input-group">
              <input
                type="number"
                step="any"
                id="meas-lvMass"
                className="form-control"
                placeholder="Auto calculated"
                value={state.measurements.lvMass}
                onChange={(e) => handleValChange("lvMass", e.target.value)}
              />
              <span className="input-group-text">g</span>
            </div>
            <p className="help-text text-gray-400 mt-1">Devereux Formula (Auto)</p>
          </div>

          {/* LA Size & Aorta */}
          <div className="col-span-full border-b pb-2 mb-2 pt-2">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Aorta, LA, RV, and Right-sided Metrics
            </h3>
          </div>

          {[
            { key: "laSize", label: "LA Size", placeholder: "e.g. 34" },
            { key: "aorticRoot", label: "Aortic Root", placeholder: "e.g. 32" },
            { key: "tapse", label: "TAPSE", placeholder: "e.g. 20" },
            { key: "rvspPasp", label: "RVSP / PASP", placeholder: "e.g. 28" },
            { key: "trVelocity", label: "TR Velocity", placeholder: "e.g. 2.5" },
            { key: "ivcDiameter", label: "IVC Diameter", placeholder: "e.g. 18" },
          ].map(({ key, label, placeholder }) => {
            const outRange = isOutOfRange(key, state.measurements[key]);
            return (
              <div className="form-group" key={key}>
                <label className="form-label font-semibold flex justify-between" htmlFor={`meas-${key}`}>
                  <span>{label}</span>
                  <span className="text-xs text-gray-400 font-normal">{NORMAL_RANGES[key].hint}</span>
                </label>
                <div className="input-group">
                  <input
                    type="number"
                    step="any"
                    id={`meas-${key}`}
                    className={`form-control ${outRange ? "input-warning" : ""}`}
                    placeholder={placeholder}
                    value={state.measurements[key]}
                    onChange={(e) => handleValChange(key, e.target.value)}
                  />
                  <span className="input-group-text">{NORMAL_RANGES[key].unit}</span>
                </div>
              </div>
            );
          })}

          {/* Diastolic & Doppler Parameters */}
          <div className="col-span-full border-b pb-2 mb-2 pt-2">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Transmitral Doppler & Gradients
            </h3>
          </div>

          {[
            { key: "eaRatio", label: "E/A Ratio", placeholder: "e.g. 1.2" },
            { key: "eePrime", label: "E/e' Ratio", placeholder: "e.g. 8" },
            { key: "decelTime", label: "Decel Time", placeholder: "e.g. 190" },
            { key: "lvotVti", label: "LVOT VTI", placeholder: "e.g. 20" },
            { key: "avPeakGradient", label: "AV Peak Gradient", placeholder: "e.g. 6" },
            { key: "avMeanGradient", label: "AV Mean Gradient", placeholder: "e.g. 3" },
            { key: "mvGradient", label: "MV Mean Gradient (if MS)", placeholder: "e.g. 8" },
          ].map(({ key, label, placeholder }) => {
            const outRange = isOutOfRange(key, state.measurements[key]);
            return (
              <div className="form-group" key={key}>
                <label className="form-label font-semibold flex justify-between" htmlFor={`meas-${key}`}>
                  <span>{label}</span>
                  <span className="text-xs text-gray-400 font-normal">{NORMAL_RANGES[key].hint}</span>
                </label>
                <div className="input-group">
                  <input
                    type="number"
                    step="any"
                    id={`meas-${key}`}
                    className={`form-control ${outRange ? "input-warning" : ""}`}
                    placeholder={placeholder}
                    value={state.measurements[key]}
                    onChange={(e) => handleValChange(key, e.target.value)}
                  />
                  <span className="input-group-text">{NORMAL_RANGES[key].unit}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
