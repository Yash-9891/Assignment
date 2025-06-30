"use client"

import { BookOpen, Plus, Sparkles, ArrowRight } from "lucide-react"

interface EmptyStateProps {
  onAddClick: (type: string) => void
}

const EmptyState = ({ onAddClick }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center animate-fade-scale">
      <div className="relative mb-8">
        <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl">
          <BookOpen className="w-16 h-16 text-white" />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
          <Sparkles className="w-4 h-4 text-yellow-800" />
        </div>
        <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-green-400 rounded-full animate-pulse"></div>
      </div>

      <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Course Builder</h2>
      <p className="text-lg text-gray-600 mb-8 max-w-md leading-relaxed">
        Create engaging learning experiences by organizing your content into modules and adding interactive resources.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 mb-12">
        <button
          onClick={() => onAddClick("module")}
          className="btn btn-primary px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 group"
        >
          <Plus className="w-6 h-6 mr-3 group-hover:rotate-90 transition-transform duration-200" />
          Create Your First Module
          <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-200" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
        <div className="p-6 glass rounded-2xl border border-white/20 hover:shadow-lg transition-all duration-200 group">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
            <span className="text-2xl">📁</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Organize Content</h3>
          <p className="text-sm text-gray-600">
            Structure your course with modules and lessons for better learning flow.
          </p>
        </div>

        <div className="p-6 glass rounded-2xl border border-white/20 hover:shadow-lg transition-all duration-200 group">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
            <span className="text-2xl">🔗</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Add Resources</h3>
          <p className="text-sm text-gray-600">
            Include links, documents, and media to enrich the learning experience.
          </p>
        </div>

        <div className="p-6 glass rounded-2xl border border-white/20 hover:shadow-lg transition-all duration-200 group">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
            <span className="text-2xl">✨</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Interactive Design</h3>
          <p className="text-sm text-gray-600">
            Drag and drop to reorder content and create the perfect course structure.
          </p>
        </div>
      </div>
    </div>
  )
}

export default EmptyState
