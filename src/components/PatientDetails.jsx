import React from "react";

const INDICATIONS = [
  "Chest pain",
  "Dyspnea",
  "Hypertension",
  "Diabetes",
  "CAD",
  "Post MI",
  "Post PCI",
  "Post CABG",
  "Valvular heart disease",
  "Heart failure",
  "Murmur",
  "Arrhythmia",
  "Preoperative evaluation",
  "Stroke/TIA",
  "Other"
];

export default function PatientDetails({ state, onChange }) {
  const handlePatientChange = (key, value) => {
    onChange("patient", {
      ...state.patient,
      [key]: value,
    });
  };

  return (
    <div className="card shadow-sm animate-fade-in">
      <div className="card-header bg-primary text-white">
        <h2 className="card-title">Patient Demographics & Indication</h2>
      </div>
      <div className="card-body">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Patient Name */}
          <div className="form-group">
            <label className="form-label" htmlFor="patient-name">Patient Name *</label>
            <input
              type="text"
              id="patient-name"
              className="form-control"
              placeholder="Enter full name"
              value={state.patient.name}
              onChange={(e) => handlePatientChange("name", e.target.value)}
              required
            />
          </div>

          {/* Age */}
          <div className="form-group">
            <label className="form-label" htmlFor="patient-age">Age (Years) *</label>
            <input
              type="number"
              id="patient-age"
              className="form-control"
              placeholder="e.g. 45"
              value={state.patient.age}
              onChange={(e) => handlePatientChange("age", e.target.value)}
              required
            />
          </div>

          {/* Sex */}
          <div className="form-group">
            <label className="form-label" htmlFor="patient-sex">Sex *</label>
            <select
              id="patient-sex"
              className="form-control"
              value={state.patient.sex}
              onChange={(e) => handlePatientChange("sex", e.target.value)}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* UHID */}
          <div className="form-group">
            <label className="form-label" htmlFor="patient-uhid">UHID / Registration No *</label>
            <input
              type="text"
              id="patient-uhid"
              className="form-control"
              placeholder="e.g. UHID-100293"
              value={state.patient.uhid}
              onChange={(e) => handlePatientChange("uhid", e.target.value)}
              required
            />
          </div>

          {/* Date */}
          <div className="form-group">
            <label className="form-label" htmlFor="patient-date">Examination Date *</label>
            <input
              type="date"
              id="patient-date"
              className="form-control"
              value={state.patient.date}
              onChange={(e) => handlePatientChange("date", e.target.value)}
              required
            />
          </div>

          {/* Referring Doctor */}
          <div className="form-group">
            <label className="form-label" htmlFor="patient-ref-doc">Referring Clinician</label>
            <input
              type="text"
              id="patient-ref-doc"
              className="form-control"
              placeholder="Dr. Name or Self"
              value={state.patient.referringDoctor}
              onChange={(e) => handlePatientChange("referringDoctor", e.target.value)}
            />
          </div>

          {/* OPD/IPD Toggle */}
          <div className="form-group">
            <label className="form-label">Patient Type</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="opdIpd"
                  value="OPD"
                  checked={state.patient.opdIpd === "OPD"}
                  onChange={() => handlePatientChange("opdIpd", "OPD")}
                />
                OPD
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="opdIpd"
                  value="IPD"
                  checked={state.patient.opdIpd === "IPD"}
                  onChange={() => handlePatientChange("opdIpd", "IPD")}
                />
                IPD
              </label>
            </div>
          </div>

          {/* Ward & Bed No */}
          {state.patient.opdIpd === "IPD" && (
            <div className="form-group animate-slide-down">
              <label className="form-label" htmlFor="patient-ward">Ward / Bed Number</label>
              <input
                type="text"
                id="patient-ward"
                className="form-control"
                placeholder="e.g. Ward 4B, Bed 12"
                value={state.patient.wardBed}
                onChange={(e) => handlePatientChange("wardBed", e.target.value)}
              />
            </div>
          )}

          {/* Echo Indication */}
          <div className="form-group">
            <label className="form-label" htmlFor="patient-indication">Indication for Echo</label>
            <select
              id="patient-indication"
              className="form-control"
              value={state.patient.indication}
              onChange={(e) => handlePatientChange("indication", e.target.value)}
            >
              {INDICATIONS.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </select>
          </div>

          {/* Custom Indication if 'Other' is selected */}
          {state.patient.indication === "Other" && (
            <div className="form-group animate-slide-down">
              <label className="form-label" htmlFor="patient-custom-ind">Specify Other Indication</label>
              <input
                type="text"
                id="patient-custom-ind"
                className="form-control"
                placeholder="Type indication..."
                onChange={(e) => handlePatientChange("indication_custom", e.target.value)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
