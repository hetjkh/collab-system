// this will create a delete button and use the delete action that is  present in the action.ts
import React, { useState, useTransition } from 'react'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Button } from './ui/button'
import { usePathname, useRouter } from '@/node_modules/next/navigation'
import { deleteDocument } from '@/actions/action'
import {toast}  from "sonner";
  
const DeleteDocument = () => {
    const [isOpen,setIsOpen] = useState(false)
    const [isPending,startTransition]=useTransition();
    const pathname = usePathname();
    const router = useRouter

    const handleDelete = async () =>{
        const roomId =  pathname.split("/").pop();
        if(!roomId) return

        startTransition(async () =>{
            const {success} = await deleteDocument(roomId)
            if(success)
            {
                setIsOpen(false);
                toast.success("room deleted")
            }
            else{
                toast.error("error deleting")
            }
        })
    }

  return (
<Dialog open={isOpen} onOpenChange={setIsOpen}>
    <Button asChild variant="destructive">
    <DialogTrigger>Delete</DialogTrigger>
    </Button>
 
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Are you absolutely sure?</DialogTitle>
      <DialogDescription>
        This action cannot be undone. This will permanently delete your account
        and remove your data from our servers.
      </DialogDescription>
    </DialogHeader>
    <DialogFooter className="sm:justify-end gap-2">
    <Button
        type="button"
        variant="destructive"
        onClick={handleDelete}
        disabled={isPending}
    >
        {isPending ? "Deleting..." : "Delete"}
    </Button>
    <DialogClose asChild>
        <Button type="button" variant="secondary">
            Close
        </Button>
    </DialogClose>
</DialogFooter>

  </DialogContent>
</Dialog>   
  )
}

export default DeleteDocument
