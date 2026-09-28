import { createRoot } from 'react-dom/client';
import React from 'react';

// React bootstrap — required for Freebuff hosting framework detection.
// The actual application is the untouched single-file app in index.html
// (its inline script runs first, self-bootstraps, and needs no React).
// This renders an empty root so the React entry exists and nothing overlaps it.
const container = document.getElementById('react-root');
if (container) {
  createRoot(container).render(React.createElement(React.Fragment));
}
