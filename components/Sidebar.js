"use client"

import Link from "next/link"
import { useSidebar } from "./SidebarProvider"

const HomeIcon = () => (
  <svg className="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
)

const LibraryIcon = () => (
  <svg className="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
)

const ProfileIcon = () => (
  <svg className="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
)

const StatsIcon = () => (
  <svg className="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
)

const WriteIcon = () => (
  <svg className="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
)

const AdminIcon = () => (
  <svg className="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

function SidebarLink({ href, icon, label, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-600 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-900"
    >
      {icon}
      <span className="whitespace-nowrap">{label}</span>
    </Link>
  )
}

function SidebarContent({ isLoggedIn, isAdmin, onLinkClick }) {
  return (
    <>
      <nav className="space-y-1">
        <SidebarLink href="/" icon={<HomeIcon />} label="Home" onClick={onLinkClick} />
        <SidebarLink href="/" icon={<LibraryIcon />} label="Library" onClick={onLinkClick} />
        {isLoggedIn && (
          <>
            <SidebarLink href="/" icon={<ProfileIcon />} label="Profile" onClick={onLinkClick} />
            <SidebarLink href="/" icon={<StatsIcon />} label="Stats" onClick={onLinkClick} />
          </>
        )}
      </nav>

      <div className="my-6 border-t border-gray-200" />

      {isLoggedIn && (
        <nav className="space-y-1">
          <SidebarLink href="/write" icon={<WriteIcon />} label="Write" onClick={onLinkClick} />
          {isAdmin && (
            <SidebarLink href="/admin" icon={<AdminIcon />} label="Admin" onClick={onLinkClick} />
          )}
        </nav>
      )}
    </>
  )
}

export default function Sidebar({ isLoggedIn, isAdmin }) {
  const { isCollapsed, isMobileOpen, closeMobile } = useSidebar()

  return (
    <>
      {/* Desktop Sidebar — collapses to width 0 */}
      <aside
        className={`sticky top-20 hidden lg:flex flex-col self-start overflow-hidden transition-all duration-300 ease-in-out ${
          isCollapsed ? "w-0" : "w-56"
        }`}
      >
        <div className="w-56 flex-shrink-0">
          <SidebarContent isLoggedIn={isLoggedIn} isAdmin={isAdmin} />
        </div>
      </aside>

      {/* Mobile Slide-over Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={closeMobile}
        />
      )}

      {/* Mobile Slide-over Panel */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-white shadow-xl transition-transform duration-300 ease-in-out lg:hidden ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close Button */}
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-4">
          <span
            className="text-xl font-bold text-gray-900"
            style={{ fontFamily: "Georgia, serif" }}
          >
            BlogSpace
          </span>
          <button
            onClick={closeMobile}
            className="flex h-9 w-9 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4">
          <SidebarContent
            isLoggedIn={isLoggedIn}
            isAdmin={isAdmin}
            onLinkClick={closeMobile}
          />
        </div>
      </aside>
    </>
  )
}
