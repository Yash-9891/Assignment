"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { X, BookOpen, AlertCircle } from "lucide-react"
import LoadingSpinner from "./ui/loadingspinner"

interface Module {
  id: string
  title: string
}

interface ModuleModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (module: Module) => void
  module: Module | null
  modules: Module[]
}

const ModuleModal = ({ isOpen, onClose, onSave, module, modules }: ModuleModalProps) => {
  const [title, setTitle] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setTitle(module?.title || "")
      setError("")
      setIsLoading(false)
    }
  }, [isOpen, module])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    if (!title.trim()) {
      setError("Module name cannot be empty.")
      setIsLoading(false)
      return
    }

    if (!module && modules.some((m) => m.title === title.trim())) {
      setError("A module with this name already exists.")
      setIsLoading(false)
      return
    }

    if (module && modules.some((m) => m.id !== module.id && m.title === title.trim())) {
      setError("A module with this name already exists.")
      setIsLoading(false)
      return
    }

    onSave({
      id: module?.id || Date.now().toString(),
      title: title.trim(),
    })

    setTitle("")
    setError("")
    setIsLoading(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-scale">
      <div className="glass rounded-2xl shadow-2xl border border-white/20 w-full max-w-md animate-slide-up">
        <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{module ? "Edit Module" : "Create Module"}</h2>
              <p className="text-sm text-gray-600">
                {module ? "Update your module details" : "Add a new learning module"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            disabled={isLoading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label htmlFor="module-title" className="block text-sm font-semibold text-gray-700 mb-3">
              Module Name *
            </label>
            <input
              id="module-title"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
                setError("")
              }}
              placeholder="Enter a descriptive module name..."
              className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-500"
              autoFocus
              disabled={isLoading}
            />
            {error && (
              <div className="flex items-center gap-2 mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary px-6 py-3 rounded-xl"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary px-6 py-3 rounded-xl min-w-[120px] flex items-center justify-center gap-2"
              disabled={!title.trim() || !!error || isLoading}
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span>{module ? "Updating..." : "Creating..."}</span>
                </>
              ) : (
                <span>{module ? "Update Module" : "Create Module"}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ModuleModal
