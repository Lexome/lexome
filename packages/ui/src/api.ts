import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, where, getDocs, doc, getDoc, orderBy, setDoc, Timestamp, deleteDoc } from "firebase/firestore";
import { v4 as uuid } from 'uuid';
import { ANONYMOUS_USER_ID } from "./pages/Reader/EnhancementPanel/utils";
import { sendTextMessage } from "./sendMessage";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

export const truncate = (message: string) => 
  message.length > 80 ? `${message.slice(0, 80)}...` : message;

const firebaseConfig = {
  apiKey: "AIzaSyAaLjDaeUvDEJSLCBxGV1cuAJc37hk6mvo",
  authDomain: "lexome-903a2.firebaseapp.com",
  projectId: "lexome-903a2",
  storageBucket: "lexome-903a2.appspot.com",
  messagingSenderId: "347582481529",
  appId: "1:347582481529:web:7a5faa8dee21a83d1c00a8",
  measurementId: "G-1D6139EESN"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const store = getFirestore(app);
// const analytics = getAnalytics(app);

const DISCUSSION_THREAD_COLLECTION = 'discussion_threads'

export const addThread = async ({
  content,
  tagId,
  tagLabel,
  firstName,
  lastName,
  userId
}: {
  content: string;
  tagLabel?: string;
  firstName?: string;
  lastName?: string;
  tagId?: string;
  userId?: string
}) => {
  const newId = uuid();
  const newThreadDoc = doc(store, DISCUSSION_THREAD_COLLECTION, newId);
  await setDoc(newThreadDoc, {
    content,
    first_name: firstName || 'Anonymous',
    last_name: lastName || '',
    user_id: userId || ANONYMOUS_USER_ID,
    tag_id: tagId,
    timestamp: Timestamp.now(),
    messages: {}
  });
  const displayName = `${firstName || 'Anonymous'} ${lastName ? lastName + ' ' : ''}`;
  const tagDisplay = tagLabel ? ` regarding ${tagLabel}` : '';
  const link = `https://eleanorlives.lexome.com/?openPanel=1&route=/thread/${newId}`
  const message = `A new message thread was added to Eleanor Lives${tagDisplay}. ${displayName}wrote: ${truncate(content)}. Link to view message: ${link}`;
  sendTextMessage(message);
}

export type Thread = {
  id: string;
  content: string;
  first_name: string;
  last_name: string;
  userId: string;
  tag_id?: string;
  timestamp: Timestamp,
  messages: {
    [key: string]: ThreadMessage
  }
};

export type ThreadMessage = {
  id: string;
  content: string;
  first_name: string;
  last_name: string;
  user_id: string;
  timestamp: Timestamp;
};

export const addThreadMessage = async ({
  content,
  threadId,
  tagLabel,
  firstName,
  lastName,
  userId,
}: {
  threadId: string;
  content: string;
  tagLabel?: string;
  firstName?: string;
  lastName?: string;
  userId?: string
}) => {
  const thread = await getThread(threadId);
  const newId = uuid();
  const messages = thread.messages
  messages[newId] = {
    id: newId,
    first_name: firstName || 'Anonymous',
    last_name: lastName || '',
    content,
    timestamp: Timestamp.now(),
    user_id: userId || ANONYMOUS_USER_ID
  };

  const newThreadDoc = doc(store, DISCUSSION_THREAD_COLLECTION, threadId);
  await setDoc(newThreadDoc, {
    messages
  }, {
    merge: true
  });


  const displayName = `${firstName || 'Anonymous'} ${lastName ? lastName + ' ' : ''}`;
  const tagDisplay = tagLabel ? ` regarding ${tagLabel}` : '';
  const link = `https://eleanorlives.lexome.com/?openPanel=1&route=/thread/${threadId}`
  const message = `${displayName}replied to a comment on Eleanor Lives${tagDisplay}. They wrote: ${truncate(content)}. Use link to reply: ${link}`

  sendTextMessage(message);
};

export const deleteThread = async (id: string) => {
  const threadDoc = doc(store, DISCUSSION_THREAD_COLLECTION, id);
  await deleteDoc(threadDoc);
};

export const getLexomeUser = async({
  authId
}: {
  authId: string;
}) => {
  const userCollection = await collection(store, 'lexome_users');
  const userQuery = query(userCollection, where('auth_id', '==', authId))
  const snapshot = await getDocs(userQuery);
  let user;
  snapshot.forEach((result) => {
    const data = result.data();
    user = {
      id: result.id,
      ...data,
    };
  })

  if (user) {
    return user;
  }

  throw Error(`User with id: ${authId} not found`);
};

// const isCursorValid = (n?: number) => n !== undefined && n > -1;

export const getThreads = async ({
  tag
}: {
  tag?: string,
}): Promise<Thread[]> => {
  const threadCollection = await collection(store, 'discussion_threads');
  const threadQuery = query(
    threadCollection,
    where('tag_id', '==', tag),
    orderBy('timestamp', 'desc')
  )
  const snapshot = await getDocs(tag ? threadQuery : threadCollection);

  const threads: Thread[] = [];

  snapshot.forEach((document) => {
    const data = document.data() as Thread;
    threads.push({
      ...data,
      id: document.id,
    })
  })

  return threads;
};

export const getThread = async (id: string): Promise<Thread> => {
  const threadRef = doc(store, 'discussion_threads', id);
  const threadSnapshot = await getDoc(threadRef);
  const data = await threadSnapshot.data() as Thread;

  return {
    ...data,
    id: threadSnapshot.id,
  }
};

export const getTags = async () => {
  const tagCollection = collection(store, 'discussion_tags');
  const tagQuery = query(tagCollection, orderBy('index', 'asc'));
  const snapshot = await getDocs(tagQuery);
  const tags: any[] = [];

  snapshot.forEach(async result => {
    const data = await result.data();
    tags.push({
      ...data,
      id: result.id
    });
  })

  return tags;
}
