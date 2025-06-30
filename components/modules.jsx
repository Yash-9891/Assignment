"use client"

import { useDrag, useDrop } from "react-dnd"
import { ItemTypes } from "./itemtype"
import { GripVertical, X } from "lucide-react"

/**
 * Props expected by CourseBuilder.jsx
 * id, moduleId, title, url, fileName, removeModule, index, moveModule
 */
const Module = ({ id, moduleId, title, url, fileName, removeModule, index, moveModule }) => {
  /* ---------- drag source ---------- */
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.MODULE,
    item: { moduleId, index, type: ItemTypes.MODULE },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  /* ---------- drop target (to allow re-ordering) ---------- */
  const [, drop] = useDrop({
    accept: ItemTypes.MODULE,
    hover: (dragged) => {
      if (dragged.index === index) return
      moveModule(dragged.index, index)
      dragged.index = index
    },
  })

  /* ---------- handlers ---------- */
  const handleRemove = () => removeModule(moduleId)

  /* ---------- UI ---------- */
  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`border-2 border-green-500 rounded p-4 mb-4 bg-white transition ${isDragging ? "opacity-40" : ""}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-2">
          <GripVertical className="w-5 h-5 text-gray-400 mt-1" />
          <div>
            <h3 className="font-semibold text-gray-800">{title}</h3>
            {/* if the module was created from a single item, show its details */}
            {url && (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 underline break-all"
                onClick={(e) => e.stopPropagation()}
              >
                {url}
              </a>
            )}
            {fileName && <p className="text-sm text-gray-600">{fileName}</p>}
          </div>
        </div>

        <button title="Remove module" onClick={handleRemove} className="text-red-600 hover:text-red-800">
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

export default Module
