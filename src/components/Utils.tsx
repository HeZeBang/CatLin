
// Production / Development

import { HomeworkItem } from "./HomeworkUtils"

export function WrapUrl(path: string) {
  const URL_BASE = process.env.NODE_ENV === "production" ? "" : "http://localhost:5000"
  return `${URL_BASE}${path.startsWith("/") ? path : "/" + path}`
}

export function SaveUserInfo(loginResponse: any) {
  localStorage.setItem('userInfo', JSON.stringify(loginResponse));
}

export function LoadUserInfo(){
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    return JSON.parse(userInfo);
  }
  return null;
}

export enum AccountType {
  Gradescope = "Gradescope",
  Blackboard = "Blackboard",
  ACM_OJ = "ACM OJ",
  Custom = "Custom"
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

export function SaveAssignment(type: AccountType, assignment: HomeworkItem) {
  const homework = LoadHomework(type)
  const index = homework.findIndex(hw => hw.course === assignment.course && hw.title === assignment.title)
  if (index !== -1) {
    homework[index] = assignment
  } else {
    homework.push(assignment)
  }
  console.log(homework)
  SaveHomework(type, homework)
}

export function RemoveAssignment(type: AccountType, assignment: HomeworkItem) {
  const homework = LoadHomework(type)
  const index = homework.findIndex(hw => hw.course === assignment.course && hw.title === assignment.title && hw.id === assignment.id)
  if (index !== -1) {
    homework.splice(index, 1)
  }
  SaveHomework(type, homework)
}

export function LoadHomework(type: AccountType) {
  const items = JSON.parse(localStorage.getItem(`${type.replace(" ", "_")}`) || "[]") as HomeworkItem[]
  items.forEach(item => { item.platform = `${type}` })
  return items
}

export function LoadUsername(type: AccountType) {
  return localStorage.getItem(`${type.replace(" ", "_")}_username`)
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
      return fetch(WrapUrl("/api/blackboard"), {
        method: 'POST',
        body: JSON.stringify({ studentid: username, password }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(response => response.json())
        .then(data => {
          if (data.status !== "success") {
            return new Error(data.message)
          }
          SaveAccount(type, username, password)
          return data.data
        })
        .catch((error => {
          // console.error('Error:', error);
          return error
        }))
    case AccountType.ACM_OJ:
      return new Error("Not Implemented")
    default:
      return new Error("Invalid Account Type")
  }
}