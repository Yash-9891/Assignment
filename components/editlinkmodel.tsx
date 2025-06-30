"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { X } from "lucide-react"

interface Item {
  id: string
  moduleId?: string | null
  type: "link" | "file"
  title: string
  url?: string
}

interface EditLinkModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (item: Item) => void
  item: Item | null
}

const EditLinkModal = ({ isOpen, onClose, onSave, item }: EditLinkModalProps) => {
  const [linkTitle, setLinkTitle] = useState("")
  const [linkUrl, setLinkUrl] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    if (isOpen && item) {
      setLinkTitle(item.title || "")
      setLinkUrl(item.url || "")
      setError("")
    }
  }, [isOpen, item])

  const isValidUrl = (url: string) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!linkTitle.trim()) {
      setError("Link title cannot be empty.")
      return
    }

    if (!isValidUrl(linkUrl.trim())) {
      setError("Please enter a valid URL (e.g., https://example.com).")
      return
    }

    if (item) {
      onSave({
        ...item,
        title: linkTitle.trim(),
        url: linkUrl.trim(),
      })
    }

    setLinkTitle("")
    setLinkUrl("")
    setError("")
  }

  if (!isOpen || !item) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md border-2 border-green-500">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Edit link</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="edit-link-title" className="block text-sm font-medium text-gray-700 mb-2">
              Link title
            </label>
            <input
              id="edit-link-title"
              type="text"
              value={linkTitle}
              onChange={(e) => setLinkTitle(e.target.value)}
              placeholder="Link title"
              className="w-full px-3 py-2 border-2 border-green-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              autoFocus
            />
          </div>

          <div className="mb-4">
            <label htmlFor="edit-link-url" className="block text-sm font-medium text-gray-700 mb-2">
              URL
            </label>
            <input
              id="edit-link-url"
              type="text"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-3 py-2 border-2 border-green-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
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
              disabled={!linkTitle.trim() || !linkUrl.trim() || !!error}
            >
              Update link
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditLinkModal
