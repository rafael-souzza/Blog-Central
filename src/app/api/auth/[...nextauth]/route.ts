import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// No App Router, você exporta GET e POST a partir do handler
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
