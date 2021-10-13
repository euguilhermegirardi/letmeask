import React from 'react'
import { AuthContext } from '../contexts/AuthContext'

export function useAuth() {
  const value = React.useContext(AuthContext)

  return value;
}
