"use client"; // This marks the file as a client-side component (for Next.js)

import {
  ClientSideSuspense,
  RoomProvider as RoomProviderWrapper, // Import the RoomProvider from Liveblocks library
} from "@liveblocks/react/suspense";
import LiveCursorProvider from "./LiveCursorProvider"; // Custom component to handle live cursor functionality
import LoadingSpinner from "./LoadingSpinner"; // Loading spinner component for fallback UI

// RoomProvider component, which wraps the children inside a Liveblocks Room and provides live collaboration features.
function RoomProvider({
  roomId, // ID of the room to be used for the collaboration
  children, // Child components that will be rendered inside the room context
}: {
  roomId: string; // Type for roomId, which is a string
  children: React.ReactNode; // Type for children, which is a React node
}) {
  return (
    // RoomProviderWrapper from Liveblocks is used to wrap the children inside a room context
    <RoomProviderWrapper
      id={roomId} // The roomId is passed to associate with a specific collaboration room
      initialPresence={{
        cursor: null, // Initialize the cursor state (no cursor presence at the start)
      }}
    >
      {/* ClientSideSuspense is used to handle the loading state of the children. It will show the fallback UI (LoadingSpinner) while waiting for the room setup */}
      <ClientSideSuspense fallback={<LoadingSpinner />}>
        {/* LiveCursorProvider provides the live cursor feature to track and display user cursors */}
        <LiveCursorProvider>{children}</LiveCursorProvider>
      </ClientSideSuspense>
    </RoomProviderWrapper>
  );
}

export default RoomProvider;
