import { Role } from "@prisma/client";

export interface User {
  id: string;
  cafeteriaId: string;
  role?: Role;
}
