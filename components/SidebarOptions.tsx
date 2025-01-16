"use client"

import { db } from "@/firebase"
import { doc } from "firebase/firestore"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useDocumentData } from "react-firebase-hooks/firestore"
import { FileText } from 'lucide-react'

function SidebarOption({ href, id }: { href: string; id: string }) {
  const [data, loading, error] = useDocumentData(doc(db, "documents", id))
  const pathname = usePathname()
  const isActive = href.includes(pathname) && pathname !== "/"

  if (!data) return null

  return (
    <Link
      href={href}
      className={`flex items-center gap-2 rounded-lg border border-transparent px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground ${
        isActive
          ? "bg-accent/60 font-medium text-accent-foreground"
          : "text-muted-foreground hover:text-primary"
      }`}
    >
      <FileText className="h-4 w-4" />
      <p className="truncate flex-1">{data.title}</p>
    </Link>
  )
}

export default SidebarOption

