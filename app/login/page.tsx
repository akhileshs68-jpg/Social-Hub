"use client"

import { useState } from "react"

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from "firebase/auth"

import { auth } from "../../lib/firebase"

export default function LoginPage() {

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  // SIGNUP
  const signup = async () => {

    try {

      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        )

      // SAVE USER NAME
      await updateProfile(userCredential.user, {
        displayName: name
      })

      alert("Signup Success")

      window.location.href = "/"

    } catch (error: any) {

      alert(error.message)

    }

  }

  // LOGIN
  const login = async () => {

    try {

      await signInWithEmailAndPassword(
        auth,
        email,
        password
      )

      alert("Login Success")

      window.location.href = "/"

    } catch (error: any) {

      alert(error.message)

    }

  }

  return (

    <div
      style={{
        minHeight: "100vh",
        background: "#000",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        padding: "20px"
      }}
    >

      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "#111",
          padding: "30px",
          borderRadius: "20px",
          border: "1px solid #222",
          boxShadow: "0 0 20px rgba(255,0,255,0.2)"
        }}
      >

        <h1
          style={{
            textAlign: "center",
            marginBottom: "30px",
            fontSize: "35px",
            color: "#ff00ff"
          }}
        >
          Pi Social Hub
        </h1>

        {/* NAME */}
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter Name"
          style={{
            width: "100%",
            padding: "15px",
            marginBottom: "15px",
            borderRadius: "12px",
            border: "1px solid #333",
            background: "#1a1a1a",
            color: "white",
            outline: "none",
            fontSize: "16px"
          }}
        />

        {/* EMAIL */}
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter Email"
          type="email"
          style={{
            width: "100%",
            padding: "15px",
            marginBottom: "15px",
            borderRadius: "12px",
            border: "1px solid #333",
            background: "#1a1a1a",
            color: "white",
            outline: "none",
            fontSize: "16px"
          }}
        />

        {/* PASSWORD */}
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter Password"
          type="password"
          style={{
            width: "100%",
            padding: "15px",
            marginBottom: "25px",
            borderRadius: "12px",
            border: "1px solid #333",
            background: "#1a1a1a",
            color: "white",
            outline: "none",
            fontSize: "16px"
          }}
        />

        {/* LOGIN BUTTON */}
        <button
          onClick={login}
          style={{
            width: "100%",
            padding: "15px",
            marginBottom: "15px",
            borderRadius: "12px",
            border: "none",
            background: "#ff00ff",
            color: "white",
            fontSize: "17px",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          Login
        </button>

        {/* SIGNUP BUTTON */}
        <button
          onClick={signup}
          style={{
            width: "100%",
            padding: "15px",
            borderRadius: "12px",
            border: "none",
            background: "#222",
            color: "white",
            fontSize: "17px",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          Signup
        </button>

      </div>

    </div>

  )

}