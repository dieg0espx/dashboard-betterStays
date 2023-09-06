import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes, useActionData } from "react-router-dom";
import Home from './pages/Home';
import CalendarPage from './pages/CalendarPage';
import DocumentsPage from './pages/DocumentsPage';
import Document from './pages/Document';
import CustomersPage from './pages/CustomersPage';
import Sheet1 from './pages/Sheet1';
import Support from './pages/Support';
import Invoice from './pages/Invoice';
import MensagesPage from './pages/MensagesPage';

import PropertiesPage from './pages/PropertiesPage';
import SheetInvoice from './pages/SheetInvoice';
import ProtectedRoutes from './ProtectedRoutes';

function App() {
  return (
    <div>
      <Router>
        <div className="App">
          <Routes>
            <Route element={<ProtectedRoutes />}>
              <Route path='/'  element={<CalendarPage />} />
            </Route>
          </Routes>
          <Routes>
            <Route element={<ProtectedRoutes />}>
              <Route path='/calendar'  element={<CalendarPage />} />
            </Route>
          </Routes>
          <Routes>
            <Route element={<ProtectedRoutes />}>
              <Route path='/documents'  element={<DocumentsPage />} />
            </Route>
          </Routes>
          <Routes>
            <Route element={<ProtectedRoutes />}>
              <Route path='/document'  element={<Document />} />
            </Route>
          </Routes>
          <Routes>
            <Route element={<ProtectedRoutes />}>
              <Route path='/customers'  element={<CustomersPage />} />
            </Route>
          </Routes>
          <Routes>
            <Route element={<ProtectedRoutes />}>
              <Route path='/sheet1'  element={<Sheet1 />} />
            </Route>
          </Routes>
          <Routes>
            <Route element={<ProtectedRoutes />}>
              <Route path='/support'  element={<Support />} />
            </Route>
          </Routes>
          <Routes>
            <Route element={<ProtectedRoutes />}>
              <Route path='/invoice'  element={<Invoice />} />
            </Route>
          </Routes>
          <Routes>
            <Route element={<ProtectedRoutes />}>
              <Route path='/messages'  element={<MensagesPage />} />
            </Route>
          </Routes>
          <Routes>
            <Route element={<ProtectedRoutes />}>
              <Route path='/properties'  element={<PropertiesPage />} />
            </Route>
          </Routes>
          <Routes>
            <Route element={<ProtectedRoutes />}>
              <Route path='/printInvoice'  element={<SheetInvoice />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
