import mongoose from "mongoose";
import dotenv from "dotenv";


dotenv.config();// Load environment variables from .env file
const connectionURL = process.env.CONNECTION_URL;

export const connectDB = async () => {
    try {
        await mongoose.connect(connectionURL, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

const recipeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    ingredients: { type: [String], required: true },
    instructions: { type: [String], required: true },
    cookingTime: { type: String, required: true },
}, { collection: "recepts_store" });

const Recipe = mongoose.model("recipe", recipeSchema);

export default Recipe;

