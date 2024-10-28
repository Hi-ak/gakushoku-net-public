export const apiMethods = [
  "GET",
  "POST",
  "PUT",
  "DELETE",
  "PATCH",
  "HEAD",
  "OPTIONS",
] as const;
export type ApiMethod = (typeof apiMethods)[number];
