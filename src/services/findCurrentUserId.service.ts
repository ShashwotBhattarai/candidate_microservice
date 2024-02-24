import jwt from "jsonwebtoken";
export async function findCurrentuserId(acesstoken: string) {
  const token = acesstoken.slice(7);
  const decoded = jwt.verify(token, process.env.JWTSECRET as string) as {
    user_id: string;
  };
  const decodedUserId = decoded.user_id;
  return decodedUserId;
}
