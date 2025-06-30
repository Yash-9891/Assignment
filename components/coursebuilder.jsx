"use client"

import { useState, useRef, useEffect } from "react"
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

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  const moveModule = (fromIndex, toIndex) => {
    if (fromIndex === toIndex) return
    const updated = [...modules]
    const [moved] = updated.splice(fromIndex, 1)
    updated.splice(toIndex, 0, moved)
    setModules(updated)
    showToast("Module reordered successfully", "success")
  }

  const moveItem = (itemId, newModuleId) => {
    setItems((prev) => prev.map((item) => (item.id === itemId ? { ...item, moduleId: newModuleId } : item)))
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
      const newModule = {
        ...module,
        id: Date.now().toString(),
        isNew: true,
      }
      setModules((prev) => [...prev, newModule])
      showToast("Module created successfully", "success")
      setTimeout(() => {
        setModules((prev) => prev.map((m) => (m.id === newModule.id ? { ...m, isNew: false } : m)))
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

  const handleAddItem = (moduleId) => {
    setCurrentModuleId(moduleId)
  }

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
    if (item.type === "link") {
      setIsEditLinkModalOpen(true)
    } else {
      setIsEditFileModalOpen(true)
    }
  }

  const handleUpdateItem = (updatedItem) => {
    setItems((prev) => prev.map((item) => (item.id === updatedItem.id ? updatedItem : item)))
    showToast(`${updatedItem.type === "link" ? "Link" : "File"} updated successfully`, "success")
    handleClose(updatedItem.type === "link" ? "editLink" : "editFile")
  }

  const scrollToModule = (id) => {
    if (moduleRefs.current[id]) {
      moduleRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "center" })
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
    const moduleMap = new Map()

    modules.forEach((m) => {
      if (m.title.toLowerCase().includes(lower)) moduleMap.set(m.id, m)
    })

    items
      .filter((i) =>
        ["title", "url", "fileName"].some((key) => i[key]?.toString().toLowerCase().includes(lower)),
      )
      .forEach((i) => {
        const m = modules.find((mod) => mod.id === i.moduleId)
        if (m) moduleMap.set(m.id, m)
      })

    return Array.from(moduleMap.values())
  }

  const getFilteredItems = (moduleId) => {
    if (!searchTerm) {
      return moduleId ? items.filter((i) => i.moduleId === moduleId) : items.filter((i) => !i.moduleId)
    }

    const lower = searchTerm.toLowerCase()
    const filtered = items.filter((i) =>
      ["title", "url", "fileName"].some((key) => i[key]?.toString().toLowerCase().includes(lower)),
    )

    return moduleId ? filtered.filter((i) => i.moduleId === moduleId) : filtered.filter((i) => !i.moduleId)
  }

  const visibleModules = getVisibleModules()
  const standaloneItems = getFilteredItems()

  return (
    <div className="course-builder" ref={drop}>
      <Header
        onAddClick={handleAddClick}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        moduleCount={modules.length}
        itemCount={items.length}
      />

      <div className="content-with-fixed-header">
        <div className="flex flex-1 gap-6 relative">
          <Outline modules={modules} scrollToModule={scrollToModule} activeIndex={activeModuleId} />

          <div className="flex-1 ml-80">
            <div className="scrollable-content">
              {modules.length === 0 && !searchTerm ? (
                <EmptyState onAddClick={handleAddClick} />
              ) : (
                <div className="space-y-6 pb-8">
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
                        className={module.isNew ? "animate-fade-scale" : ""}
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
                    <div className="card p-6 animate-slide-up">
                      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                          <span className="text-lg">🔍</span>
                        </div>
                        Standalone Resources
                      </h3>
                      <div className="grid gap-4">
                        {standaloneItems.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                <span className="text-lg">{item.type === "link" ? "🔗" : "📄"}</span>
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900">{item.title}</h4>
                                {item.type === "link" && item.url && (
                                  <a
                                    href={item.url}
                                    className="text-sm text-blue-600 hover:underline"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {item.url}
                                  </a>
                                )}
                                {item.type === "file" && item.fileName && (
                                  <p className="text-sm text-gray-600">
                                    {item.fileName} ({Math.round((item.fileSize || 0) / 1024)} KB)
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEditItem(item)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                title="Edit"
                              >
                                ✏️
                              </button>
                              <button
                                onClick={() => handleDeleteItem(item.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                title="Delete"
                              >
                                🗑️
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
      />
      <LinkModal
        isOpen={isLinkModalOpen}
        onClose={() => handleClose("link")}
        onSave={handleSaveLink}
        moduleId={currentModuleId}
      />
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => handleClose("upload")}
        onSave={handleSaveUpload}
        moduleId={currentModuleId}
      />
      <EditLinkModal
        isOpen={isEditLinkModalOpen}
        onClose={() => handleClose("editLink")}
        onSave={handleUpdateItem}
        item={currentItem}
      />
      <EditFileModal
        isOpen={isEditFileModalOpen}
        onClose={() => handleClose("editFile")}
        onSave={handleUpdateItem}
        item={currentItem}
      />

      {/* Toasts */}
      {toasts.map((toast) => (
        <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  )
}

export default CourseBuilder
