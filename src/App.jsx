import React, { useState, useEffect } from "react";
import PatientDetails from "./components/PatientDetails";
import Measurements from "./components/Measurements";
import ChamberValves from "./components/ChamberValves";
import DopplerExtra from "./components/DopplerExtra";
import ReviewExport from "./components/ReviewExport";
import ReportHistory from "./components/ReportHistory";
import AdminPanel from "./components/AdminPanel";
import Login from "./components/Login";
import { TEMPLATES, DEFAULT_REPORT_STATE } from "./utils/templates";
import { generateAutoImpression } from "./utils/echoCalculations";
import { Heart, User, ClipboardList, Database, Sliders, CheckSquare, Stethoscope, ChevronRight, LogOut } from "lucide-react";
import "./App.css";

const DEFAULT_DOCTORS = [
  "Dr V D Tripathi, DM Cardiology",
  "Consultant Cardiologist",
  "Senior Resident",
  "Echo Technician"
];

const DEFAULT_HEADER = {
  hospitalName: "Vision Heart Centre",
  department: "Comprehensive Echocardiography Lab",
  address: "Rewa, MP, India",
  contact: "Tel: +91 Lab Office"
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem("echo_authenticated") === "true";
  });
  const [activeTab, setActiveTab] = useState("patient");
  const [reportState, setReportState] = useState(() => {
    const saved = localStorage.getItem("active_echo_report");
    return saved ? JSON.parse(saved) : DEFAULT_REPORT_STATE;
  });

  const [reportsList, setReportsList] = useState(() => {
    const saved = localStorage.getItem("saved_echo_reports");
    return saved ? JSON.parse(saved) : [];
  });

  const [doctors, setDoctors] = useState(() => {
    const saved = localStorage.getItem("echo_doctors");
    return saved ? JSON.parse(saved) : DEFAULT_DOCTORS;
  });

  const [hospitalHeader, setHospitalHeader] = useState(() => {
    const saved = localStorage.getItem("echo_hospital_header");
    return saved ? JSON.parse(saved) : DEFAULT_HEADER;
  });

  // Keep state synced to local storage
  useEffect(() => {
    localStorage.setItem("active_echo_report", JSON.stringify(reportState));
  }, [reportState]);

  useEffect(() => {
    localStorage.setItem("saved_echo_reports", JSON.stringify(reportsList));
  }, [reportsList]);

  useEffect(() => {
    localStorage.setItem("echo_doctors", JSON.stringify(doctors));
  }, [doctors]);

  useEffect(() => {
    localStorage.setItem("echo_hospital_header", JSON.stringify(hospitalHeader));
  }, [hospitalHeader]);

  // Handle nested changes from subcomponents
  const handleStateChange = (section, value) => {
    setReportState((prev) => {
      const newState = {
        ...prev,
        [section]: value,
      };

      // Automatically generate impression if not manually updated by the user
      // or if it was empty.
      // We also update the impression if they select a template, but inside templates it's already specified.
      return newState;
    });
  };

  const handleFieldChange = (key, val) => {
    setReportState((prev) => ({
      ...prev,
      [key]: val,
    }));
  };

  // One-click templates loading
  const handleLoadTemplate = (templateKey) => {
    const template = TEMPLATES[templateKey];
    if (template) {
      setReportState((prev) => ({
        ...prev,
        ...template.data,
        patient: {
          ...prev.patient,
          indication: template.data.patient?.indication || prev.patient.indication,
        },
      }));
      // Keep patient details intact but update indications/measurements/valves
    }
  };

  // Save report to browser storage
  const handleSaveReport = () => {
    if (!reportState.patient.name || !reportState.patient.uhid) {
      alert("Please enter Patient Name and UHID/Registration Number before saving.");
      setActiveTab("patient");
      return;
    }

    const uniqueId = reportState.id || `report_${Date.now()}`;
    const reportToSave = {
      ...reportState,
      id: uniqueId,
      updatedAt: new Date().toISOString(),
    };

    setReportsList((prev) => {
      const exists = prev.findIndex((r) => r.id === uniqueId);
      if (exists !== -1) {
        const list = [...prev];
        list[exists] = reportToSave;
        return list;
      }
      return [reportToSave, ...prev];
    });

    // Update current active report with its new id if it was fresh
    setReportState((prev) => ({
      ...prev,
      id: uniqueId,
    }));

    alert("Report saved successfully in local database!");
  };

  // New blank report
  const handleNewReport = () => {
    if (window.confirm("Start a new report? Unsaved changes in the current report will be lost.")) {
      setReportState({
        ...DEFAULT_REPORT_STATE,
        patient: {
          ...DEFAULT_REPORT_STATE.patient,
          date: new Date().toISOString().substring(0, 10), // reset to today
        },
      });
      setActiveTab("patient");
    }
  };

  // Load a report from history to editor
  const handleLoadReportFromHistory = (report) => {
    setReportState(report);
    setActiveTab("patient");
    alert(`Loaded report for ${report.patient.name}`);
  };

  // Duplicate report for serial follow-up
  const handleDuplicateReport = (report) => {
    setReportState({
      ...report,
      id: null, // Clear id to make it a new report
      patient: {
        ...report.patient,
        date: new Date().toISOString().substring(0, 10), // Update date to today
      },
    });
    setActiveTab("patient");
    alert(`Duplicated details of ${report.patient.name} for a new follow-up evaluation today.`);
  };

  // Delete report
  const handleDeleteReport = (id) => {
    setReportsList((prev) => prev.filter((r) => r.id !== id));
  };

  // Import JSON backup
  const handleImportBackup = (importedArray) => {
    setReportsList((prev) => {
      const combined = [...importedArray, ...prev];
      // remove duplicates by ID
      const seen = new Set();
      return combined.filter((item) => {
        const duplicate = seen.has(item.id);
        seen.add(item.id);
        return !duplicate;
      });
    });
  };

  // Admin Doctor updates
  const handleAddDoctor = (docName) => {
    setDoctors((prev) => [...prev, docName]);
  };

  const handleDeleteDoctor = (docName) => {
    setDoctors((prev) => prev.filter((d) => d !== docName));
  };

  const handleResetTemplates = () => {
    // Clear and restore templates to baseline
    alert("Templates reset to standard baseline.");
  };

  if (!isAuthenticated) {
    return <Login onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="app-container">
      {/* Top hospital header */}
      <header className="app-header shadow-sm">
        <div className="header-brand">
          <div className="brand-logo bg-primary">
            <Heart className="text-white fill-white animate-pulse" size={20} />
          </div>
          <div>
            <h1 className="brand-name">Vision Heart Centre</h1>
            <p className="brand-tagline">Rewa, MP, India | Transthoracic Echocardiography Reporting Lab</p>
          </div>
        </div>

        {/* Quick Toolbar */}
        <div className="header-actions">
          {/* Active Echocardiographer Selector */}
          <div className="quick-select">
            <Stethoscope size={16} className="text-gray-400" />
            <select
              value={reportState.echocardiographer}
              onChange={(e) => handleFieldChange("echocardiographer", e.target.value)}
              className="quick-select-dropdown"
            >
              {doctors.map((doc, idx) => (
                <option key={idx} value={doc}>
                  {doc}
                </option>
              ))}
            </select>
          </div>

          <button onClick={handleNewReport} className="btn btn-outline btn-sm">
            New Report
          </button>

          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to log out and lock the application?")) {
                sessionStorage.removeItem("echo_authenticated");
                setIsAuthenticated(false);
              }
            }}
            className="header-logout-btn"
            title="Logout and lock portal"
          >
            <LogOut size={14} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Content Workspace */}
      <main className="app-main">
        {/* Sidebar Template Loader */}
        <aside className="app-sidebar">
          <div className="sidebar-section">
            <h3 className="sidebar-title flex items-center gap-2">
              <ClipboardList size={16} className="text-primary" />
              <span>One-Click Templates</span>
            </h3>
            <p className="sidebar-subtitle">Selecting a template auto-populates clinical metrics & impressions.</p>
            <div className="template-grid">
              {Object.keys(TEMPLATES).map((tKey) => (
                <button
                  key={tKey}
                  onClick={() => handleLoadTemplate(tKey)}
                  className="template-btn"
                >
                  <span className="template-btn-text">{TEMPLATES[tKey].name}</span>
                  <ChevronRight size={14} className="template-btn-icon" />
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Tab content area */}
        <section className="app-content">
          {/* Tab Navigation */}
          <nav className="tab-navigation">
            {[
              { id: "patient", label: "Demographics", icon: User },
              { id: "measurements", label: "Measurements", icon: CheckSquare },
              { id: "chambers", label: "Chambers & Valves", icon: Heart },
              { id: "doppler", label: "Doppler & Extra", icon: ClipboardList },
              { id: "review", label: "Review & Export", icon: Sliders },
              { id: "history", label: "Saved Reports", icon: Database },
              { id: "admin", label: "Admin Settings", icon: Sliders },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`tab-link ${activeTab === tab.id ? "active" : ""}`}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Form Tabs Panels */}
          <div className="tab-panel-container">
            {activeTab === "patient" && (
              <PatientDetails state={reportState} onChange={handleStateChange} />
            )}
            
            {activeTab === "measurements" && (
              <Measurements state={reportState} onChange={handleStateChange} />
            )}

            {activeTab === "chambers" && (
              <ChamberValves state={reportState} onChange={handleStateChange} />
            )}

            {activeTab === "doppler" && (
              <DopplerExtra state={reportState} onChange={handleStateChange} />
            )}

            {activeTab === "review" && (
              <ReviewExport
                state={reportState}
                onChange={handleFieldChange}
                onSaveReport={handleSaveReport}
                hospitalHeader={hospitalHeader}
              />
            )}

            {activeTab === "history" && (
              <ReportHistory
                reports={reportsList}
                onLoadReport={handleLoadReportFromHistory}
                onDuplicateReport={handleDuplicateReport}
                onDeleteReport={handleDeleteReport}
                onImportBackup={handleImportBackup}
              />
            )}

            {activeTab === "admin" && (
              <AdminPanel
                hospitalHeader={hospitalHeader}
                onChangeHeader={setHospitalHeader}
                echocardiographers={doctors}
                onAddDoctor={handleAddDoctor}
                onDeleteDoctor={handleDeleteDoctor}
                onResetTemplates={handleResetTemplates}
              />
            )}
          </div>
        </section>
      </main>

      {/* Hospital Footer Disclaimer */}
      <footer className="app-footer">
        <p className="m-0">
          <strong>Disclaimer:</strong> This application is a clinical decision support tool under testing. Output reports must be verified by a cardiologist before signing. &copy; {new Date().getFullYear()} Vision Heart Centre, Rewa
        </p>
      </footer>
    </div>
  );
}
