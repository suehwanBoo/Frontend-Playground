import {
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  getAuth,
  signOut,
} from "firebase/auth";
import { auth, db } from "../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export type providerType = "google" | "github";

function getProvider(provider: providerType) {
  let provideObject = null;
  switch (provider) {
    case "google":
      provideObject = new GoogleAuthProvider();
      break;
    case "github":
      provideObject = new GithubAuthProvider();
      break;
  }
  return provideObject;
}

export default async function signIn(provider: providerType) {
  const providerObject = getProvider(provider);
  if (!providerObject) throw new Error("Wrong provider!!");
  const res = await signInWithPopup(auth, providerObject);
  return res;
}

export async function sighOut() {
  const auth = getAuth();
  try {
    await signOut(auth);
  } catch {
    throw new Error("signout error occured!");
  }
}
export async function getIsAdmin(uid: string) {
  const adminRef = doc(db, "admin", uid);
  const adminState = await getDoc(adminRef);
  return adminState.exists() ? true : false;
}
