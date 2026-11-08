import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import dbConnect from "@/lib/mongodb";
import Store from "@/models/Store";
import User from "@/models/User";

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

        // OPTION 1: If this sign-in is for a Store Owner
        // (You can check if they are registering or already own a store)
        let existingStore = await Store.findOne({ ownerEmail: email });

        if (!existingStore) {
          // Automatically create their store on first Google login
          await Store.create({
            name: `${firstName}'s Store`,
            firstName,
            surname,
            ownerEmail: email,
            passwordHash: 'GOOGLE_OAUTH_USER',
            profileUrl: user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(firstName + ' ' + surname)}&background=48BB78&color=fff`,
            bannerUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
          });
        }

        
          // OPTION 2: If you want to handle Customers separately, keep it in its own block:
          let existingCustomer = await User.findOne({ email });
          if (!existingCustomer) {
            await User.create({
              firstName,
              surname,
              email,
              passwordHash: 'GOOGLE_OAUTH_USER',
              role: 'customer',
            });
          }
       

        return true; // Allow sign-in to proceed successfully
      } catch (error) {
        console.error("Error saving Google user to MongoDB:", error);
        return false;
      }
    },
  },
});

export { handler as GET, handler as POST };
