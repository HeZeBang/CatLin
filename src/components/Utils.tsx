
// Production / Development

import { HomeworkItem } from "./HomeworkUtils"

export function WrapUrl(path: string) {
  const URL_BASE = import.meta.env.MODE === "production" ? "" : "http://localhost:5000"
  return `${URL_BASE}${path.startsWith("/") ? path : "/" + path}`
}

export enum AccountType {
  Gradescope = "Gradescope",
  Blackboard = "Blackboard",
  ACM_OJ = "ACM OJ",
}

function SaveAccount(type: AccountType | null, username: string, password: string) {
  if (type === null) return false
  localStorage.setItem(`${type.replace(" ", "_")}_username`, username)
  localStorage.setItem(`${type.replace(" ", "_")}_password`, btoa(encodeURIComponent(password)))
  return true
}

export function SaveHomework(type: AccountType, hwList: HomeworkItem[]) {
  localStorage.setItem(`${type.replace(" ", "_")}`, JSON.stringify(hwList))
}

export function LoadHomework(type: AccountType) {
  return JSON.parse(localStorage.getItem(`${type.replace(" ", "_")}`) || "[]") as HomeworkItem[]
}

export function LoadAccount(type: AccountType | null) {
  if (type === null) return null
  const username = localStorage.getItem(`${type.replace(" ", "_")}_username`)
  const password = localStorage.getItem(`${type.replace(" ", "_")}_password`)
  const passwordDecoded = password ? decodeURIComponent(atob(password)) : null
  return { username, password: passwordDecoded }
}

export function LoginAndSave(type: AccountType | null, username: string, password: string) {
  switch (type) {
    case AccountType.Gradescope:
      return fetch(WrapUrl("/api/gradescope"), {
        method: 'POST',
        body: JSON.stringify({ email: username, password }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(response => response.json())
        .then(data => {
          if (data.status !== "success") {
            // console.error('Error:', data);
            return new Error(data.message)
          }
          // console.log('Success:', data.data);
          SaveAccount(type, username, password)
          return data.data
        })
        .catch((error => {
          // console.error('Error:', error);
          return error
        }))
    case AccountType.Blackboard:
      return new Error("Not Implemented")
    case AccountType.ACM_OJ:
      return new Error("Not Implemented")
    default:
      return new Error("Invalid Account Type")
  }
}