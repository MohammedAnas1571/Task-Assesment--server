import bcrypt from "bcryptjs";
import { Admin } from "./modal/adminModal";
import dotenv from "dotenv";
import { connectToDatabase } from "./db_connection/mongoDB.js";
dotenv.config()


connectToDatabase();


const seedAdmin = async () => {
  try {
    const admin = process.env.ADMINEMAIL;
    const password = process.env.ADMINPASSWORD;

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password as string, salt);

    await Admin.create({
      email: admin,
      password: hashedPassword,
    });

    console.log("Admin created successfully");
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

seedAdmin();
