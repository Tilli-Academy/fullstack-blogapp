"use client"

import { useSidebar } from "./SidebarProvider"

export default function SidebarToggle() {
  const { isCollapsed, toggle, openMobile } = useSidebar()

  return (
    <>
      {/* Desktop toggle */}
      <button
        onClick={toggle}
        className="hidden lg:flex h-9 w-9 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
        title={isCollapsed ? "Show sidebar" : "Hide sidebar"}
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Mobile toggle */}
      <button
        onClick={openMobile}
        className="flex lg:hidden h-9 w-9 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
        title="Open menu"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </>
  )
}
