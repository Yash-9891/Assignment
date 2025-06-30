"use client"

import { useState, useRef, useEffect } from "react"
import { Search, Plus, ChevronDown, BookOpen, Sparkles, FolderPlus, Link, Upload } from "lucide-react"

interface HeaderProps {
  onAddClick: (type: string) => void
  searchTerm: string
  onSearchChange: (term: string) => void
  moduleCount: number
  itemCount: number
}

const Header = ({ onAddClick, searchTerm, onSearchChange, moduleCount, itemCount }: HeaderProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  const handleAddClick = (type: string) => {
    onAddClick(type)
    setIsDropdownOpen(false)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault()
        searchRef.current?.focus()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  return (
    <div className="fixed-header">
      <div className="glass rounded-full shadow-xl border border-white/20 animate-slide-down">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <div className="relative p-1">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg overflow-visible">
                <BookOpen className="w-7 h-7 text-white" />
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center shadow-sm">
                  <Sparkles className="w-3 h-3 text-yellow-800" />
                </div>
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">Course Builder</h1>
              <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  {moduleCount} modules
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  {itemCount} resources
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative group">
              <div
                className={`relative transition-all duration-300 ${isSearchFocused ? "scale-105 shadow-lg" : "shadow-md"}`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10 group-focus-within:text-blue-500 transition-colors duration-200" />
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="relative pl-14 pr-6 py-4 w-80 bg-white/90 backdrop-blur-sm border-2 border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200 text-gray-700 placeholder-gray-500 font-medium hover:border-gray-300 hover:shadow-md"
                />
              </div>
            </div>

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className="relative overflow-hidden px-8 py-4 text-base font-bold rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-white group"
                style={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)",
                  backgroundSize: "200% 200%",
                  animation: "gradient-shift 3s ease infinite",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-violet-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
                <div className="relative flex items-center">
                  <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                  Create
                  <ChevronDown
                    className={`w-4 h-4 ml-2 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
                  />
                </div>
              </button>

              {isDropdownOpen && (
                <div
                  className="dropdown-menu absolute right-0 top-full mt-3 w-64 bg-white rounded-3xl shadow-2xl border-2 border-gray-200 animate-fade-scale overflow-hidden"
                  style={{ zIndex: 9999 }}
                >
                  <div className="p-3">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
                      Create New
                    </div>
                    <button
                      onClick={() => handleAddClick("module")}
                      className="w-full text-left px-4 py-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 rounded-full flex items-center gap-4 transition-all duration-200 group border border-transparent hover:border-blue-200"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-lg">
                        <FolderPlus className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                          Add Module
                        </div>
                        <div className="text-sm text-gray-500 group-hover:text-blue-600 transition-colors">
                          Organize your content
                        </div>
                      </div>
                      <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-blue-500 rotate-[-90deg] transition-colors" />
                    </button>

                    <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-3"></div>

                    <button
                      onClick={() => handleAddClick("link")}
                      className="w-full text-left px-4 py-4 hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100 rounded-full flex items-center gap-4 transition-all duration-200 group border border-transparent hover:border-green-200"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-lg">
                        <Link className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors">
                          Add Link
                        </div>
                        <div className="text-sm text-gray-500 group-hover:text-green-600 transition-colors">
                          External resources
                        </div>
                      </div>
                      <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-green-500 rotate-[-90deg] transition-colors" />
                    </button>

                    <button
                      onClick={() => handleAddClick("upload")}
                      className="w-full text-left px-4 py-4 hover:bg-gradient-to-r hover:from-purple-50 hover:to-purple-100 rounded-full flex items-center gap-4 transition-all duration-200 group border border-transparent hover:border-purple-200"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-lg">
                        <Upload className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 group-hover:text-purple-700 transition-colors">
                          Upload File
                        </div>
                        <div className="text-sm text-gray-500 group-hover:text-purple-600 transition-colors">
                          Documents & media
                        </div>
                      </div>
                      <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-purple-500 rotate-[-90deg] transition-colors" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header
