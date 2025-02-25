
// Production / Development

export function WrapUrl(path: string) {
  const URL_BASE = process.env.NODE_ENV === "production" ? "" : "http://localhost:3000"
  return URL_BASE + path.startsWith("/") ? path : "/" + path
}

export enum AccountType {
  Gradescope = "Gradescope",
  Blackboard = "Blackboard",
  ACM_OJ = "ACM OJ",
}

export function LoginAndSave(type: AccountType | null, username: string, password: string) {
  switch (type) {
    case AccountType.Gradescope:
      // Login to Gradescope
      break
    case AccountType.Blackboard:
      // Login to Blackboard
      break
    case AccountType.ACM_OJ:
      // Login to ACM OJ
      break
    default:
      break
  }
}