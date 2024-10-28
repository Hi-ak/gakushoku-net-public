import { Role } from "@prisma/client";

export const NumberedRole = Object.freeze<{
  [key in Role]: number;
}>({
  USER: 0,
  ADMIN: 1,
  DEV: 2,
});
