import NextAuth, { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import GoogleProvider from 'next-auth/providers/google';
import prisma from '@/lib/prisma';

if (!process.env.GOOGLE_ID || !process.env.GOOGLE_SECRET) {
  throw new Error('Missing Google OAuth credentials');
}

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error('Missing NEXTAUTH_SECRET');
}

export const authOptions: NextAuthOptions = {
  debug: process.env.NODE_ENV === 'development',
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code"
        }
      }
    })
  ],
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      if (!user.email) {
        return false;
      }
      return true;
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  events: {
    async signIn({ user, account, profile }) {
      console.log('Successful sign-in', { 
        userId: user.id, 
        provider: account?.provider 
      });
    },
    async error(error) {
      console.error('Auth error:', error);
    }
  }
};

export default NextAuth(authOptions);
