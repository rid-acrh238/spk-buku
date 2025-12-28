import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './page/AuthPage.jsx';
import DashboardPage from './page/DashboardPage.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Halaman Awal (Login/Register) */}
        <Route path="/" element={<AuthPage />} />
        
        {/* Halaman Dashboard (Perlu Login) */}
        <Route path="/dashboard" element={<DashboardPage />} />
        
        {/* Redirect halaman nyasar balik ke login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import AuthPage from './page/AuthPage.jsx';
// import DashboardPage from './pages/DashboardPage';

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* Halaman Login/Register */}
//         <Route path="/" element={<AuthPage />} />
        
//         {/* Halaman Dashboard (Langsung File tadi) */}
//         <Route path="/dashboard" element={<DashboardPage />} />
        
//         {/* Redirect sembarang link ke login */}
//         <Route path="*" element={<Navigate to="/" />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;