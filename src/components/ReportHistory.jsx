import React, { useState } from "react";

export default function ReportHistory({ reports, onLoadReport, onDuplicateReport, onDeleteReport, onImportBackup }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchUhid, setSearchUhid] = useState("");
  const [searchDate, setSearchDate] = useState("");

  // Filter reports
  const filteredReports = reports.filter((r) => {
    const nameMatch = r.patient.name.toLowerCase().includes(searchTerm.toLowerCase());
    const uhidMatch = r.patient.uhid.toLowerCase().includes(searchUhid.toLowerCase());
    const dateMatch = searchDate ? r.patient.date === searchDate : true;
    return nameMatch && uhidMatch && dateMatch;
  });

  const triggerExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reports, null, 2));
    const dlAnchor = document.createElement("a");
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `echo_reports_backup_${new Date().toISOString().substring(0, 10)}.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
  };

  const handleFileImport = (e) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target.result);
          if (Array.isArray(parsed)) {
            onImportBackup(parsed);
            alert("Backup imported successfully!");
          } else {
            alert("Invalid backup format. Expected a JSON array of reports.");
          }
        } catch (err) {
          alert("Error reading file: " + err.message);
        }
      };
    }
  };

  return (
    <div className="card shadow-sm animate-fade-in">
      <div className="card-header bg-primary text-white flex flex-wrap justify-between items-center gap-4">
        <h2 className="card-title">Saved Reports Database ({filteredReports.length})</h2>
        <div className="flex gap-3">
          <button onClick={triggerExport} className="btn btn-outline btn-sm text-white border-white hover:bg-white hover:text-primary">
            Export JSON Backup
          </button>
          <label className="btn btn-accent btn-sm text-white cursor-pointer m-0">
            Import Backup
            <input
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleFileImport}
            />
          </label>
        </div>
      </div>

      <div className="card-body space-y-6">
        {/* Search Bar Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg border">
          <div className="form-group">
            <label className="form-label font-bold text-xs uppercase text-gray-500" htmlFor="search-name">Search Name</label>
            <input
              type="text"
              id="search-name"
              className="form-control"
              placeholder="Patient Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label font-bold text-xs uppercase text-gray-500" htmlFor="search-uhid">Search UHID / Registration</label>
            <input
              type="text"
              id="search-uhid"
              className="form-control"
              placeholder="UHID..."
              value={searchUhid}
              onChange={(e) => setSearchUhid(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label font-bold text-xs uppercase text-gray-500" htmlFor="search-date">Filter Date</label>
            <input
              type="date"
              id="search-date"
              className="form-control"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
            />
          </div>
        </div>

        {/* Reports Table/Grid */}
        {filteredReports.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="m-0 text-sm font-semibold">No echo reports found matching the criteria.</p>
            <p className="m-0 text-xs">Create a new report in the other tabs and click Save Report.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Patient Name</th>
                  <th>UHID</th>
                  <th>Age/Sex</th>
                  <th>Exam Date</th>
                  <th>Indication</th>
                  <th>Ejection Fraction (EF)</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                    <td className="font-bold text-gray-900">{report.patient.name}</td>
                    <td><span className="badge bg-primary-light text-primary font-semibold">{report.patient.uhid}</span></td>
                    <td>{report.patient.age} Y / {report.patient.sex}</td>
                    <td>{report.patient.date}</td>
                    <td>{report.patient.indication}</td>
                    <td>
                      <span className="font-semibold text-primary">
                        {report.measurements.ef ? `${report.measurements.ef}%` : "N/A"}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          onClick={() => onLoadReport(report)}
                          className="btn btn-outline btn-xs"
                        >
                          Load
                        </button>
                        <button
                          onClick={() => onDuplicateReport(report)}
                          className="btn btn-secondary btn-xs"
                          title="Duplicate details to create a new follow-up report for today"
                        >
                          Follow-up
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete report for ${report.patient.name}?`)) {
                              onDeleteReport(report.id);
                            }
                          }}
                          className="btn btn-danger btn-xs"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
