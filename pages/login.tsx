import { NextPage } from "next";
import Link from "next/link";
import router from "next/router";
import { FormEvent, useState } from "react"
import Layout from "../components/layout";

const Login: NextPage = () => {
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState('');
  const [state, changeState] = useState({
    username: '',
    password: '',
  })

  function onSubmit(event: FormEvent, state: { username: string; password: string }) {
    event.preventDefault();
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
          router.push('/');
        }
        else if (data.status === "error") {
          setShowError(!showError);
          setError(data.errors.join("\n"));
        }
      })
  }

  return (
    <Layout>
      <div className="login-page">
        <form className="form">
          <h1>Login</h1>

          <label htmlFor="username">Username</label>
          <input onChange={(event) => changeState({ ...state, username: event.target.value })} type="text" id="username" name="username" required />

          <label htmlFor="password">Password</label>
          <input onChange={(event) => changeState({ ...state, password: event.target.value })} type="password" id="password" name="password" required />

          <button className="submit-button" onClick={(event) => onSubmit(event, state)}>Log In</button>

          <p>No account? Sign Up</p>

          <Link href="/signup">
            <button className="submit-button">Sign up</button>
          </Link>

          {showError ? <p className="error">{error}</p> : <></>}
        </form>
      </div>
    </Layout>
  )
}

export default Login;