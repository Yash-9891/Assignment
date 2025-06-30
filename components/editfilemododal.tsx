"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { X } from "lucide-react"

interface Item {
  id: string
  moduleId?: string | null
  type: "link" | "file"
  title: string
  fileName?: string
  fileSize?: number
  fileType?: string
}

interface EditFileModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (fileItem: Item) => void
  item: Item | null
}

const EditFileModal = ({ isOpen, onClose, onSave, item }: EditFileModalProps) => {
  const [fileTitle, setFileTitle] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    if (isOpen && item) {
      setFileTitle(item.title || "")
      setError("")
    }
  }, [isOpen, item])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!fileTitle.trim()) {
      setError("File title cannot be empty.")
      return
    }

    if (item) {
      onSave({
        ...item,
        title: fileTitle.trim(),
      })
    }

    setFileTitle("")
    setError("")
  }

  if (!isOpen || !item) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md border-2 border-green-500">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Edit file</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="edit-file-title" className="block text-sm font-medium text-gray-700 mb-2">
              File title
            </label>
            <input
              id="edit-file-title"
              type="text"
              value={fileTitle}
              onChange={(e) => setFileTitle(e.target.value)}
              placeholder="File title"
              className="w-full px-3 py-2 border-2 border-green-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              autoFocus
            />
            {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
          </div>

          {item.fileName && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <span className="font-medium">File:</span> {item.fileName}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Size:</span> {Math.round((item.fileSize || 0) / 1024)} KB
              </p>
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
              disabled={!fileTitle.trim() || !!error}
            >
              Update file
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditFileModal
