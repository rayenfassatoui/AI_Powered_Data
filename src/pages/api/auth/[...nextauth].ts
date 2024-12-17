import NextAuth, { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import GoogleProvider from 'next-auth/providers/google';
import prisma from '@/lib/prisma';

// Verify environment variables
const requiredEnvVars = {
  GOOGLE_ID: process.env.GOOGLE_ID,
  GOOGLE_SECRET: process.env.GOOGLE_SECRET,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  DATABASE_URL: process.env.DATABASE_URL,
};

// Log missing environment variables
Object.entries(requiredEnvVars).forEach(([key, value]) => {
  if (!value) {
    console.error(`Missing required environment variable: ${key}`);
  }
});

export const authOptions: NextAuthOptions = {
  debug: true,
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID ?? '',
      clientSecret: process.env.GOOGLE_SECRET ?? '',
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
        // Log the sign-in attempt
        console.log('Sign-in attempt:', {
          user: { id: user.id, email: user.email },
          account: { provider: account?.provider },
          hasProfile: !!profile
        });

        if (!user?.email) {
          console.error('Sign-in failed: No email provided');
          return false;
        }

        // Verify database connection
        try {
          await prisma.$connect();
          console.log('Database connection successful');
        } catch (dbError) {
          console.error('Database connection failed:', dbError);
          return false;
        }

        return true;
      } catch (error) {
        console.error('Sign-in callback error:', error);
        return false;
      }
    },
    async session({ session, user }) {
      try {
        if (session?.user) {
          session.user.id = user.id;
        }
        return session;
      } catch (error) {
        console.error('Session callback error:', error);
        return session;
      }
    },
    async jwt({ token, user }) {
      try {
        if (user) {
          token.id = user.id;
        }
        return token;
      } catch (error) {
        console.error('JWT callback error:', error);
        return token;
      }
    }
  },
  events: {
    async signIn(message) {
      console.log('Sign-in event:', message);
    },
    async signOut(message) {
      console.log('Sign-out event:', message);
    },
    async createUser(message) {
      console.log('Create user event:', message);
    },
    async linkAccount(message) {
      console.log('Link account event:', message);
    },
    async session(message) {
      console.log('Session event:', message);
    }
  },
  logger: {
    error(code, metadata) {
      console.error('Auth error:', { code, metadata });
    },
    warn(code) {
      console.warn('Auth warning:', { code });
    },
    debug(code, metadata) {
      console.log('Auth debug:', { code, metadata });
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'database',
    maxAge: 30 * 24 * 60 * 60 // 30 days
  }
};

// Add error handling to the NextAuth handler
const handler = async (req: any, res: any) => {
  try {
    return await NextAuth(req, res, authOptions);
  } catch (error) {
    console.error('NextAuth handler error:', error);
    res.status(500).json({ error: 'Internal authentication error' });
  }
};

export default handler;
