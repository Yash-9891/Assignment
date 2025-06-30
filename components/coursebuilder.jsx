"use client"

import React, { useState, useRef, useEffect } from "react"
import { useDrop } from "react-dnd"
import { ItemTypes } from "./itemtypes"

import EmptyState from "./ui/Empty-State"
import Header from "./ui/Header"
import Outline from "./ui/Outline"
import Toast from "./ui/Toast"
import LinkModal from "./linkmodel"
import ModuleCard from "./modulecart"
import ModuleModal from "./modulemodal"
import UploadModal from "./uploadmodel"
import EditLinkModal from "./editlinkmodel"
import EditFileModal from "./editfilemododal"

const CourseBuilder = () => {
  const [modules, setModules] = useState([])
  const [items, setItems] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [activeModuleId, setActiveModuleId] = useState(null)
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false)
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [isEditLinkModalOpen, setIsEditLinkModalOpen] = useState(false)
  const [isEditFileModalOpen, setIsEditFileModalOpen] = useState(false)
  const [currentModule, setCurrentModule] = useState(null)
  const [currentModuleId, setCurrentModuleId] = useState(null)
  const [currentItem, setCurrentItem] = useState(null)
  const [toasts, setToasts] = useState([])
  const moduleRefs = useRef({})

  const showToast = (message, type = "info") => {
    const id = Date.now().toString()
    setToasts((prev) => [...prev, { id, message, type }])
  }

  const removeToast = (id) =>
    setToasts((prev) => prev.filter((toast) => toast.id !== id))

  const moveModule = (fromIndex, toIndex) => {
    if (fromIndex === toIndex) return
    const updated = [...modules]
    const [moved] = updated.splice(fromIndex, 1)
    updated.splice(toIndex, 0, moved)
    setModules(updated)
    showToast("Module reordered successfully", "success")
  }

  const moveItem = (itemId, newModuleId) => {
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, moduleId: newModuleId } : item))
    )
    showToast("Item moved successfully", "success")
  }

  const moveItemWithinModule = (moduleId, fromIndex, toIndex) => {
    const moduleItems = items.filter((i) => i.moduleId === moduleId)
    if (
      fromIndex === toIndex ||
      fromIndex < 0 ||
      toIndex < 0 ||
      fromIndex >= moduleItems.length ||
      toIndex >= moduleItems.length
    )
      return

    const updatedModuleItems = [...moduleItems]
    const [movedItem] = updatedModuleItems.splice(fromIndex, 1)
    updatedModuleItems.splice(toIndex, 0, movedItem)

    const otherItems = items.filter((i) => i.moduleId !== moduleId)
    setItems([...otherItems, ...updatedModuleItems])
  }

  const [, drop] = useDrop({
    accept: [ItemTypes.MODULE, ItemTypes.ITEM],
    drop: (item, monitor) => {
      if (!monitor.didDrop() && item.type === ItemTypes.ITEM && item.moduleId) {
        moveItem(item.id, null)
      }
    },
  })

  const handleAddClick = (typeOrSearch) => {
    if (typeof typeOrSearch === "string" && !["module", "link", "upload"].includes(typeOrSearch)) {
      setSearchTerm(typeOrSearch)
    } else {
      switch (typeOrSearch) {
        case "module":
          setCurrentModule(null)
          setIsModuleModalOpen(true)
          break
        case "link":
        case "upload":
          setCurrentModuleId(null)
          typeOrSearch === "link" ? setIsLinkModalOpen(true) : setIsUploadModalOpen(true)
          break
        default:
          break
      }
    }
  }

  const handleClose = (type) => {
    switch (type) {
      case "module":
        setIsModuleModalOpen(false)
        setCurrentModule(null)
        break
      case "link":
        setIsLinkModalOpen(false)
        setCurrentModuleId(null)
        break
      case "upload":
        setIsUploadModalOpen(false)
        setCurrentModuleId(null)
        break
      case "editLink":
        setIsEditLinkModalOpen(false)
        setCurrentItem(null)
        break
      case "editFile":
        setIsEditFileModalOpen(false)
        setCurrentItem(null)
        break
    }
  }

  const handleSaveModule = (module) => {
    if (!module.title.trim()) return
    if (!currentModule && modules.some((m) => m.title === module.title.trim())) {
      showToast("A module with this name already exists", "error")
      return
    }
    if (currentModule) {
      setModules((prev) => prev.map((m) => (m.id === module.id ? module : m)))
      showToast("Module updated successfully", "success")
    } else {
      const newModule = { ...module, id: Date.now().toString(), isNew: true }
      setModules((prev) => [...prev, newModule])
      showToast("Module created successfully", "success")
      setTimeout(() => {
        setModules((prev) =>
          prev.map((m) => (m.id === newModule.id ? { ...m, isNew: false } : m))
        )
      }, 500)
    }
    handleClose("module")
  }

  const handleEditModule = (module) => {
    setCurrentModule(module)
    setIsModuleModalOpen(true)
  }

  const handleDeleteModule = (moduleId) => {
    const deletedIndex = modules.findIndex((m) => m.id === moduleId)
    const moduleTitle = modules.find((m) => m.id === moduleId)?.title
    setModules(modules.filter((m) => m.id !== moduleId))
    setItems(items.filter((i) => i.moduleId !== moduleId))
    setActiveModuleId(modules[Math.max(0, deletedIndex - 1)]?.id || null)
    showToast(`Module "${moduleTitle}" deleted`, "success")
  }

  const handleAddItem = (moduleId) => setCurrentModuleId(moduleId)

  const handleSaveLink = (linkItem) => {
    setItems((prev) => [...prev, linkItem])
    showToast("Link added successfully", "success")
    handleClose("link")
  }

  const handleSaveUpload = (fileItem) => {
    setItems((prev) => [...prev, fileItem])
    showToast("File uploaded successfully", "success")
    handleClose("upload")
  }

  const handleDeleteItem = (itemId) => {
    const item = items.find((i) => i.id === itemId)
    setItems(items.filter((i) => i.id !== itemId))
    showToast(`${item?.type === "link" ? "Link" : "File"} deleted`, "success")
  }

  const handleEditItem = (item) => {
    setCurrentItem(item)
    item.type === "link" ? setIsEditLinkModalOpen(true) : setIsEditFileModalOpen(true)
  }

  const handleUpdateItem = (updatedItem) => {
    setItems((prev) =>
      prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    )
    showToast(
      `${updatedItem.type === "link" ? "Link" : "File"} updated successfully`,
      "success"
    )
    handleClose(updatedItem.type === "link" ? "editLink" : "editFile")
  }

  const scrollToModule = (id) => {
    const node = moduleRefs.current[id]
    if (node) {
      node.scrollIntoView({ behavior: "smooth", block: "center" })
      setActiveModuleId(id)
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      Object.entries(moduleRefs.current).forEach(([id, ref]) => {
        if (ref && ref.getBoundingClientRect().top >= 0 && ref.getBoundingClientRect().top <= 200) {
          setActiveModuleId(id)
        }
      })
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const getVisibleModules = () => {
    if (!searchTerm) return modules
    const lower = searchTerm.toLowerCase()
    const map = new Map()
    modules.forEach((m) => {
      if (m.title.toLowerCase().includes(lower)) map.set(m.id, m)
    })
    items
      .filter((i) =>
        ["title", "url", "fileName"].some((k) =>
          i[k]?.toString().toLowerCase().includes(lower)
        )
      )
      .forEach((i) => {
        const m = modules.find((mod) => mod.id === i.moduleId)
        if (m) map.set(m.id, m)
      })
    return Array.from(map.values())
  }

  const getFilteredItems = (moduleId) => {
    if (!searchTerm) return moduleId ? items.filter((i) => i.moduleId === moduleId) : items.filter((i) => !i.moduleId)
    const lower = searchTerm.toLowerCase()
    const filtered = items.filter((i) =>
      ["title", "url", "fileName"].some((k) =>
        i[k]?.toString().toLowerCase().includes(lower)
      )
    )
    return moduleId ? filtered.filter((i) => i.moduleId === moduleId) : filtered.filter((i) => !i.moduleId)
  }

  const visibleModules = getVisibleModules()
  const standaloneItems = getFilteredItems()

  return (
    <div className="course-builder bg-gray-900 min-h-screen text-gray-100 p-6" ref={drop}>
      {/* Header with enhanced text visibility */}
      <Header
        onAddClick={handleAddClick}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        moduleCount={modules.length}
        itemCount={items.length}
        className="text-gray-100 bg-gray-800 shadow-lg rounded-lg p-4 mb-6"
        placeholder="Search modules, links, or files..."
      />

      <div className="content-with-fixed-header max-w-7xl mx-auto">
        <div className="flex gap-8 relative">
          {/* Outline with clearer text styling */}
          <Outline
            modules={modules}
            scrollToModule={scrollToModule}
            activeIndex={activeModuleId}
            className="text-gray-100 bg-gray-800 rounded-lg p-4 w-64 sticky top-4"
          />

          <div className="flex-1 ml-72">
            <div className="scrollable-content">
              {modules.length === 0 && !searchTerm ? (
                <EmptyState
                  onAddClick={handleAddClick}
                  className="text-gray-100 bg-gray-800 rounded-lg p-6 text-center"
                  message="No modules yet. Start by adding a module, link, or file!"
                />
              ) : (
                <div className="space-y-8 pb-12">
                  {(searchTerm ? visibleModules : modules).map((module) => (
                    <div
                      key={module.id}
                      ref={(el) => {
                        if (el) moduleRefs.current[module.id] = el
                      }}
                    >
                      <ModuleCard
                        module={module}
                        index={modules.findIndex((m) => m.id === module.id)}
                        items={getFilteredItems(module.id)}
                        className={`${
                          module.isNew ? "animate-fade-scale" : ""
                        } bg-gray-800 rounded-lg p-6 shadow-md text-gray-100`}
                        onEdit={handleEditModule}
                        onDelete={handleDeleteModule}
                        onAddItem={handleAddItem}
                        onDeleteItem={handleDeleteItem}
                        onEditItem={handleEditItem}
                        moveModule={moveModule}
                        moveItem={moveItem}
                        moveItemWithinModule={moveItemWithinModule}
                      />
                    </div>
                  ))}

                  {searchTerm && standaloneItems.length > 0 && (
                    <div className="card p-6 bg-gray-800 rounded-lg shadow-md animate-slide-up">
                      <h3 className="text-2xl font-semibold mb-6 flex items-center gap-4 text-gray-100">
                        <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center">
                          <span className="text-xl">🔍</span>
                        </div>
                        Standalone Resources
                      </h3>
                      <div className="grid gap-4">
                        {standaloneItems.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between p-4 bg-gray-700 rounded-xl hover:bg-gray-600 transition-colors duration-200"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center shadow-sm">
                                <span className="text-gray-100 text-xl">
                                  {item.type === "link" ? "🔗" : "📄"}
                                </span>
                              </div>
                              <div>
                                <h4 className="font-semibold text-lg text-gray-100">{item.title}</h4>
                                {item.type === "link" && item.url && (
                                  <a
                                    href={item.url}
                                    className="underline text-blue-400 hover:text-blue-300 transition-colors"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {item.url}
                                  </a>
                                )}
                                {item.type === "file" && item.fileName && (
                                  <p className="text-gray-300 text-sm">
                                    {item.fileName} ({Math.round((item.fileSize || 0) / 1024)} KB)
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-3">
                              <button
                                onClick={() => handleEditItem(item)}
                                className="p-2 hover:bg-gray-600 rounded-lg text-gray-100"
                                title="Edit this item"
                              >
                                ✏️ <span className="sr-only">Edit</span>
                              </button>
                              <button
                                onClick={() => handleDeleteItem(item.id)}
                                className="p-2 hover:bg-gray-600 rounded-lg text-gray-100"
                                title="Delete this item"
                              >
                                🗑️ <span className="sr-only">Delete</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ModuleModal
        isOpen={isModuleModalOpen}
        onClose={() => handleClose("module")}
        onSave={handleSaveModule}
        module={currentModule}
        modules={modules}
        className="bg-gray-800 text-gray-100"
      />
      <LinkModal
        isOpen={isLinkModalOpen}
        onClose={() => handleClose("link")}
        onSave={handleSaveLink}
        moduleId={currentModuleId}
        className="bg-gray-800 text-gray-100"
      />
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => handleClose("upload")}
        onSave={handleSaveUpload}
        moduleId={currentModuleId}
        className="bg-gray-800 text-gray-100"
      />
      <EditLinkModal
        isOpen={isEditLinkModalOpen}
        onClose={() => handleClose("editLink")}
        onSave={handleUpdateItem}
        item={currentItem}
        className="bg-gray-800 text-gray-100"
      />
      <EditFileModal
        isOpen={isEditFileModalOpen}
        onClose={() => handleClose("editFile")}
        onSave={handleUpdateItem}
        item={currentItem}
        className="bg-gray-800 text-gray-100"
      />

      {/* Toasts */}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
          className="bg-gray-800 text-gray-100 border border-gray-600"
        />
      ))}
    </div>
  )
}

export default CourseBuilder