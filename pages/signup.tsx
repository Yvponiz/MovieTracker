import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react"

const SignUp: NextPage = () => {
  const router = useRouter();
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');
  const [state, changeState] = useState({
    username: '',
    email: '',
    password: '',
    confPassword: ''
  })

  function handleSubmit(event: FormEvent, state: { username: string; email: string; password: string, confPassword: string }) {
    event.preventDefault()
    fetch("/api/signup",
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
          if(showError){setShowError(!showError)}
          setShowSuccess(!showSuccess);
          setTimeout(()=> router.push('/login'), 1000);
        }
        else if (data.status === "erreur") {
          setShowError(!showError);
          setError(data.errors.join("\n"));
        }
      })
  }

  return (
    <div className="login-page">
      <form className="form">
        <h1>Signup</h1>

        <label htmlFor="username">Username</label>
        <input onChange={(event) => changeState({ ...state, username: event.target.value })} type="text" id="username" name="username" required />

        <label htmlFor="email">Email</label>
        <input onChange={(event) => changeState({ ...state, email: event.target.value })} type="text" id="email" name="email" required />

        <label htmlFor="password">Password</label>
        <input onChange={(event) => changeState({ ...state, password: event.target.value })} type="password" id="password" name="password" required />

        <label htmlFor="password">Confirm Password</label>
        <input onChange={(event) => changeState({ ...state, confPassword: event.target.value })} type="password" id="conf-password" name="conf-password" required />

        <button className="submit-button" onClick={(event) => handleSubmit(event, state)}>Sign up</button>
        
        {showError ? <p className="error">{error}</p> : <></>}
        {showSuccess ? <p className="success">Account Created</p> : <></>}
      </form>
    </div>
  )
}

export default SignUp;