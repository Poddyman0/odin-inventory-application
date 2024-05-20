const itemModelController = require("../models/itemModel");
const categoryModelController = require("../models/categoryModel");
const { body, validationResult } = require("express-validator");


const asyncHandler = require("express-async-handler");

//like genre

exports.index = asyncHandler(async (req, res, next) => {
    // Get details of books, book instances, authors and genre counts (in parallel)
    const [
      numItems,
      numCategorys,
    ] = await Promise.all([
        itemModelController.countDocuments({}).exec(),
        categoryModelController.countDocuments({}).exec(),
    ]);
  
    res.render("index", {
      title: "Inventory Application Home",
      item_count: numItems,
      category_count: numCategorys,
    });
  });
// Display list of all items.
exports.items_list = asyncHandler(async (req, res, next) => {
    const allItems = await itemModelController.find({}, "name")
      .sort({ name: 1 })
      .exec();
  
    res.render("items_list", { title: "Items List", items_list: allItems });
  });
  

// Display detail page for a specific item.
exports.item_detail = asyncHandler(async (req, res, next) => {
    const [item] = await Promise.all([
        itemModelController.findById(req.params.id).populate("category").exec(),
    ]);
  
    if (item === null) {
      // No results.
      const err = new Error("Item not found");
      err.status = 404;
      return next(err);
    }
  
    res.render("item_detail", {
      item: item,
    });
  });
  

// Display item create form on GET.
exports.item_create_get = asyncHandler(async (req, res, next) => {
  const [allCetegorys] = await Promise.all([
    categoryModelController.find().sort({ name: 1 }).exec(),
  ]);

  res.render("item_form", {
    title: "Create Item",
    categorys: allCetegorys,
  });
});

// Handle item create on POST.
exports.item_create_post  = [
    // Convert the genre to an array.
    (req, res, next) => {
      if (!Array.isArray(req.body.category)) {
        req.body.category =
          typeof req.body.category === "undefined" ? [] : [req.body.category];
      }
      next();
    },
  
    // Validate and sanitize fields.
  body("name", "Name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Name must not be empty.")
    .escape(),
  body("description", "Description must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Description must not be empty.")
    .escape(),
  body("category.*")
      .escape(),
  body("price", "Price must not be empty.")
    .trim()
    .escape(),
  body("numberInStock", "numberInStock must not be empty")
      .trim()
      .escape(),
    // Process request after validation and sanitization.
  
    asyncHandler(async (req, res, next) => {
      // Extract the validation errors from a request.
      const errors = validationResult(req);
      const itemdetail = {
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        price: req.body.price,
        numberInStock: req.body.numberInStock,
      }

      // Create a Book object with escaped and trimmed data.
      const item = new itemModelController(itemdetail);
  
      if (!errors.isEmpty()) {
        // There are errors. Render form again with sanitized values/error messages.
  
        // Get all authors and genres for form.
        const [allCategorys] = await Promise.all([
            categoryModelController.find().sort({ name: 1 }).exec(),
        ]);
  
        // Mark our selected genres as checked.
        for (const category of allCategorys) {
          if (item.category.includes(category._id)) {
            category.checked = "true";
          }
        }

        res.render("item_form", {
          title: "Create Book",
          categorys: allCategorys,
          item: item,
          errors: errors.array(),
        });
      } else {
        // Data from form is valid. Save book.
        await item.save();
        res.redirect(item.url);
      }
    }),
  ];
  
// Display item delete form on GET.
exports.item_delete_get = asyncHandler(async (req, res, next) => {
  const [category, item, allCategorysInItem] = await Promise.all([
    categoryModelController.findById(req.params.id).exec(),
    itemModelController.findById(req.params.id).exec(),
    itemModelController.find({ name: req.params.id }, "name description").exec(),
  ]);
  
  if (item === null) {
    res.redirect("/catalog/items");
    return; // Added return statement to exit the function after redirect
  }
  
  res.render("item_delete", {
    title: "Delete Item",
    item: item,
    category: category,
    item_categorys: allCategorysInItem,
  });
});

// Handle item delete on POST.
exports.item_delete_post = [
  (req, res, next) => {
    if (!Array.isArray(req.body.category)) {
      req.body.category =
        typeof req.body.category === "undefined" ? [] : [req.body.category];
    }
    next();
  },
  body("password", "Password must be Password123!")
    .trim()
    .equals("Password123!")
    .withMessage("Password must be Password123!")
    .escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const [category, item, allCategorysInItem] = await Promise.all([
      categoryModelController.findById(req.params.id).exec(),
      itemModelController.findById(req.params.id).populate("category").exec(),
      itemModelController.find({ name: req.params.id }, "name description").exec(),
    ]);
    
    if (item === null) {
      res.redirect("/catalog/items");
      return; // Added return statement to exit the function after redirect
    }
    console.log("item", item)
    
    if (!errors.isEmpty()) {
      res.render("item_delete", {
        title: "Delete Item:",
        item: item,
        category: category,
        item_categorys: allCategorysInItem,
        errors: errors.array(),
      });
    } else {
      await itemModelController.findByIdAndDelete(req.body.itemid); // Corrected method to delete item
      res.redirect("/catalog/items");
    }
}),
]


// Display item update form on GET.
exports.item_update_get = asyncHandler(async (req, res, next) => {
    const [item, allCategorys] = await Promise.all([
        itemModelController.findById(req.params.id).populate("category").exec(),
        categoryModelController.find().sort({ name: 1 }).exec(),

    ]);
    if (item === null) {
      // No results.
      const err = new Error("Item not found");
      err.status = 404;
      return next(err);
    }

    
    allCategorys.forEach((category) => {
      item.category.forEach((itemCategory) => {
        let itemCategoryID = `${itemCategory._id}`
        let categoryID = `${category._id}`
        if (itemCategoryID === categoryID) {
          category.checked = "true";
          console.log("match")
        }
      })
    });
    
  
    res.render("item_update", {
      title: "Update Item",
      categorys: allCategorys,
      item: item,
    });
});


// Handle item update on POST.
exports.item_update_post = [
  // Convert the genre to an array.
  (req, res, next) => {
    if (!Array.isArray(req.body.category)) {
      req.body.category =
        typeof req.body.category === "undefined" ? [] : [req.body.category];
    }
    next();
  },

  // Validate and sanitize fields.
  body("name", "Name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Name must not be empty.")
    .escape(),
  body("description", "Description must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Description must not be empty.")
    .escape(),
  body("category.*")
      .escape(),
  body("price", "Price must not be empty.")
    .trim()
    .escape(),
  body("numberInStock", "numberInStock must not be empty")
      .trim()
      .escape(),
  body("password", "Password must be Password123!")
      .trim()
      .equals("Password123!")
      .withMessage("Password must be Password123!")
      .escape(),
  // Process request after validation and sanitization.

  asyncHandler(async (req, res, next) => {

    // Extract the validation errors from a request.
    const errors = validationResult(req);
    const itemdetail = {
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      numberInStock: req.body.numberInStock,
      _id: req.params.id,
    }

    // Create a Book object with escaped and trimmed data.
    const item = new itemModelController(itemdetail);

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get all authors and genres for form.
      const [allCategorys] = await Promise.all([
          categoryModelController.find().sort({ name: 1 }).exec(),
      ]);

      // Mark our selected genres as checked.
      for (const category of allCategorys) {
        if (item.category.includes(category._id)) {
          category.checked = "true";
        }
      }
      res.render("item_update", {
        title: "Update Item",
        categorys: allCategorys,
        item: item,
        errors: errors.array(),

      });
    } else {
      // Data from form is valid. Save book.
      const updatedItem = await itemModelController.findByIdAndUpdate(req.params.id, item, {});
      res.redirect(updatedItem.url);
    }
  }),
];
