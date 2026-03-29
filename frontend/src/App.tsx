import React from 'react';
import { NavLink, Route, Routes } from 'react-router-dom';
import { AboutPage } from './pages/AboutPage';
import { ItemsPage } from './pages/ItemsPage';

export function App() {
  return (
    <div className="app-shell">
      <header className="app-nav">
        <NavLink to="/" className="app-nav__brand" end>
          Interview TS
        </NavLink>
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `app-nav__link${isActive ? ' app-nav__link--active' : ''}`
          }
        >
          Items
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) =>
            `app-nav__link${isActive ? ' app-nav__link--active' : ''}`
          }
        >
          About
        </NavLink>
      </header>
      <main className="app-main">
        <Routes>
          <Route path="/" element={<ItemsPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </main>
    </div>
  );
}
