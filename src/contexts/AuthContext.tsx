import React, { createContext, ReactNode } from 'react'

import { auth, firebase } from '../services/firebase'

type User = {
  id: string;
  name: string;
  avatar: string;
}

type AuthContextType = {
  user: User | undefined; // undefined cos' at first time the user is not logged in, so there is no info
  signInWithGoogle: () => Promise<void>; // don't return anything <void>
}

type AuthContextProviderProps = {
  children : ReactNode;
}

export const AuthContext = createContext({} as AuthContextType)

export function AuthContextProvider(props: AuthContextProviderProps) {
  const [user, setUser] = React.useState<User>()

  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if(user) {
        const {displayName, photoURL, uid} = user
  
        if(!displayName || !photoURL) {
          throw new Error('Missing information from Google Account.')
        }
  
        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL,
        })
      }
    })

    return () => {
      unsubscribe()
    }
  }, [])

  async function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    const result = await auth.signInWithPopup(provider)
    
    if(result.user) {
      const {displayName, photoURL, uid} = result.user

      if(!displayName || !photoURL) {
        throw new Error('Missing information from Google Account.')
      }

      setUser({
        id: uid,
        name: displayName,
        avatar: photoURL,
      })
    }
  }

  return (
    <AuthContext.Provider value={{ user, signInWithGoogle }}>
      {props.children}
    </AuthContext.Provider>
  )
}
