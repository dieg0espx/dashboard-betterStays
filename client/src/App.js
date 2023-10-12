import logo from "./logo.svg";
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useActionData,
} from "react-router-dom";
import Home from "./pages/Home";
import CalendarPage from "./pages/CalendarPage";
import DocumentsPage from "./pages/DocumentsPage";
import Document from "./pages/Document";
import CustomersPage from "./pages/CustomersPage";
import Sheet1 from "./pages/Sheet1";
import Support from "./pages/Support";
import Invoice from "./pages/Invoice";
import MensagesPage from "./pages/MensagesPage";
import Login from "./pages/Login";
import PropertiesPage from "./pages/PropertiesPage";
import SheetInvoice from "./pages/SheetInvoice";
import ProtectedRoutes from "./ProtectedRoutes";
import React, { useState } from "react";
import Overview from "./pages/Overview";

function App() {
  return (
    <div className="App">
    
        <Router>
          <Routes>
            <Route path="/" element={<ProtectedRoutes />}>
              <Route index element={<Overview />} />
              <Route path="/overview" element={<Overview />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/documents" element={<DocumentsPage />} />
              <Route path="/document" element={<Document />} />
              <Route path="/customers" element={<CustomersPage />} />
              <Route path="/sheet1" element={<Sheet1 />} />
              <Route path="/support" element={<Support />} />
              <Route path="/invoice" element={<Invoice />} />
              <Route path="/messages" element={<MensagesPage />} />
              <Route path="/properties" element={<PropertiesPage />} />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/document" element={<Document />} />
          </Routes>
        </Router>
      
    </div>
  );
}

export default App;
