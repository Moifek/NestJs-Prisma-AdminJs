import { User } from "./user.model.js"

export interface Role {
    Name?: string
    Description?: string
    users?: User[]
  }