import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import Home from "../pages/Home";
import View from "../pages/View";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:id" element={<View />} />
      </Routes>
    </BrowserRouter>
  );

}

export default App