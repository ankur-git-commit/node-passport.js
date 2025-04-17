import mongoose from "mongoose";
import colors from 'colors'

const connectDB = async () => {
    try {
        const baseURI = process.env.MONGO_URI
        const connt = await mongoose.connect(baseURI)
        console.log('Connection to MongoDB successful'.bgYellow)
    } catch (error) {
        console.log(`Connection Failed to MongoDB`.bgRed)
        console.log(error)
        process.exit(1)
    }
}

export default connectDB