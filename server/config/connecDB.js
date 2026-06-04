import mongoose from "mongoose";

const connectDB = async ()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("Database is connected")
    } catch (error) {
        console.log('DataBase Error ${error}')
    }
}
export default connectDB