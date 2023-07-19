import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes, useActionData } from "react-router-dom";
import Home from './pages/Home';
import CalendarPage from './pages/CalendarPage';

function App() {
  return (
    <div>
      <Router>
        <div className="App">
          <Routes>
            <Route path='/'  element={<CalendarPage />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
