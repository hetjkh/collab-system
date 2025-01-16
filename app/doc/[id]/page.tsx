"use client";

import Document from '@/components/Document';
import React, { use } from 'react';

const DocumentPage = ({ params }: { params: Promise<{ id: string }> }) => {
  // Unwrap `params` with `React.use()`
  const { id } = use(params);

  return (
    <div className='flex flex-col flex-1 min-h-screen'>
      <Document id={id} />
    </div>
  );
};

export default DocumentPage;

