import React from 'react'

const ICONS = [
  {
    id: 'home',
    label: 'Home',
    path: (
      <path
        d="M4 11.5 12 4l8 7.5M6 10v9h12v-9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    id: 'saved',
    label: 'Saved',
    path: (
      <path
        d="M6 4h12v16l-6-4-6 4V4Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    id: 'reviews',
    label: 'Reviews',
    path: (
      <path
        d="M4 5h16v11H8l-4 4V5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    id: 'profile',
    label: 'Profile',
    path: (
      <>
        <circle cx="12" cy="8" r="3.4" stroke="currentColor" strokeWidth="1.8" />
        <path d="M5 20c1.6-3.6 4.4-5.4 7-5.4s5.4 1.8 7 5.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </>
    ),
  },
]

export default function Sidebar({ active, onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">VH</div>

      <nav className="sidebar-nav">
        {ICONS.map((icon) => (
          <button
            key={icon.id}
            className={`sidebar-icon${active === icon.id ? ' active' : ''}`}
            aria-label={icon.label}
            title={icon.label}
            onClick={() => onNavigate(icon.id)}
          >
            <svg viewBox="0 0 24 24" fill="none">
              {icon.path}
            </svg>
          </button>
        ))}
      </nav>
    </aside>
  )
}