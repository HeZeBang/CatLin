import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import connectToDatabase from "@/lib/mongodb";
import User, { UserType } from "@/models/user";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "your-client-id-here",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "your-client-secret-here",
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "your-client-id-here",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "your-client-secret-here",
    })
  ],
  callbacks: {
    async jwt({ token, profile }) {
      if (profile) {
        await connectToDatabase();
        let user = await User.findOne({ googleid: profile.sub });
        console.log("User found:", user);
        if (!user) {
          console.log("Creating new user");
          user = new User({
            name: profile.name,
            googleid: profile.sub,
            level: 1,
            exp: 0,
            badges: [0],
            currentBadge: 0,
          });
          await user.save();
        }
        token.user = user.toObject() as UserType; // Store user data in token
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user as UserType; // Populate session with user data
      return session;
    },
  },
} as AuthOptions;