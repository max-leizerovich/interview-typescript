import React from 'react';

export function AboutPage() {
  return (
    <div className="page">
      <h1 className="page__title">About</h1>
      <p style={{ margin: 0, color: 'var(--color-text-muted)' }}>
        Interview TypeScript demo app with React Router and shared CSS.
      </p>
    </div>
  );
}
