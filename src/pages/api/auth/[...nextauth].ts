import NextAuth, { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import GoogleProvider from 'next-auth/providers/google';
import prisma from '@/lib/prisma';

export const authOptions: NextAuthOptions = {
  debug: true,
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || '',
      clientSecret: process.env.GOOGLE_SECRET || '',
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    })
  ],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        if (!user?.email) {
          return false;
        }
        return true;
      } catch (error) {
        console.error('Sign in callback error:', error);
        return false;
      }
    },
    async session({ session, user }) {
      if (session?.user) {
        session.user.id = user.id;
      }
      return session;
    }
  },
  events: {
    signIn({ user, account, profile, isNewUser }) {
      console.log('Sign in event:', { user, account, isNewUser });
    },
    signOut({ session, token }) {
      console.log('Sign out event:', { session, token });
    },
    createUser({ user }) {
      console.log('Create user event:', user);
    },
    linkAccount({ user, account, profile }) {
      console.log('Link account event:', { user, account, profile });
    },
    session({ session, token }) {
      console.log('Session event:', { session, token });
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'database',
    maxAge: 30 * 24 * 60 * 60 // 30 days
  }
};

// For debugging purposes
if (process.env.NODE_ENV === 'development') {
  console.log('NextAuth configuration:', {
    hasGoogleId: !!process.env.GOOGLE_ID,
    hasGoogleSecret: !!process.env.GOOGLE_SECRET,
    hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
    hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
  });
}

export default NextAuth(authOptions);
