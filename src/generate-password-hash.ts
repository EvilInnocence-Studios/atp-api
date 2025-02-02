import "dotenv/config";
import { User } from "./uac/user/service";

const newPassword = process.argv[2];
console.log(newPassword);

console.log(User.hashPassword(newPassword));