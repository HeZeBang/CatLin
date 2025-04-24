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
    async jwt({ account, token, profile, session, trigger }) {
      const providerName = account?.provider;
      const providerId = account?.providerAccountId;
      const accountId = `${providerName}:${providerId}`;
      // console.log("JWT Callback Trigger:", trigger);
      // console.log("Account:", account);
      // console.log("Token:", token);
      // console.log("Profile:", profile);
      // console.log("Session:", session);

      if (trigger === "update" && session.user) {
        // token.user = session.user
        await connectToDatabase();
        let user = await User.findById(session.user._id);
        token.user = user
        // console.log("Account updated:", user);
      }

      if (profile) {
        await connectToDatabase();
        let user = await User.findOne({ account_id: accountId });
        console.log("User found:", user);
        if (!user) {
          console.log("Creating new user");
          user = new User({
            name: profile.name,
            account_id: accountId,
            level: 1,
            exp: 0,
            badges: [0],
            current_badge: 0,
          });
          await user.save();
        }
        token.user = user.toObject() as UserType; // Store user data in token
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user as UserType; // Populate session with user data
      // console.log("Token User: ", token)
      // console.log("Session User: ", session.user)
      return session;
    },
  },
} as AuthOptions;