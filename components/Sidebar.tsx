"use client"

import React from "react"
import { useState, useEffect } from "react"
import NewDocumentButton from "./NewDocumentButton"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Menu } from 'lucide-react'
import { collectionGroup, query, where, DocumentData } from "firebase/firestore"
import { useCollection } from "react-firebase-hooks/firestore"
import { useUser } from "@clerk/nextjs"
import { db } from "@/firebase"
import SidebarOption from "./SidebarOptions"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
// Define the structure of the room document from Firestore
interface RoomDocument extends DocumentData {
  createdAt: string
  role: "owner" | "editor"
  roomId: string
  userId: string
}

const Sidebar = () => {
  const { user } = useUser()// Fetch the logged-in user's data
  const [groupedData, setGroupedData] = useState<{
    owner: RoomDocument[]// Rooms owned by the user
    editor: RoomDocument[]// Rooms shared with the user as an editor
  }>({
    owner: [],
    editor: [],
  })
    // Fetch rooms from Firestore where the logged-in user is a participant
  const [data, loading, error] = useCollection(
    user?.emailAddresses[0] &&
      query(
        collectionGroup(db, "rooms"),
        where("userId", "==", user.emailAddresses[0]?.toString())
      )
  )

  useEffect(() => {
    if (!data) return
     // Group rooms into "owner" and "editor" categories
    const grouped = data.docs.reduce<{
      owner: RoomDocument[]
      editor: RoomDocument[]
    }>(
      (acc, curr) => {
        const RoomData = curr.data() as RoomDocument
        if (RoomData.role === "owner") {
          acc.owner.push({
            id: curr.id,
            ...RoomData,
          })
        } else {
          acc.editor.push({
            id: curr.id,
            ...RoomData,
          })
        }
        return acc
      },
      {
        owner: [],
        editor: [],
      }
    )
    setGroupedData(grouped)
  }, [data])

  const menuOptions = (
    <div className="flex h-full flex-col">
      <div className="px-2 py-2">
        <NewDocumentButton />
      </div>
      <Separator className="mb-4" />
      <ScrollArea className="flex-1 px-2">
        <div className="space-y-6">
          <div className="space-y-2">
            {groupedData.owner.length === 0 ? (
              <h2 className="px-2 text-xs font-semibold tracking-tight text-muted-foreground">
                No documents found
              </h2>
            ) : (
              <>
                <h2 className="px-2 text-lg font-semibold tracking-tight">
                  My Rooms
                </h2>
                <div className="space-y-1">
                  {groupedData.owner.map((doc) => (
                    <SidebarOption key={doc.id} id={doc.id} href={`/doc/${doc.id}`} />
                  ))}
                </div>
              </>
            )}
          </div>

          {groupedData.editor.length > 0 && (
            <div className="space-y-2">
              <h2 className="px-2 text-lg font-semibold tracking-tight">
                Rooms Shared with me
              </h2>
              <div className="space-y-1">
                {groupedData.editor.map((doc) => (
                  <SidebarOption
                    key={doc.id}
                    id={doc.id}
                    href={`/doc/${doc.id}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )

  return (
    <div className="h-screen border-r bg-background">
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <button className="flex h-12 w-12 items-center justify-center rounded-lg hover:bg-accent">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle sidebar</span>
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <SheetHeader className="p-4">
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            {menuOptions}
          </SheetContent>
        </Sheet>
      </div>

      <div className="hidden h-full w-72 md:block">{menuOptions}</div>
    </div>
  )
}

export default Sidebar

