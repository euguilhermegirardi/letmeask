import React, { FormEvent } from 'react'
import { useHistory } from 'react-router'

import '../styles/global.scss'
import '../styles/auth.scss'
import { useAuth } from '../hooks/useAuth'
import { database } from '../services/firebase'
import { Button } from '../components/Button'
import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'
import googleIconImg from '../assets/images/google-icon.svg'

export function Home() {
  const history = useHistory()
  const { user, signInWithGoogle } = useAuth()
  const [roomCode, setRoomCode] = React.useState('')

  async function handleCreateRoom() {
    if(!user) {
      await signInWithGoogle()
    }
    history.push('/rooms/new')
  }

  async function handleJoinRoom(event: FormEvent) {
    event.preventDefault()

    if(roomCode.trim() === '') return

    // .get() gets all data from the current room (rooms/${roomCode})
    const roomRef = database.ref(`rooms/${roomCode}`).get();
    // Case it returns 'false' it will be true "!roomRef"
    if(!(await roomRef).exists()) {
      alert('Room does not exists.')
      return
    }

    history.push(`/rooms/${roomCode}`)
  }

  return (
    <div id="page-auth">
      <aside>
        <img src={ illustrationImg } alt="illustration-home-page" />
        <strong>Crie salas da Q&amp;A ao-vivo</strong>
        <p>Tire as duvidas da sua audiencia em tempo-real</p>
      </aside>

      <main>
        <div className="main-container">
          <img src={ logoImg } alt="Letmeask" />
          <button className="create-room" onClick={ handleCreateRoom }>
            <img src={ googleIconImg } alt="google-icon" />
            Crie sua sala com o Google
          </button>
          <div className="separator">ou entre em uma sala</div>
          <form onSubmit={handleJoinRoom}>
            <input 
              type="text" 
              placeholder="Digite o codigo da sala"
              onChange={event => setRoomCode(event.target.value)}
              value={roomCode}
            />
            <Button type="submit">
              Entrar na sala
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}
