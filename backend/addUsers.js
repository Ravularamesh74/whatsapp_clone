const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const testUsers = [
  {
    username: 'alice',
    email: 'alice@example.com',
    password: 'Password123!',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice',
    status: 'online'
  },
  {
    username: 'bob',
    email: 'bob@example.com',
    password: 'Password123!',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob',
    status: 'online'
  },
  {
    username: 'charlie',
    email: 'charlie@example.com',
    password: 'Password123!',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=charlie',
    status: 'offline'
  },
  {
    username: 'diana',
    email: 'diana@example.com',
    password: 'Password123!',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=diana',
    status: 'online'
  },
  {
    username: 'emma',
    email: 'emma@example.com',
    password: 'Password123!',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma',
    status: 'offline'
  },
  {
    username: 'frank',
    email: 'frank@example.com',
    password: 'Password123!',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=frank',
    status: 'online'
  },
  {
    username: 'grace',
    email: 'grace@example.com',
    password: 'Password123!',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=grace',
    status: 'online'
  },
  {
    username: 'henry',
    email: 'henry@example.com',
    password: 'Password123!',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=henry',
    status: 'offline'
  }
];

async function addUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/whatsapp-clone');
    console.log('📦 Connected to MongoDB');

    // Clear existing users (optional - comment out to keep existing users)
    // await User.deleteMany({});
    // console.log('🗑️  Cleared existing users');

    // Add new users
    const createdUsers = await User.insertMany(testUsers, { ordered: false });
    console.log(`✅ Successfully added ${createdUsers.length} users!`);

    // Display added users
    console.log('\n📋 Created Users:');
    createdUsers.forEach((user) => {
      console.log(`  - ${user.username} (${user.email})`);
    });

    console.log('\n🔐 Password for all users: Password123!');
    console.log('✅ Ready to test the app!\n');

    process.exit(0);
  } catch (error) {
    if (error.code === 11000) {
      console.log('⚠️  Some users already exist in the database');
      console.log('Fetching existing users...\n');
      
      const existingUsers = await User.find({}).select('username email');
      console.log('📋 Existing Users:');
      existingUsers.forEach((user) => {
        console.log(`  - ${user.username} (${user.email})`);
      });
      
      console.log('\n💡 To add more users, modify the testUsers array or delete existing ones first');
      process.exit(0);
    } else {
      console.error('❌ Error adding users:', error.message);
      process.exit(1);
    }
  }
}

addUsers();
