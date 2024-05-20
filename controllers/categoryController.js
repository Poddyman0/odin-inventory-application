const categoryModelController = require("../models/categoryModel");
const itemModelController = require("../models/itemModel");
const { body, validationResult } = require("express-validator");

const asyncHandler = require("express-async-handler");

//like book

// Display list of all Category.
exports.categorys_list = asyncHandler(async (req, res, next) => {
    const allCategorys = await categoryModelController.find().sort({ name: 1 }).exec();
    res.render("categorys_list", {
      title: "Category List",
      categorys_list: allCategorys,
    });
  });

// Display detail page for a specific Category.
exports.category_detail = asyncHandler(async (req, res, next) => {
    // Get details of genre and all associated books (in parallel)
    const category = await categoryModelController.findById(req.params.id, "name description").exec();

    if (!category) {
        // No results.
        const err = new Error("Category not found");
        err.status = 404;
        return next(err);
    }
    console.log(category)

    const itemsInCategory = await itemModelController.find({ category: req.params.id }, "name description").populate('category').exec();

    res.render("category_detail", {
        title: "Category Detail",
        category: category,
        category_items: itemsInCategory,
    });
});
  // problem categoriesInItem, the other way round?

// Display Category create form on GET.
exports.category_create_get = (req, res, next) => {
  res.render("category_form", { title: "Create Category" });
};


// Handle Category create on POST.
exports.category_create_post = [
  // Validate and sanitize the name field.
  body("name", "Category name must contain at least 1 characters")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Category name must contain at least 1 characters")
    .escape(),
  body("description", "Category description must contain at least 1 characters")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Category description must contain at least 1 characters")
    .escape(),


  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a genre object with escaped and trimmed data.
    const category = new categoryModelController({ 
      name: req.body.name,
      description: req.body.description,
     });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("category_form", {
        title: "Create Category",
        category: category,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Check if Genre with same name already exists.
      const categoryExists = await categoryModelController.findOne({ name: req.body.name }).exec();
      if (categoryExists) {
        // Genre exists, redirect to its detail page.
        res.redirect(categoryExists.url);
      } else {
        await category.save();
        // New genre saved. Redirect to genre detail page.
        res.redirect(category.url);
      }
    }
  }),
];


// Display Category delete form on GET.
exports.category_delete_get = asyncHandler(async (req, res, next) => {
  // Get details of author and all their books (in parallel)
  const [category, allItemsInCategory] = await Promise.all([
    categoryModelController.findById(req.params.id).exec(),
    itemModelController.find({ category: req.params.id }, "name description").exec(),
  ]);

  if (category === null) {
    // No results.
    res.redirect("/catalog/categorys");
  }
  res.render("category_delete", {
    title: "Delete Category",
    category: category,
    category_items: allItemsInCategory,
  });
});


// Handle Category delete on POST.
exports.category_delete_post = [
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

    // Get details of author and all their books (in parallel)
    const [category, allItemsInCategory] = await Promise.all([
      categoryModelController.findById(req.params.id).exec(),
      itemModelController.find({ category: req.params.id }, "name description").exec(),
    ]);

    if (allItemsInCategory.length > 0) {
      // Author has books. Render in same way as for GET route.
      res.render("category_delete", {
        title: "Delete Category",
        category: category,
        category_items: allItemsInCategory,
      });
      return;
    } else if (!errors.isEmpty()) {
      res.render("category_delete", {
        title: "Delete Category",
        category: category,
        category_items: allItemsInCategory,
        errors: errors.array(),

      });
      return;
    } else {
      // Author has no books. Delete object and redirect to the list of authors.
      await categoryModelController.findByIdAndDelete(req.body.categoryid);
      res.redirect("/catalog/categorys");
    }
  }),
]


// Display Category update form on GET.
exports.category_update_get = asyncHandler(async (req, res, next) => {
  // Get details of genre and all associated books (in parallel)
  const category = await categoryModelController.findById(req.params.id, "name description").exec();

  if (!category) {
      // No results.
      const err = new Error("Category not found");
      err.status = 404;
      return next(err);
  }

  const itemsInCategory = await itemModelController.find({ category: req.params.id }, "name description").populate('category').exec();
  console.log("category:", category)
  res.render("category_update", {
      title: "Category Update",
      category: category,
      category_items: itemsInCategory,
  });
});

// Handle Category update on POST.
exports.category_update_post = [
  // Validate and sanitize the name field.
  body("name", "Category name must contain at least 1 characters")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Category name must contain at least 1 characters")
    .escape(),
  body("description", "Category description must contain at least 1 characters")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Category description must contain at least 1 characters")
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

    // Create a genre object with escaped and trimmed data.
    const category = new categoryModelController({ 
      name: req.body.name,
      description: req.body.description,
      _id: req.params.id,
     });
     console.log("description", req.body.description)

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("category_update", {
        title: "Category Update",
        category: category,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
        const updatedCategory = await categoryModelController.findByIdAndUpdate(req.params.id, category, {});
        // New genre saved. Redirect to genre detail page.
        res.redirect(updatedCategory.url);
    }
  }),
];
