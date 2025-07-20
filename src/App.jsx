import { useState } from 'react';
import Routes from './Routes';
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider

function App() {
  const [darkMode, setDarkMode] = useState(false); 
  return (
    <AuthProvider> {/* Wrap with AuthProvider */}
      <div>
        <Routes darkMode={darkMode} setDarkMode={setDarkMode} /> {/* Pass darkMode props */}
      </div>
    </AuthProvider>
  );
}

export default App;