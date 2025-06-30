"use client"

import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import CourseBuilder from "@/components/coursebuilder"

export default function Home() {
  return (
    <div className="app">
      <DndProvider backend={HTML5Backend}>
        <CourseBuilder />
      </DndProvider>
    </div>
  )
}
