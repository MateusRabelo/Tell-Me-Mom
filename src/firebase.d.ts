declare module '@/firebase' {
  import type { Auth, User } from 'firebase/auth';
  import type { Firestore, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';

  export const auth: Auth;
  export const db: Firestore;
  
  export type FirestoreDoc = QueryDocumentSnapshot<DocumentData>;
  export type FirebaseUser = User;
} 