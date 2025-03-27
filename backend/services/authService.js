const db = require("../models");
const bcrypt = require("bcrypt");
const {
  createResponseSuccess,
  createResponseError,
  createResponseMessage,
} = require("../helpers/responseHelper");
const seedDatabase = require("../seeders/dbSeed");

async function login(credentials) {
  try {
    if (!credentials.email || !credentials.password) {
      return createResponseError(400, "Email and password are required");
    }

    const user = await db.user.findOne({ where: { email: credentials.email } });
    
    if (!user) {
      return createResponseError(401, "Invalid email or password");
    }
    
    // Handle case for users that might not have a password set yet or have plain text password
    if (!user.password || !user.password.startsWith('$2b$')) {
      // Hash the password (for first login or migrating old passwords)
      const hashedPassword = await bcrypt.hash(credentials.password, 10);
      await user.update({ 
        password: hashedPassword,
        role: user.role || 'customer' 
      });
      
      const userDetails = {
        id: user.id,
        email: user.email,
        f_name: user.f_name,
        l_name: user.l_name,
        role: user.role || 'customer'
      };
      
      return createResponseSuccess(userDetails);
    }
    
    // Compare password with hashed password
    const passwordMatch = await bcrypt.compare(credentials.password, user.password);
    if (!passwordMatch) {
      return createResponseError(401, "Invalid email or password");
    }

    // Don't send the password back to the client
    const userDetails = {
      id: user.id,
      email: user.email,
      f_name: user.f_name,
      l_name: user.l_name,
      role: user.role || 'customer'
    };

    return createResponseSuccess(userDetails);
  } catch (error) {
    return createResponseError(error.status || 500, error.message);
  }
}

// Add user registration functionality
async function register(userData) {
  try {
    if (!userData.email || !userData.password || !userData.f_name || !userData.l_name) {
      return createResponseError(400, "Email, password, first name, and last name are required");
    }

    // Check if user already exists
    const existingUser = await db.user.findOne({ where: { email: userData.email } });
    if (existingUser) {
      return createResponseError(409, "A user with this email already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    // Create new user with customer role by default
    const newUser = await db.user.create({
      email: userData.email,
      password: hashedPassword,
      f_name: userData.f_name,
      l_name: userData.l_name,
      role: 'customer' // Default role for new users
    });

    // Return user data without password
    const userDetails = {
      id: newUser.id,
      email: newUser.email,
      f_name: newUser.f_name,
      l_name: newUser.l_name,
      role: newUser.role
    };

    return createResponseSuccess(userDetails);
  } catch (error) {
    return createResponseError(error.status || 500, error.message);
  }
}

// Reset database function for admins
async function resetDatabase() {
  try {
    // Call the database seeding function
    await seedDatabase(true); // Pass true to force repopulate products
    return createResponseMessage(200, "Database reset successfully");
  } catch (error) {
    return createResponseError(500, "Failed to reset database: " + error.message);
  }
}

module.exports = {
  login,
  register,
  resetDatabase
};
