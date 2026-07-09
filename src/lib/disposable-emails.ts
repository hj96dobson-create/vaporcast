// Common disposable / temporary email domains. Not exhaustive but blocks the
// most common services used for throwaway signups.
export const DISPOSABLE_EMAIL_DOMAINS = new Set<string>([
  "10minutemail.com",
  "10minutemail.net",
  "tempmail.com",
  "temp-mail.org",
  "temp-mail.io",
  "guerrillamail.com",
  "guerrillamail.net",
  "guerrillamail.org",
  "guerrillamail.biz",
  "guerrillamail.de",
  "sharklasers.com",
  "mailinator.com",
  "mailinator.net",
  "mailinator2.com",
  "mailnesia.com",
  "yopmail.com",
  "yopmail.fr",
  "yopmail.net",
  "trashmail.com",
  "trashmail.net",
  "dispostable.com",
  "throwawaymail.com",
  "getnada.com",
  "nada.email",
  "maildrop.cc",
  "mintemail.com",
  "mytemp.email",
  "fakeinbox.com",
  "fakemailgenerator.com",
  "spam4.me",
  "spamgourmet.com",
  "spambox.us",
  "mohmal.com",
  "moakt.com",
  "emailondeck.com",
  "burnermail.io",
  "harakirimail.com",
  "tempinbox.com",
  "inboxbear.com",
  "mailcatch.com",
  "einrot.com",
  "wegwerfmail.de",
  "wegwerfemail.de",
]);

export function isDisposableEmail(email: string): boolean {
  const at = email.lastIndexOf("@");
  if (at === -1) return false;
  const domain = email
    .slice(at + 1)
    .toLowerCase()
    .trim();
  return DISPOSABLE_EMAIL_DOMAINS.has(domain);
}
