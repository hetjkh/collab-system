//this will create a new room

'use client';

import React from 'react'
import { Button } from './ui/button'
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createNewDocument } from '@/actions/action';

const NewDocumentbutton = () => {
  const [isPending,startTransition] = useTransition();
  const router = useRouter();
  const handleCreateNewDocument = () =>{
    startTransition(async () =>{
      const  {docId} = await createNewDocument();
      router.push(`/doc/${docId}`)
    });
  }

  return (
    <div>
      <Button onClick={handleCreateNewDocument} disabled={isPending}>{isPending ? "Creating " : "New Room"}</Button>
    </div>
  )
}

export default NewDocumentbutton
