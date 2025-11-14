import React from "react";

/**
 * Medical Web App — Landing Page (React)
 * - Logo top-left
 * - Primary CTA: "Patient Form" (for wound info)
 * - Sticky header, features, and an About section at bottom
 * - Smooth scroll for in-page anchors
 *
 * Usage:
 *   import LandingPage from "./LandingPage";
 *   export default function App(){ return <LandingPage /> }

 */

const logoSrc = "/logo.png"; 

export default function LandingPage() {
  return (
    <div style={styles.page}>
      {/* Global smooth scroll & animations */}
      <style>{`
        html{scroll-behavior:smooth}
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .logo-fade { 
          animation: fadeIn 1.5s ease-in-out;
        }
      `}</style>

      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div style={styles.brand}>
            <img
              src={logoSrc}
              alt="SafeTriage Logo"
              style={styles.logo}
              className="logo-fade"
              onError={(e) => {
                // hide broken image if logo not found; keep brand text visible
                try { e.currentTarget.style.display = "none"; } catch (err) {}
              }}
            />
            <span style={styles.brandText}>SafeTriage</span>
          </div>
          <nav style={styles.nav} aria-label="Main">
            <a href="#features" style={styles.navLink}>Features</a>
            <a href="#about" style={styles.navLink}>About</a>
            <a href="/patient-form" style={{...styles.navLink, ...styles.primaryLink}}>Patient Form</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section style={styles.hero}>
        <div style={styles.heroInner}>
          <h1 style={styles.h1}>Faster Wound Intake, Better Care</h1>
          <p style={styles.lead}>
            Patients can start a secure intake form to describe their wound, upload photos, and share history.
          </p>
          <div>
            <a href="/patient-form" style={styles.ctaBtn} aria-label="Open the patient intake form">
              Patient Form
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" style={styles.section}>
        <div style={styles.sectionInner}>
          <h2 style={styles.h2}>Why SafeTriage</h2>
          <ul style={styles.featureGrid}>
            <li style={styles.featureCard}>
              <h3 style={styles.h3}>Built for Care & Private</h3>
              <p>We use minimal info to connect you to the right wound care resources.</p>
            </li>
            <li style={styles.featureCard}>
              <h3 style={styles.h3}>Photo Uploads with AI</h3>
              <p>Uploaded images are analyzed with AI to assist triage — and can be reviewed later by your care team.</p>
            </li>
            <li style={styles.featureCard}>
              <h3 style={styles.h3}>Chatbot</h3>
              <p> Chatbot helps you describe symptoms naturally.</p>
            </li>
            <li style={styles.featureCard}>
              <h3 style={styles.h3}>Real-time Status</h3>
              <p>Automated notifications to keep patients informed every step.</p>
            </li>
          </ul>
        </div>
      </section>

      {/* About (bottom) */}
      <section id="about" style={{...styles.section, ...styles.about}}>
        <div style={styles.sectionInner}>
          <h2 style={styles.h2}>About</h2>
          <p>
            SafeTriage is a lightweight intake experience built for clinics and ER front desks.
            It streamlines the process of gathering patient information and sharing it with the care team.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.sectionInner}>
          <small>© {new Date().getFullYear()} SafeTriage. All rights reserved.</small>
        </div>
      </footer>
    </div>
  );
}

// ---------------- Styles ----------------
const styles = {
  page: {
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
    color: "#0f172a",
    background: "linear-gradient(135deg, #05b197ff 0%, #16bbdcff 50%, #1db854 100%)",
    lineHeight: 1.5,
  },
  header: {
    position: "sticky",
    top: 0,
    zIndex: 20,
    background: "rgba(255,255,255,0.9)",
    backdropFilter: "blur(8px)",
    borderBottom: "1px solid #e2e8f0",
  },
  headerInner: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "12px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brand: { display: "flex", alignItems: "center", gap: 10 },
  logo: { height: 46, width: 46, objectFit: "contain" },
  brandText: { fontWeight: 700, fontSize: 18 },
  nav: { display: "flex", gap: 14, alignItems: "center" },
  navLink: {
    textDecoration: "none",
    color: "#0f172a",
    padding: "8px 10px",
    borderRadius: 8,
    fontSize: 14,
  },
  primaryLink: {
    background: "#16c188ff",
    color: "white",
  },
  hero: {
    background: "linear-gradient(180deg,#f0f9ff,#fff)",
    borderBottom: "1px solid #5de2ebff",
  },
  heroInner: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "72px 20px",
    display: "grid",
    gap: 16,
    justifyItems: "start",
  },
  h1: { fontSize: 44, lineHeight: 1.1, margin: 0 },
  lead: { maxWidth: 720, margin: 0, fontSize: 18, color: "#334155" },
  ctaBtn: {
    display: "inline-block",
    padding: "12px 18px",
    background: "#48df98ff",
    color: "white",
    borderRadius: 10,
    textDecoration: "none",
    fontWeight: 600,
    boxShadow: "0 6px 18px rgba(14,165,233,0.25)",
  },
  section: { padding: "56px 0" },
  sectionInner: { maxWidth: 1100, margin: "0 auto", padding: "0 20px" },
  h2: { fontSize: 28, margin: "0 0 12px 0" },
  h3: { fontSize: 18, margin: "8px 0" },
  featureGrid: {
    listStyle: "none",
    margin: 0,
    padding: 0,
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 16,
  },
  featureCard: {
    border: "1px solid #adc6e8ff",
    borderRadius: 12,
    padding: 16,
    background: "white",
  },
  about: { background: "#b8d1e9ff", borderTop: "1px solid #e2e8f0" },
  footer: {
    borderTop: "1px solid #e2e8f0",
    background: "white",
    padding: "18px 0",
  },
};




