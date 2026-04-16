import type { User, UserPermissions } from "./types";

/** Backend may return Mongo `_id`; normalize to `id` string. */
export function normalizeUser(raw: Record<string, unknown>): User {
  const id = raw.id ?? raw._id;
  const permissions =
    typeof raw.permissions === "object" && raw.permissions !== null
      ? (raw.permissions as UserPermissions)
      : {};

  return {
    id: String(id),
    email: String(raw.email ?? ""),
    firstName: String(raw.firstName ?? ""),
    lastName: String(raw.lastName ?? ""),
    phone: raw.phone !== undefined ? String(raw.phone) : undefined,
    timezone: raw.timezone !== undefined ? String(raw.timezone) : undefined,
    role: String(raw.role ?? "staff"),
    permissions,
    status: raw.status !== undefined ? String(raw.status) : undefined,
    profileImageUrl:
      raw.profileImageUrl !== undefined
        ? String(raw.profileImageUrl)
        : undefined,
    isOwner: Boolean(raw.isOwner),
  };
}
