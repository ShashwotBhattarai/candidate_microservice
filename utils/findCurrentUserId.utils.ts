import jwt from "jsonwebtoken";
export function findCurrentuserId(acesstoken: string) {
  const token = acesstoken.slice(7);
  const decoded = jwt.verify(token, process.env.JWTSECRET as string) as {
    user_id: string;
  };
  const user_id = decoded.user_id;
  return user_id;
}
