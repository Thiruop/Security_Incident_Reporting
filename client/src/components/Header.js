import React, { useState, useEffect } from 'react';
import { SunMoon, Sun, User, Menu } from 'lucide-react';

const Header = ({ toggleSidebar }) => {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  const email = localStorage.getItem('email');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(prev => !prev);

  return (
    <header className="flex justify-between items-center p-4 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow">
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
          <Menu size={24} />
        </button>
        <h1 className="text-lg font-bold">Security Reporting</h1>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded hover:bg-gray-300 dark:hover:bg-gray-700"
          aria-label="Toggle Theme"
        >
          {darkMode ? <Sun size={24} /> : <SunMoon size={24} />}
        </button>
        <User size={24} />
        <span className="font-medium">{email}</span>
      </div>
    </header>
  );
};

export default Header;
