export interface DemoAccount {
  id: string
  label: string
  description: string
  email: string
  password: string
  icon: "crown" | "user"
}

export const demoAccounts: DemoAccount[] = [
  {
    id: "admin",
    label: "Administrator",
    description: "Full access",
    email: "admin@example.com",
    password: "Admin123!",
    icon: "crown"
  },
  {
    id: "user",
    label: "Demo User",
    description: "Standard access",
    email: "user@example.com",
    password: "User123!",
    icon: "user"
  }
];
