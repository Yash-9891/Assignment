"use client"

import { List, ChevronRight } from "lucide-react"

interface Module {
  id: string
  title: string
}

interface OutlineProps {
  modules: Module[]
  scrollToModule: (index: number) => void
  activeIndex: number
}

const Outline = ({ modules, scrollToModule, activeIndex }: OutlineProps) => {
  return (
    <div className="fixed left-6 top-44 w-72 glass rounded-2xl shadow-xl border border-white/20 h-[calc(100vh-220px)] flex flex-col animate-slide-up">
      <div className="p-6 border-b border-gray-200/50 flex-shrink-0">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
            <List className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Course Outline</h3>
            <p className="text-sm text-gray-500">{modules.length} modules total</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {modules.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <List className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-sm">No modules yet</p>
            <p className="text-gray-400 text-xs mt-1">Create your first module to get started</p>
          </div>
        ) : (
          <div className="space-y-2 pb-4">
            {modules.map((module, index) => (
              <button
                key={module.id}
                onClick={() => scrollToModule(index)}
                className={`w-full text-left p-4 rounded-xl transition-all duration-200 group relative overflow-hidden ${
                  activeIndex === index
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105"
                    : "text-gray-700 hover:bg-white/60 hover:shadow-md"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-colors ${
                      activeIndex === index
                        ? "bg-white/20 text-white"
                        : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`font-medium truncate ${activeIndex === index ? "text-white" : "text-gray-900"}`}>
                      {module.title}
                    </div>
                    <div className={`text-xs ${activeIndex === index ? "text-white/80" : "text-gray-500"}`}>
                      Module {index + 1}
                    </div>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 transition-transform ${
                      activeIndex === index ? "text-white rotate-90" : "text-gray-400 group-hover:translate-x-1"
                    }`}
                  />
                </div>

                {activeIndex === index && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-xl animate-pulse" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Outline
