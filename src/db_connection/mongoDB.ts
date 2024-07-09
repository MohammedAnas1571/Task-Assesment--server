import mongoose from "mongoose"

 export const connectToDatabase = async () => {
    console.log(process.env.MONGODB_URI)
    try {
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log('Connected to MongoDB');
      } catch (error: any) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1)
      }
    };
