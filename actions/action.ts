//This part ot code contains action of creating  a  document , delete a document ,
// inviting a user , removing a user from a document  

"use server";
import { deleteDocument } from '@/actions/action';
import liveblocks from "@/lib/Liveblocks";
import { adminDb } from "@/firebase-admin";
import { auth } from "@clerk/nextjs/server";

//this is used to create a  room and document  and we retrevie the details from the session claims(clerk)(which store the user session) as authenticated person 
//now we can default tittle as default room owner and title new doc and save it in firestore database
export async function createNewDocument() {
  // Retrieve session claims directly
  const { sessionClaims } = await auth();

  const docCollectionRef = adminDb.collection("documents");
  const docRef = await docCollectionRef.add({
    title: "New Doc", // Corrected "tittle" to "title"
  });
//this is will create a room
  await adminDb
    .collection("users")
    .doc(sessionClaims?.email!)
    .collection("rooms")
    .doc(docRef.id)
    .set({
      userId: sessionClaims?.email!,
      role: "owner",
      createdAt: new Date(),
      roomId: docRef.id,
    });

  return { docId: docRef.id };
}



//it is is use to delete a document

export async function deleteDocument(roomId: string) {
  //this will check authrization and authorized person to preform this action
  await auth.protect();

  console.log("deleteDocument", roomId);

  try {
    // Delete the document from the "Documents" collection in firestore
    await adminDb.collection("documents").doc(roomId).delete();

    // Query for rooms associated with the roomId
    const query = await adminDb
      .collectionGroup("rooms")
      .where("roomId", "==", roomId)
      .get();

    const batch = adminDb.batch();

    // Delete the room reference in the user's collection for every user in the room
    query.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    // Commit the batched deletion
    await batch.commit();

    // Delete the room from Liveblocks
    await liveblocks.deleteRoom(roomId);

    return { success: true };
  } catch (error) {
    console.error("Error deleting document:", error);
    return { success: false, error: error.message };
  }
}

//this is funtion use to invite user

export async function inviteUserToDocument(roomId: string, email: string) {
  //this will check authrization and authorized person to preform this action
  await  auth.protect(); 

  console.log("inviteUserToDocument", roomId, email);

  try {
      await adminDb
          .collection("users")// its access the user collection
          .doc(email)//identify the user email
          .collection("rooms")//acces the user "rooms"
          .doc(roomId)//use the document for room
          .set({
              userId: email,//place the user email
              role: "editor",//give hime roll editor
              createdAt: new Date(),//give hime a timespamt
              roomId,//give him  refrence the room Id
          });

      return { success: true };
  } catch (error) {
      console.error(error);
      return { success: false };
  }
}


//this is use to remove the the user from a document
export async function removeUserFromDocument(roomId: string, email: string) {
  //same a top two funtiom
  await auth.protect(); // Ensure the user is authenticated

  console.log("removeUserFromDocument", roomId, email);
  //this is the same process but in the end it will delete it  using delete function()
  try {
      await adminDb
          .collection("users")
          .doc(email)
          .collection("rooms")
          .doc(roomId)
          .delete();

      return { success: true };
  } catch (error) {
      console.error(error);
      return { success: false };
  }
}
