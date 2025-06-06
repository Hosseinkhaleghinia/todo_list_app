import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import "./App.css";

import Home from "./pages/Home.js";
import SignIn from "./pages/sign-in/SignIn.js";
import SignUp from "./pages/sign-up/SignUp.js";
import { useAuth } from "./hooks/useAuth.js";

function App() {
  const { user, loading } = useAuth();

  // نمایش loading در حین بررسی وضعیت authentication
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px' 
      }}>
        Loading...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        
        {user ? (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route path="/signup" element={<Navigate to="/" replace />} />
          </>
        ) : (
          <>
            
            <Route path="/login" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;