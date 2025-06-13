const express = require("express");
const mongoose = require('mongoose');
const Product = require("./productModel");
// const Product = require("./productModel")
const app = express()
const PORT = process.env.PORT || 5500

// Middleware
app.use(express.json()); // Parse JSON body

// MongoDB
const MONGODB_URL = "mongodb+srv://judedev:Jude294gpngo@cluster0.i8vbsdc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

// Connecting to MongoDB

mongoose.connect(MONGODB_URL)
.then(()=>{
    console.log("MongoDB Connected...");

    // Server Listening
    app.listen(PORT, ()=>{
        console.log(`Server running on ${PORT}`);
    })
})

// Welcome API
app.get("/", (req, res)=>{
    res.json({message: "Welcome to Careerex Server"})
}) 

// Database Structure
// But in Node.js it is called schema and model

// MongoDB -> Define the date and how it should be saved

/*! Asysnc 
* aysnc -> asynchronous opposite is synchronous
* Synchronous function are normal function that run one after the other, one after the other. 

* await: Wait for the function to complete

** CRUD
*/

// To Get all the products in the Database 

// How to query a database
app.get("/all-product", async (req, res)=>{

    const allProducts = await Product.find()

    res.status(200).json({
        message: "Success",
        allProducts
    })
})

// Save date into the databaase directly
app.post("/create-product", async (req, res)=>{
    const {name, price, image, quantity, inStock } = req.body
    
    // Validate name and price
    if(!name || !price){
        return res.status(400).json({Message: "Please enter all fields."})
    }

    // Create New Product
    const newProduct = new Product({ name, price, image, quantity, inStock })
    await newProduct.save()

    res.status(200).json({
        message: "Success",
        newProduct
    })
})

// A primary key is a key that only that particular item has that key. No orther item can share that key. Only that particular data has that key. e.g. ids

// A foreign key is a key that can be shared. 

// Get/Find one product out the product list

// Params
app.get("/one-product/:id", async (req, res)=>{
    const { id } = req.params

    const product = await Product.findById(id)

    if(!product){
        return res.status(404).json({
            message: "Product not found."
        })
    }

    res.status(200).json({
        message: "Success",
        product
    })
})

// Update and Put

// Update: Use patch and put to update
app.put("/edit-product/:id", async (req, res)=>{
    const {id} = req.params

    const { name, price, image, quantity, inStock } = req.body

    const updatedProduct = await Product.findByIdAndUpdate(
        id, { name, price, image, quantity, inStock },
        {new: true}
    )

    res.status(200).json({
        message: "Success",
        updatedProduct
    })
})

// Edit selected data/ update one or two particular thing
app.patch("/update-product/:id", async (req, res)=>{
    const { id } = req.params

    const { name } = req.body

    const existingProduct = await Product.findById(id)

    if(existingProduct){
        existingProduct.name = name
        // existingProduct.price = price

        await existingProduct.save()
        return res.status(200).json({
            message: "Success",
            existingProduct
        })
    } else {
        res.status(404).json({message: "Product not found."})
    }
})

// Delete 
app.delete("/delete-product", async (req, res)=>{
    const { id } = req.body

    const deletedProduct = await Product.findByIdAndDelete(id)

    res.status(200).json({message: "Deleted Successfully."})
})