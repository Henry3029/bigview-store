import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import dbConnect from "@/lib/mongodb";
import Store from "@/models/Store";
import Customer from "@/models/Customer";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      try {
        await dbConnect();
        
        const email = user.email?.toLowerCase();
        if (!email) return false;

        const nameParts = (user.name || 'Google User').split(' ');
        const firstName = nameParts[0] || 'Google';
        const surname = nameParts.slice(1).join(' ') || 'User';

        // Check if they exist as a customer or store owner
        const existingCustomer = await Customer.findOne({ email });
        const existingStore = await Store.findOne({ ownerEmail: email });

        // If they don't exist anywhere, default them safely as a customer 
        // (or handle routing based on your app flow)
        if (!existingCustomer && !existingStore) {
          await Customer.create({
            firstName,
            surname,
            email,
            passwordHash: 'GOOGLE_OAUTH_USER', // Safe for OAuth users
            role: 'customer',
          });
        }

        return true; 
      } catch (error) {
        console.error("Error saving Google user to MongoDB:", error);
        return false;
      }
    },

    // --- CRITICAL FOR PRODUCTION: Attach user details to the session ---
    async jwt({ token, user }) {
      if (user) {
        await dbConnect();
        const email = user.email?.toLowerCase();
        
        // Find out if they are an owner or customer to assign the correct role in token
        const store = await Store.findOne({ ownerEmail: email });
        const customer = await Customer.findOne({ email });

        token.role = store ? 'owner' : (customer?.role || 'customer');
        token.id = store?._id || customer?._id;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
