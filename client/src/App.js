import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes, useActionData } from "react-router-dom";
import Home from './pages/Home';
import CalendarPage from './pages/CalendarPage';
import DocumentsPage from './pages/DocumentsPage';
import Document from './pages/Document';
import CustomersPage from './pages/CustomersPage';
import Sheet1 from './pages/Sheet1';

function App() {
  return (
    <div>
      <Router>
        <div className="App">
          <Routes>
            <Route path='/'  element={<CalendarPage />} />
          </Routes>
          <Routes>
            <Route path='/calendar'  element={<CalendarPage />} />
          </Routes>
          <Routes>
            <Route path='/documents'  element={<DocumentsPage />} />
          </Routes>
          <Routes>
            <Route path='/document'  element={<Document />} />
          </Routes>
          <Routes>
            <Route path='/customers'  element={<CustomersPage />} />
          </Routes>
          <Routes>
            <Route path='/sheet1'  element={<Sheet1 />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
