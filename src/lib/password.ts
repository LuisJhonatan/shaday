import bcrypt from "bcrypt";

export async function encryptPassword(password: string): Promise<string> {
  const encryptPassword = await bcrypt.hash(
    password,
    parseInt(process.env.SALT_ROUNDS!)
  );
  return encryptPassword;
}

export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  const equal = await bcrypt.compare(password, hash);
  return equal;
}
