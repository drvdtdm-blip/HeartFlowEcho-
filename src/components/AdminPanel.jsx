import React, { useState } from "react";

export default function AdminPanel({
  hospitalHeader,
  onChangeHeader,
  echocardiographers,
  onAddDoctor,
  onDeleteDoctor,
  onResetTemplates,
}) {
  const [newDoctor, setNewDoctor] = useState("");

  const handleHeaderChange = (key, val) => {
    onChangeHeader({
      ...hospitalHeader,
      [key]: val,
    });
  };

  const handleAddDoctorSubmit = (e) => {
    e.preventDefault();
    if (newDoctor.trim()) {
      onAddDoctor(newDoctor.trim());
      setNewDoctor("");
    }
  };

  return (
    <div className="card shadow-sm animate-fade-in">
      <div className="card-header bg-primary text-white">
        <h2 className="card-title">Administrative Settings & Header Config</h2>
      </div>
      <div className="card-body space-y-8">
        {/* Hospital details config */}
        <div>
          <h3 className="text-md font-bold text-primary border-b pb-1 mb-4">Hospital / Clinic Letterhead Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-group">
              <label className="form-label" htmlFor="hospital-name-input">Hospital / Clinic Name</label>
              <input
                type="text"
                id="hospital-name-input"
                className="form-control font-semibold"
                placeholder="e.g. Metro Heart and Vascular Institute"
                value={hospitalHeader.hospitalName || ""}
                onChange={(e) => handleHeaderChange("hospitalName", e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="dept-input">Department Name</label>
              <input
                type="text"
                id="dept-input"
                className="form-control"
                placeholder="e.g. Non-Invasive Cardiology Department"
                value={hospitalHeader.department || ""}
                onChange={(e) => handleHeaderChange("department", e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="address-input">Clinic Address</label>
              <input
                type="text"
                id="address-input"
                className="form-control"
                placeholder="e.g. Block C, Sector 62, Noida, UP"
                value={hospitalHeader.address || ""}
                onChange={(e) => handleHeaderChange("address", e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="contact-input">Contact details / Phone</label>
              <input
                type="text"
                id="contact-input"
                className="form-control"
                placeholder="e.g. +91 120 445566 | support@metrocardio.com"
                value={hospitalHeader.contact || ""}
                onChange={(e) => handleHeaderChange("contact", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Echocardiographer Management */}
        <div>
          <h3 className="text-md font-bold text-primary border-b pb-1 mb-4">Manage Echocardiographers</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Add Doctor form */}
            <div>
              <form onSubmit={handleAddDoctorSubmit} className="space-y-4">
                <div className="form-group">
                  <label className="form-label" htmlFor="new-doc-input">Add Doctor / Technician Name</label>
                  <input
                    type="text"
                    id="new-doc-input"
                    className="form-control"
                    placeholder="e.g. Dr. Ramesh Kumar, MD DM (Cardiology)"
                    value={newDoctor}
                    onChange={(e) => setNewDoctor(e.target.value)}
                  />
                  <p className="help-text mt-1 text-gray-400">Include full medical qualifications which will be printed on the signature block.</p>
                </div>
                <button type="submit" className="btn btn-primary btn-sm">
                  Add Echocardiographer
                </button>
              </form>
            </div>

            {/* List Doctor and Delete */}
            <div className="bg-gray-50 border p-4 rounded-lg">
              <h4 className="font-semibold text-sm mb-3 text-gray-700">Active Names List</h4>
              {echocardiographers.length === 0 ? (
                <p className="text-xs text-gray-400 m-0">No custom names configured. The system will fall back to defaults.</p>
              ) : (
                <ul className="divide-y m-0 p-0 list-none">
                  {echocardiographers.map((doc, idx) => (
                    <li key={idx} className="flex justify-between items-center py-2 text-sm text-gray-800">
                      <span>{doc}</span>
                      <button
                        onClick={() => onDeleteDoctor(doc)}
                        className="btn btn-danger btn-xs"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Database & Reset Controls */}
        <div>
          <h3 className="text-md font-bold text-primary border-b pb-1 mb-4">Database Operations & Reset Options</h3>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => {
                if (window.confirm("Reset all templates to system defaults? Any custom modifications might be overwritten.")) {
                  onResetTemplates();
                }
              }}
              className="btn btn-outline"
            >
              Reset Default Templates
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
