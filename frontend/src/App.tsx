import clsx from 'clsx';
import { NavLink, Route, Routes } from 'react-router-dom';
import { AboutPage } from './pages/AboutPage';
import { ItemsPage } from './pages/ItemsPage';

const getNavLinkClassName = ({ isActive }: { isActive: boolean }) =>
  clsx(
    'rounded-md px-3 py-1.5 text-sm no-underline transition-colors outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900',
    {
      'bg-blue-600/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400':
        isActive,
      'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100':
        !isActive,
    },
  );

/**
 * Root layout and client-side routes for the interview demo app.
 */
export const App = () => (
  <div className="flex min-h-screen flex-col bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
    <header
      className="flex items-center gap-4 border-b border-zinc-200 bg-white px-5 py-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
      role="banner"
    >
      <NavLink
        to="/"
        className="mr-auto font-semibold text-zinc-900 no-underline hover:text-zinc-900 dark:text-zinc-100 dark:hover:text-zinc-100"
        end
        aria-label="Interview TS home"
      >
        Interview TS
      </NavLink>
      <NavLink to="/" end className={getNavLinkClassName}>
        Items
      </NavLink>
      <NavLink to="/about" className={getNavLinkClassName}>
        About
      </NavLink>
    </header>
    <main className="flex-1 px-4 py-8" role="main">
      <Routes>
        <Route path="/" element={<ItemsPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </main>
  </div>
);
