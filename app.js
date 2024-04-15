import express from 'express';
import dotenv from 'dotenv';
import Recipe from './models/schema.js';
import { connectDB } from './models/schema.js';

dotenv.config();

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));


// connect to MongoDB
connectDB();


// Implement a GET endpoint to retrieve all recipes
app.get('/api/recipes', async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Implement a GET endpoint to retrieve a specific recipe by title
app.get('/api/recipes/:title', async (req, res) => {
  try {
    const recipe = await Recipe.findOne({ title: req.params.title });
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Implement a POST endpoint to add a new recipe
app.post('/api/recipes', async (req, res) => {
  try {
    const newRecipe = new Recipe(req.body);//create a new recipe
    await newRecipe.save();//save the new recipe
    res.status(201).json(newRecipe);
  } catch (error) {
    res.status(409).json({ message: error.message });//
  }
});

// Implement a PUT endpoint to update an existing recipe by id
app.put('/api/recipes/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const updates = req.body;
      const recipe = await Recipe.findByIdAndUpdate(id, updates);//find the recipe by id and update it
      if (!recipe) {
        return res.status(404).json({ message: 'Recipe not found' });
      }
      res.json(recipe);//return the updated recipe
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  
// Implement a DELETE endpoint to delete a recipe by id
app.delete('/api/recipes/:id', async (req, res) => {
  try {
    const deleteRecipe = req.params.id;
    const recipe = await Recipe.findByIdAndDelete(deleteRecipe);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.json({ message: 'Recipe deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const port = 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
