import mongoose from 'mongoose'

const connectDB = async () => {
  const dbUrl = process.env.MONGO_URI as string
  try {
    await mongoose.connect(dbUrl)
    console.log('Database successfully connected');
  } catch (error) {
    console.log(error);
    
  }
}


export default connectDB