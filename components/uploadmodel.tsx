"use client"

import type React from "react"
import { useState } from "react"
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

interface UploadModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (fileItem: Item) => void
  moduleId: string | null
}

const UploadModal = ({ isOpen, onClose, onSave, moduleId }: UploadModalProps) => {
  const [fileTitle, setFileTitle] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [error, setError] = useState("")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const validTypes = ["application/pdf", "image/jpeg", "image/png", "image/jpg"]
      if (!validTypes.includes(file.type)) {
        setError("Only PDF, JPEG, and PNG files are allowed.")
        setSelectedFile(null)
        return
      }
      if (file.size > 10 * 1024 * 1024) {
        setError("File size must be less than 10MB.")
        setSelectedFile(null)
        return
      }
      setError("")
      setSelectedFile(file)
      if (!fileTitle) {
        setFileTitle(file.name.split(".")[0])
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!fileTitle.trim() || !selectedFile) {
      setError("Please provide a title and select a file.")
      return
    }

    onSave({
      id: Date.now().toString(),
      moduleId,
      type: "file",
      title: fileTitle.trim(),
      fileName: selectedFile.name,
      fileSize: selectedFile.size,
      fileType: selectedFile.type,
    })

    setFileTitle("")
    setSelectedFile(null)
    setError("")
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md border-2 border-green-500">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Upload file</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="file-title" className="block text-sm font-medium text-gray-700 mb-2">
              File title
            </label>
            <input
              id="file-title"
              type="text"
              value={fileTitle}
              onChange={(e) => setFileTitle(e.target.value)}
              placeholder="File title"
              className="w-full px-3 py-2 border-2 border-green-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              autoFocus
            />
          </div>

          <div className="mb-4">
            <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-2">
              Select file
            </label>
            <input
              id="file-upload"
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png"
              className="w-full px-3 py-2 border-2 border-green-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            {selectedFile && (
              <div className="mt-2 text-sm text-gray-600">
                <span className="font-medium">{selectedFile.name}</span>
                <span className="ml-2">({Math.round(selectedFile.size / 1024)} KB)</span>
              </div>
            )}
            {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
          </div>

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
              disabled={!fileTitle.trim() || !selectedFile || !!error}
            >
              Upload
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UploadModal
