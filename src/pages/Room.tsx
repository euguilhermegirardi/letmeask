import React, { FormEvent } from 'react'
import { useParams } from 'react-router-dom'

import '../styles/room.scss'
import { useAuth } from '../hooks/useAuth'
import logoImg from '../assets/images/logo.svg'
import { RoomCode } from '../components/RoomCode'
import { Button } from '../components/Button'
import { database } from '../services/firebase'

type RoomParams = {
  id: string;
}

export function Room() {
  const { user } = useAuth()
  const params = useParams<RoomParams>()
  const [newQuestion, setNewQuestion] = React.useState('')
  const roomId = params.id

  async function handleSendQuestion(event: FormEvent) {
    event.preventDefault()
  
    if(newQuestion.trim() === '') return

    if (!user) {
      throw new Error('You must be logged in')
    }

    const question = {
      content: newQuestion,
      author: {
        name: user.name,
        avatar: user.avatar
      },
      isHighlighted: false,
      isAnswered: false
    }

    await database.ref(`rooms/${roomId}/questions`).push(question)

    setNewQuestion('')
  }

  return (
    <div id="page-room"> 
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <RoomCode code={roomId} />
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala React</h1>
          <span>4 perguntas</span>
        </div>

        <form onSubmit={handleSendQuestion}>
          <textarea 
            placeholder="O que voce quer perguntar?"
            onChange={event => setNewQuestion(event.target.value)}
            value={newQuestion}
          />

          <div className="form-footer">
            <span>Para enviar uma pergunta, <button>faca seu login</button>.</span>
            <Button type="submit" disabled={!user}>Enviar pergunta</Button>
          </div>
        </form>
      </main>

    </div>
  )
}
