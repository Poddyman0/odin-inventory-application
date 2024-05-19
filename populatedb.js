#! /usr/bin/env node

console.log(
    'This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
  );
  
  const userArgs = process.argv.slice(2);
  
  const Category = require("./models/categoryModel");
  const Item = require("./models/itemModel");

  
  const categorys = [];
  const items = [];

  const mongoose = require("mongoose");
  mongoose.set("strictQuery", false);
  
  const mongoDB = userArgs[0];
  
  main().catch((err) => console.log(err));
  
  async function main() {
    console.log("Debug: About to connect");
    await mongoose.connect(mongoDB);
    console.log("Debug: Should be connected?");
    await createCategories();
    await createItems();

    console.log("Debug: Closing mongoose");
    mongoose.connection.close();
  }
  

  async function categoryCreate(index, name, description) {
    const category = new Category({ name: name, description: description, });
    await category.save();
    categorys[index] = category;
    console.log(`Added category: ${name}`);
  }
  
  async function itemCreate(index, name, description, category, price, numberInStock) {
    const itemdetail = {
      name: name,
      description: description,
      category: category,
      price: price,
      numberInStock: numberInStock,
    };
  
    const item = new Item(itemdetail);
    await item.save();
    items[index] = item;
    console.log(`Added item: ${name}`);
  }
  
  
  async function createCategories() {
    console.log("Adding categories");
    await Promise.all([
        categoryCreate(0, "Casual", "Casual wear encompasses comfortable and relaxed clothing suitable for everyday activities and informal occasions"),
        categoryCreate(1, "formal", "Formal attire refers to clothing suitable for events that require a higher level of elegance and sophistication"),
        categoryCreate(2, "Athletic", "Athletic gear comprises clothing designed for physical activity, exercise, and sports"),
    ]);
  }
 
  async function createItems() {
    console.log("Adding items");
    await Promise.all([
        itemCreate(0,
        "Shirt",
        "Long sleve white shirt",
        [categorys[1], categorys[0]],
        25,
        126,
      ),
      itemCreate(1,
        "Trainers",
        "Black running shoes with red laces",
        [categorys[2]],
        33,
        213,
      ),
      itemCreate(2,
        "Jeans",
        "Black skinny jeans with worn knees",
        [categorys[0]],
        23,
        432,
      ),
      itemCreate(3,
        "Jacket",
        "Black pinstripe jacket with silk pocket square",
        [categorys[1]],
        20,
        543,
      ),
      itemCreate(4,
        "Smart Trainers",
        "Black leather trainers",
        [categorys[1], categorys[2]],
        29,
        432,
      ),
      itemCreate(5,
        "Designer trainers",
        "Multicoloured trainers for a casual and athletic look",
        [categorys[0], categorys[2]],
        50,
        12,
      ),
      itemCreate(6,
        "Cap",
        "Blue and orrange baseball hat",
        [categorys[0]],
        15,
        234,
      ),
    ]);
  }
