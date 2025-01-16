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
import { deleteDocument, inviteUserToDocument } from '@/actions/action'
import {toast}  from "sonner";
import { Input } from './ui/input'
  
const InviteUser = () => {
    const [isOpen,setIsOpen] = useState(false)
    const [isPending,startTransition]=useTransition();
    const pathname = usePathname();
    const [email,setEmail] = useState("")
    const router = useRouter

    const handleInvite = async (e: FromEvent) =>{
        e.preventDefault();
        const roomId = pathname.split("/").pop();
        if(!roomId) return;
        startTransition(async () =>{
            const {success} = await inviteUserToDocument(roomId,email)
            if(success)
            {
                setIsOpen(false);
                setEmail('')
                toast.success("invite succesfully")
            }
            else{
                toast.error("error invite")
            }
        })
    }

  return (
<Dialog open={isOpen} onOpenChange={setIsOpen}>
    <Button asChild variant="outline">
    <DialogTrigger>Invite</DialogTrigger>
    </Button>
 
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Invite a User to collabrate</DialogTitle>
      <DialogDescription>
        Enter the email of the user you want to invite
      </DialogDescription>
    </DialogHeader>
    <form  className='flex-gap-2' onSubmit={handleInvite}>
    <Input
        type="email"
        placeholder="Email"
        className="w-full"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
    />
    <Button
        type="submit"
        disabled={!email || isPending}
    >
        {isPending ? "Inviting..." : "Invite"}
    </Button>
</form>


  </DialogContent>
</Dialog>   
  )
}

export default InviteUser
