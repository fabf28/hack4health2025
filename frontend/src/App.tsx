import './App.css'
import LandingPage from './pages/LandingPage';
import PatientForm from "./pages/PatientForm";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";


function App() {

  return (
    <>
      <Router>
        <nav>
          <Link to="/">LandingPage</Link> |{" "}
          <Link to="/about">PatientForm</Link>
        </nav>

        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/patient" element={<PatientForm />} />
        </Routes>
      </Router>


    </>
  )
}

export default App;
