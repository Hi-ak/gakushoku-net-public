import { options } from "@/options";
import { Session, getServerSession } from "next-auth";
import { NumberedRole } from "../enums/role";
import { Role } from "@prisma/client";
import { notFound } from "next/navigation";
import { getSession } from "next-auth/react";

export const authorize = (expectedRole: Role, session: Session | null) => {
  if (!session) {
    return false;
  }
  return NumberedRole[session.user.role] >= NumberedRole[expectedRole];
};

export const authorizeSpecific = (
  expectedRole: Role,
  session: Session | null
) => {
  if (!session) {
    return false;
  }
  return session.user.role === expectedRole;
};
