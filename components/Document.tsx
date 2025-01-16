// this is the part where all main parts are coming like , editor , update button, deltete, invite
// managing user , avatars

import React, { FormEvent, useEffect, useState, useTransition } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import Editor from './Editor';
import useOwner from '@/lib/useOwner';
import DeleteDocument from './DeleteDocument';
import InviteUser from './InviteUser';
import ManageUsers from './ManageUsers';
import Avatars from './Avatars';

const Document = ({ id }: { id: string }) => {
  const [data, loading, error] = useDocumentData(doc(db, 'documents', id));
  const [input, setInput] = useState('');
  const [isUpdating, startTransition] = useTransition();
  const isOwner = useOwner();

  useEffect(() => {
    if (data) {
      setInput(data.title);
    }
  }, [data]);

  const updateTitle = (e: FormEvent) => {
    e.preventDefault();

    if (input.trim()) {
      startTransition(async () => {
        await updateDoc(doc(db, 'documents', id), {
          title: input,
        });
      });
    }
  };

  return (
    <div className="flex-1 h-full bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <form className="flex-1 flex space-x-2" onSubmit={updateTitle}>
              <Input 
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                className="bg-gray-50 focus:bg-white transition-colors"
                placeholder="Enter document title..."
              />
              <Button 
                disabled={isUpdating} 
                type="submit"
                className="min-w-[100px]"
              >
                {isUpdating ? 'Updating...' : 'Update'}
              </Button>
            </form>
            
            {isOwner && (
              <div className="flex items-center space-x-2">
                <InviteUser />
                <DeleteDocument />
              </div>
            )}
          </div>
        </div>

        {/* Users Section */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="w-full md:w-auto">
              <ManageUsers />
            </div>
            <div className="flex items-center justify-end w-full md:w-auto">
              <Avatars />
            </div>
          </div>
        </div>

        {/* Editor Section */}
        <div className="bg-white rounded-lg shadow-sm p-4 min-h-[500px]">
          <Editor />
        </div>
      </div>
    </div>
  );
};

export default Document;