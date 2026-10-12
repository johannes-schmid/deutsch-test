/** HTTP basic auth against ADMIN_PASSWORD (any username). No password set means no admin. */
export function isAdmin(authorization: string | null): boolean {
  const expected = process.env.ADMIN_PASSWORD
  if (!expected || !authorization?.startsWith("Basic ")) return false
  let given = ""
  try {
    given = atob(authorization.slice(6)).split(":").slice(1).join(":")
  } catch {
    return false
  }
  if (given.length !== expected.length) return false
  let diff = 0
  for (let i = 0; i < given.length; i++) diff |= given.charCodeAt(i) ^ expected.charCodeAt(i)
  return diff === 0
}
