export function isAdminSignupEnabled() {
  return process.env.NEXT_PUBLIC_ADMIN_SIGNUP_ENABLED === 'true';
}
