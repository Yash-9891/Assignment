"use client"

import React, { useState, useRef, useEffect } from "react"
import { useDrag, useDrop } from "react-dnd"
import { getEmptyImage } from "react-dnd-html5-backend"
import { ItemTypes } from "./itemtypes"
import ModuleItem from "./moduleitem"

import {
  GripVertical, ChevronDown, ChevronRight,
  MoreVertical, Plus, Edit3, Trash2,
  FileText, Link, Clock, Users, Upload
} from "lucide-react"

const ModuleCard = ({
  module,
  index,
  items = [],
  className = "",
  onEdit,
  onDelete,
  onAddItem,
  onDeleteItem,
  onEditItem,
  moveModule,
  moveItem,
  moveItemWithinModule,
}) => {
  const [isOptionsOpen, setIsOptionsOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const optionsRef = useRef(null)
  const addMenuRef = useRef(null)
  const cardRef = useRef(null)

  const moduleItems = items.filter(item => item.moduleId === module.id)
  const linkCount = moduleItems.filter(item => item.type === "link").length
  const fileCount = moduleItems.filter(item => item.type === "file").length

  const [{ isDragging }, dragRef, preview] = useDrag({
    type: ItemTypes.MODULE,
    item: { id: module.id, index, type: ItemTypes.MODULE },
    collect: monitor => ({ isDragging: monitor.isDragging() }),
  })

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true })
  }, [preview])

  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.MODULE,
    collect: monitor => ({ isOver: monitor.isOver() }),
    hover: dragged => {
      if (dragged.index !== index) {
        moveModule(dragged.index, index)
        dragged.index = index
      }
    },
  })

  const [{ isItemOver }, itemDrop] = useDrop({
    accept: ItemTypes.ITEM,
    collect: monitor => ({ isItemOver: monitor.isOver() }),
    drop: draggedItem => {
      if (draggedItem.moduleId !== module.id) {
        moveItem(draggedItem.id, module.id)
      }
    },
  })

  useEffect(() => {
    if (cardRef.current) {
      drop(cardRef.current)
    }
  }, [drop])

  const toggleOptions = e => {
    e.stopPropagation()
    setIsOptionsOpen(prev => !prev)
    if (!isOptionsOpen) setIsAddMenuOpen(false)
  }

  const toggleAddMenu = e => {
    e.stopPropagation()
    setIsAddMenuOpen(prev => !prev)
    if (!isAddMenuOpen) setIsOptionsOpen(false)
  }

  const handleAddClick = type => {
    onAddItem(module.id, type)
    setIsAddMenuOpen(false)
  }

  const handleClickOutside = e => {
    if (
      optionsRef.current && !optionsRef.current.contains(e.target) &&
      !e.target.closest(".btn-options")
    ) setIsOptionsOpen(false)

    if (
      addMenuRef.current && !addMenuRef.current.contains(e.target) &&
      !e.target.closest(".add-item-button")
    ) setIsAddMenuOpen(false)
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`card transition-all duration-300 ${isDragging ? "opacity-50" : ""} ${isOver ? "bg-blue-50" : ""} ${isHovered ? "shadow-lg border-blue-200 -translate-y-1" : ""} ${className}`}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div ref={dragRef} className="cursor-grab p-2 rounded hover:bg-gray-100">
              <GripVertical className="w-5 h-5 text-gray-400" />
            </div>
            <button onClick={() => setIsExpanded(!isExpanded)} className="p-2 rounded hover:bg-gray-100">
              {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </button>
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-2xl flex items-center justify-center font-bold text-xl shadow">
              {module.title?.[0]?.toUpperCase()}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{module.title}</h3>
              <div className="text-sm text-gray-500 flex gap-4">
                {moduleItems.length === 0 ? (
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4" />No content</span>
                ) : (
                  <>
                    <span className="flex items-center gap-1"><FileText className="w-4 h-4" />{moduleItems.length} items</span>
                    <span className="flex items-center gap-1"><Users className="w-4 h-4" />~{moduleItems.length * 5} min</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="relative">
            <button className="btn-options p-3 rounded hover:bg-gray-100" onClick={toggleOptions}>
              <MoreVertical className="w-5 h-5" />
            </button>
            {isOptionsOpen && (
              <div ref={optionsRef} className="absolute right-0 mt-2 w-56 bg-white shadow-xl rounded-lg border z-50">
                <button onClick={() => { onEdit(module); setIsOptionsOpen(false) }} className="flex gap-2 p-3 hover:bg-blue-50 w-full text-left">
                  <Edit3 className="w-5 h-5 text-blue-600" /> Edit Module
                </button>
                <button onClick={() => { onDelete(module.id); setIsOptionsOpen(false) }} className="flex gap-2 p-3 hover:bg-red-50 w-full text-left">
                  <Trash2 className="w-5 h-5 text-red-600" /> Delete Module
                </button>
              </div>
            )}
          </div>
        </div>

        {moduleItems.length > 0 && (
          <div className="flex items-center gap-6 mb-4 p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-700">{linkCount} Links</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700">{fileCount} Files</span>
            </div>
          </div>
        )}
      </div>

      {isExpanded && (
        <div ref={itemDrop} className={`border-t p-6 ${isItemOver ? "bg-blue-50" : ""}`}>
          {moduleItems.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <Plus className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600 mb-4">No content yet</p>
              <div className="relative inline-block">
                <button
                  onClick={toggleAddMenu}
                  className="add-item-button btn btn-primary px-6 py-3 rounded-xl shadow-md"
                >
                  <Plus className="w-5 h-5 mr-2" /> Add Content
                </button>
                {isAddMenuOpen && (
                  <div ref={addMenuRef} className="absolute top-full mt-2 w-64 bg-white shadow-xl border rounded-xl z-50">
                    <button onClick={() => handleAddClick("link")} className="flex gap-4 p-4 hover:bg-green-50 w-full text-left">
                      <Link className="w-6 h-6 text-green-600" /> Add Link
                    </button>
                    <button onClick={() => handleAddClick("file")} className="flex gap-4 p-4 hover:bg-purple-50 w-full text-left">
                      <Upload className="w-6 h-6 text-purple-600" /> Upload File
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {moduleItems.map((item, i) => (
                <ModuleItem
                  key={item.id}
                  item={item}
                  index={i}
                  onDelete={onDeleteItem}
                  onEdit={onEditItem}
                  moveItem={moveItem}
                  moveItemWithinModule={moveItemWithinModule}
                />
              ))}
              <div className="flex justify-center mt-6">
                <button
                  onClick={toggleAddMenu}
                  className="add-item-button btn btn-secondary px-6 py-2 rounded-xl"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add More Content
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ModuleCard
