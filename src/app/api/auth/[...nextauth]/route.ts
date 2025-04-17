import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from 'next-auth/providers/credentials'
import connectToDatabase from "@/lib/mongodb";
import User, { UserType } from "@/models/user";
import { OAuth2Client } from "google-auth-library";
export const dynamic = "force-dynamic";
export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "your-client-id-here",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "your-client-secret-here",
    }),
    CredentialsProvider({
      name: 'GoogleToken',
      credentials: {
        token: { label: "Google ID Token", type: "text" },
      },
      async authorize(credentials, req) {
        const { token } = credentials as { token: string };
        if (!token) {
          throw new Error("No token provided");
        }
        // Verify the Google ID token
        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
        const ticket = await client.verifyIdToken({
          idToken: token,
          audience: process.env.GOOGLE_CLIENT_ID,
        });
        const profile = ticket.getPayload();
        if (!profile) {
          throw new Error("Invalid token");
        }
        return {
          id: profile.sub || "",
          name: profile.name || null,
          email: profile.email || null,
          image: profile.picture || null,
        };
      },
    })
  ],
  callbacks: {
    async jwt({ token, profile }) {
      if (profile) {
        await connectToDatabase();
        console.log("PROFILE:", profile);
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
        console.log("User found or created:", user);
        token.user = user.toObject(); // Store user data in token
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user as UserType; // Populate session with user data
      return session;
    },
  },
} as AuthOptions;

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };