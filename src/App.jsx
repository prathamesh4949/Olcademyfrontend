import { useState } from 'react';
import Routes from './Routes';
import { AuthProvider } from './context/AuthContext';

function App() {
  const [darkMode, setDarkMode] = useState(false); 
  return (
    <AuthProvider>
      <div>
      
        <Routes darkMode={darkMode} setDarkMode={setDarkMode} />
      </div>
    </AuthProvider>
  );
}

export default App;