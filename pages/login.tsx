import { NextPage } from "next";
import Link from "next/link";
import { FormEvent, useState } from "react"

function onSubmit(event: FormEvent, state: { username: string; password: string }) {
  event.preventDefault()
  fetch("/api/login",
    {
      body: JSON.stringify(state),
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
    }).catch((response) => response.json())
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
        window.location.href = "/"
      }
      else if (data.status === "erreur") {
        window.alert(data.errors.join("\n"))
      }
    })
}

const Login: NextPage = () => {
  const [state, changeState] = useState({
    username: '',
    password: '',
  })

  return (
    
    <div className="login-page">
      <form className="form" action="/" method="post" onSubmit={(event) => onSubmit(event, state)}>
        <h1>Login</h1>

        <label htmlFor="username">Username</label>
        <input onChange={(event) => changeState({ ...state, username: event.target.value })} type="text" id="username" name="username" required />

        <label htmlFor="password">Password</label>
        <input onChange={(event) => changeState({ ...state, password: event.target.value })} type="password" id="password" name="password" required />

        <Link href='/' className="submit-button">
          <button type="submit">Connexion</button>
        </Link>

        <p>No account? Sign Up</p>

        <Link href="/signup" className="submit-button">
          <button>Sign up</button>
        </Link>
      </form>
    </div>
  )
}

export default Login;