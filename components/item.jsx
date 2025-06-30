"use client"

import { useDrag } from "react-dnd"
import { ItemTypes } from "./ItemTypes"

const Item = ({ id, title, url, fileName }) => {
  /* ---------- DND ---------- */
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.ITEM,
    item: { id, type: ItemTypes.ITEM },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  /* ---------- UI ---------- */
  return (
    <div
      ref={drag}
      className={`p-3 border rounded bg-gray-50 mb-2 cursor-grab ${isDragging ? "opacity-50" : "hover:shadow"}`}
    >
      <h4 className="font-medium">{title}</h4>

      {/* show extra info if present */}
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
  )
}

export default Item
