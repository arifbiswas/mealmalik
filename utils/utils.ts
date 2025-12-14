// NOTE: Create this utility file in realm/auth-util.ts
// Replace with a proper hashing library like 'expo-crypto' in a real app.
// realm/auth-util.ts
export const fakeHash = (password: string) => password + "_HASHED";
export const fakeCompare = (input: string, hashed: string) =>
  input + "_HASHED" === hashed;
