import RoomProvider from "@/components/RoomProvider";
import { auth } from "@clerk/nextjs/server";

// Await params before using them
async function DocLayout({
  children,
  params,  // no need to destructure here, params is already awaited
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  // Protect the route, ensuring the user is authenticated
  await auth.protect();

  return <RoomProvider roomId={params.id}>{children}</RoomProvider>;
}

export default DocLayout;
