import { useState } from 'react';
import Routes from './Routes';
import AllFragrancesSection from './pages/AllFregrances';

function App() {

  const [darkMode, setDarkMode] = useState(false); 
  return (
    <div>
      <Routes />
    </div>


  );
}

export default App;