const PBKDF2_ITERATIONS = 150_000;
const RECOVERY_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // excludes ambiguous I, O, 0, 1

function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary);
}

function base64ToBytes(base64: string): Uint8Array {
  const binary = atob(base64);
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}

export function randomSalt(): string {
  return bytesToBase64(crypto.getRandomValues(new Uint8Array(16)));
}

export async function deriveHash(value: string, saltBase64: string): Promise<string> {
  const encoder = new TextEncoder();
  const salt = base64ToBytes(saltBase64);
  const keyMaterial = await crypto.subtle.importKey("raw", encoder.encode(value), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: salt as BufferSource, iterations: PBKDF2_ITERATIONS, hash: "SHA-256" },
    keyMaterial,
    256
  );
  return bytesToBase64(new Uint8Array(bits));
}

export function generateRecoveryCode(): string {
  const groups: string[] = [];
  for (let g = 0; g < 4; g++) {
    const randomBytes = crypto.getRandomValues(new Uint8Array(5));
    let group = "";
    for (let i = 0; i < 5; i++) group += RECOVERY_ALPHABET[randomBytes[i] % RECOVERY_ALPHABET.length];
    groups.push(group);
  }
  return groups.join("-");
}

export function normalizeRecoveryCode(code: string): string {
  return code.trim().toUpperCase().replace(/\s+/g, "");
}
