"use client"

import  React from "react"
import { useState, useRef, useEffect } from "react"
import { getEmptyImage } from "react-dnd-html5-backend"
import { useDrag, useDrop } from "react-dnd"
import { ItemTypes } from "./itemtypes"
import ModuleItem from "./moduleitem"
import {
  GripVertical,
  ChevronDown,
  ChevronRight,
  MoreVertical,
  Plus,
  Edit3,
  Trash2,
  FileText,
  Link,
  Clock,
  Users,
  Upload,
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
  const optionsRef = useRef<HTMLDivElement>(null)
  const addMenuRef = useRef<HTMLDivElement>(null)

  const moduleItems = items.filter((item) => item.moduleId === module.id)
  const linkCount = moduleItems.filter((item) => item.type === "link").length
  const fileCount = moduleItems.filter((item) => item.type === "file").length

  const [{ isDragging }, dragRef, preview] = useDrag({
    type: ItemTypes.MODULE,
    item: { id: module.id, index, type: ItemTypes.MODULE },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  })

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true })
  }, [preview])

  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.MODULE,
    collect: (monitor) => ({ isOver: monitor.isOver() }),
    hover: (dragged) => {
      if (dragged.index !== index && index >= 0) {
        moveModule(dragged.index, index)
        dragged.index = index
      }
    },
  })

  const [{ isItemOver }, itemDrop] = useDrop({
    accept: ItemTypes.ITEM,
    collect: (monitor) => ({ isItemOver: monitor.isOver() }),
    drop: (draggedItem) => {
      if (draggedItem.moduleId !== module.id) {
        moveItem(draggedItem.id, module.id)
      }
    },
  })

  const toggleOptions = (e) => {
    e.stopPropagation()
    setIsOptionsOpen((prev) => !prev)
    if (!isOptionsOpen) setIsAddMenuOpen(false)
  }

  const toggleExpanded = () => setIsExpanded((prev) => !prev)

  const handleEdit = () => {
    onEdit(module)
    setIsOptionsOpen(false)
  }

  const handleDelete = () => {
    onDelete(module.id)
    setIsOptionsOpen(false)
  }

  const toggleAddMenu = (e) => {
    e.stopPropagation()
    setIsAddMenuOpen((prev) => !prev)
    if (!isAddMenuOpen) setIsOptionsOpen(false)
  }

  const handleAddClick = (type) => {
    onAddItem(module.id, type)
    setIsAddMenuOpen(false)
  }

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        optionsRef.current &&
        !optionsRef.current.contains(e.target) &&
        !(e.target).closest(".btn-options")
      ) {
        setIsOptionsOpen(false)
      }
      if (
        addMenuRef.current &&
        !addMenuRef.current.contains(e.target) &&
        !(e.target).closest(".add-item-button")
      ) {
        setIsAddMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div
      ref={(el) => preview(drop(el))}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`card transition-all duration-300 ${
        isDragging ? "dragging" : ""
      } ${isOver ? "drag-over" : ""} ${className} ${
        isHovered ? "shadow-xl border-blue-200 transform -translate-y-1" : ""
      } animate-slide-up`}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div
              ref={dragRef}
              className="cursor-grab hover:cursor-grabbing p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <GripVertical className="w-5 h-5 text-gray-400" />
            </div>

            <button
              onClick={toggleExpanded}
              className="p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 group"
            >
              {isExpanded ? (
                <ChevronDown className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
              )}
            </button>

            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">{module.title.charAt(0).toUpperCase()}</span>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">{module.title}</h3>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                {moduleItems.length === 0 ? (
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    No content yet
                  </span>
                ) : (
                  <>
                    <span className="flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      {moduleItems.length} items
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />~{moduleItems.length * 5}min
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="relative">
            <button
              className="btn-options p-3 hover:bg-gray-100 rounded-xl transition-all duration-200 group"
              onClick={toggleOptions}
              aria-label="Options"
            >
              <MoreVertical className="w-5 h-5 text-gray-600 group-hover:text-gray-800" />
            </button>

            {isOptionsOpen && (
              <div
                ref={optionsRef}
                className="absolute right-0 top-full mt-3 w-56 bg-white rounded-2xl shadow-2xl border-2 border-gray-200 z-50 animate-fade-scale overflow-hidden"
              >
                <div className="p-3">
                  <button
                    className="w-full text-left px-4 py-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 rounded-xl flex items-center gap-3 transition-all duration-200 group border border-transparent hover:border-blue-200"
                    onClick={handleEdit}
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                      <Edit3 className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <span className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                        Edit module
                      </span>
                      <div className="text-xs text-gray-500 group-hover:text-blue-600 transition-colors">
                        Modify module details
                      </div>
                    </div>
                  </button>

                  <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-2"></div>

                  <button
                    className="w-full text-left px-4 py-3 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 rounded-xl flex items-center gap-3 transition-all duration-200 group border border-transparent hover:border-red-200"
                    onClick={handleDelete}
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                      <Trash2 className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <span className="font-semibold text-red-600 group-hover:text-red-700 transition-colors">
                        Delete module
                      </span>
                      <div className="text-xs text-gray-500 group-hover:text-red-600 transition-colors">
                        Remove permanently
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {moduleItems.length > 0 && (
          <div className="flex items-center gap-6 mb-4 p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">{linkCount} Links</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">{fileCount} Files</span>
            </div>
          </div>
        )}
      </div>

      {isExpanded && (
        <div
          ref={itemDrop}
          className={`border-t border-gray-100 p-6 transition-all duration-300 ${isItemOver ? "bg-blue-50" : ""}`}
        >
          {moduleItems.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600 mb-6 font-medium">No content in this module yet</p>
              <div className="relative inline-block">
                <button
                  className="add-item-button btn btn-primary px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                  onClick={toggleAddMenu}
                >
                  <Plus className="w-5 h-5 mr-2" /> Add Content
                </button>
                {isAddMenuOpen && (
                  <div
                    ref={addMenuRef}
                    className="absolute top-full left-1/2 transform -translate-x-1/2 mt-3 w-64 bg-white rounded-2xl shadow-2xl border-2 border-gray-200 z-50 animate-fade-scale overflow-hidden"
                  >
                    <div className="p-3">
                      <button
                        className="w-full text-left px-4 py-4 hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100 rounded-xl flex items-center gap-4 transition-all duration-200 group border border-transparent hover:border-green-200"
                        onClick={() => handleAddClick("link")}
                      >
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-lg">
                          <Link className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors">
                            Add Link
                          </div>
                          <div className="text-sm text-gray-500 group-hover:text-green-600 transition-colors">
                            External resource
                          </div>
                        </div>
                      </button>
                      <button
                        className="w-full text-left px-4 py-4 hover:bg-gradient-to-r hover:from-purple-50 hover:to-purple-100 rounded-xl flex items-center gap-4 transition-all duration-200 group border border-transparent hover:border-purple-200"
                        onClick={() => handleAddClick("file")}
                      >
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-lg">
                          <Upload className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900 group-hover:text-purple-700 transition-colors">
                            Upload File
                          </div>
                          <div className="text-sm text-gray-500 group-hover:text-purple-600 transition-colors">
                            Document or media
                          </div>
                        </div>
                      </button>
                    </div>
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
              <div className="flex justify-center pt-4">
                <div className="relative">
                  <button
                    className="add-item-button btn btn-secondary px-6 py-2 rounded-xl hover:shadow-md transition-all duration-200"
                    onClick={toggleAddMenu}
                  >
                    <Plus className="w-4 h-4 mr-2" /> Add More Content
                  </button>
                  {isAddMenuOpen && (
                    <div
                      ref={addMenuRef}
                      className="absolute top-full left-1/2 transform -translate-x-1/2 mt-3 w-64 bg-white rounded-2xl shadow-2xl border-2 border-gray-200 z-50 animate-fade-scale overflow-hidden"
                    >
                      <div className="p-3">
                        <button
                          className="w-full text-left px-4 py-4 hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100 rounded-xl flex items-center gap-4 transition-all duration-200 group border border-transparent hover:border-green-200"
                          onClick={() => handleAddClick("link")}
                        >
                          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-lg">
                            <Link className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors">
                              Add Link
                            </div>
                            <div className="text-sm text-gray-500 group-hover:text-green-600 transition-colors">
                              External resource
                            </div>
                          </div>
                        </button>
                        <button
                          className="w-full text-left px-4 py-4 hover:bg-gradient-to-r hover:from-purple-50 hover:to-purple-100 rounded-xl flex items-center gap-4 transition-all duration-200 group border border-transparent hover:border-purple-200"
                          onClick={() => handleAddClick("file")}
                        >
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-lg">
                            <Upload className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900 group-hover:text-purple-700 transition-colors">
                              Upload File
                            </div>
                            <div className="text-sm text-gray-500 group-hover:text-purple-600 transition-colors">
                              Document or media
                            </div>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ModuleCard
