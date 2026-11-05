require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Product = require('./models/Product');
const products = [
  {
    "legacyId": 1,
    "name": "T-shirt with tape details",
    "price": 120,
    "oldPrice": null,
    "discount": null,
    "rating": 4.0,
    "image": "/images/black-t-shirt.png",
    "category": "T-shirts",
    "description": "T-shirt with tape details \u2014 Shop.Co collection.",
    "sizes": [
      "Small",
      "Medium",
      "Large",
      "X-Large"
    ],
    "colors": [
      "Olive",
      "Teal",
      "Navy"
    ],
    "stock": 50,
    "isFeatured": true
  },
  {
    "legacyId": 2,
    "name": "Skinny Fit Jeans",
    "price": 240,
    "oldPrice": 260,
    "discount": "-20%",
    "rating": 3.5,
    "image": "/images/skinny-fit-jeans.png",
    "category": "Jeans",
    "description": "Skinny Fit Jeans \u2014 Shop.Co collection.",
    "sizes": [
      "Small",
      "Medium",
      "Large",
      "X-Large"
    ],
    "colors": [
      "Olive",
      "Teal",
      "Navy"
    ],
    "stock": 50,
    "isFeatured": false
  },
  {
    "legacyId": 3,
    "name": "Checkered Shirt",
    "price": 180,
    "oldPrice": null,
    "discount": null,
    "rating": 4.5,
    "image": "/images/checkered-shirt.png",
    "category": "Shirts",
    "description": "Checkered Shirt \u2014 Shop.Co collection.",
    "sizes": [
      "Small",
      "Medium",
      "Large",
      "X-Large"
    ],
    "colors": [
      "Olive",
      "Teal",
      "Navy"
    ],
    "stock": 50,
    "isFeatured": false
  },
  {
    "legacyId": 4,
    "name": "Sleeve Stripped T-shirt",
    "price": 130,
    "oldPrice": 160,
    "discount": "-30%",
    "rating": 4.5,
    "image": "/images/sleeve-stripped-t-shirt.png",
    "category": "T-shirts",
    "description": "Sleeve Stripped T-shirt \u2014 Shop.Co collection.",
    "sizes": [
      "Small",
      "Medium",
      "Large",
      "X-Large"
    ],
    "colors": [
      "Olive",
      "Teal",
      "Navy"
    ],
    "stock": 50,
    "isFeatured": false
  },
  {
    "legacyId": 51,
    "name": "Vertical Striped Shirt",
    "price": 212,
    "oldPrice": 232,
    "discount": "-20%",
    "rating": 5.0,
    "image": "/images/vertical-stripped-shirt.png",
    "category": "Shirts",
    "description": "Vertical Striped Shirt \u2014 Shop.Co collection.",
    "sizes": [
      "Small",
      "Medium",
      "Large",
      "X-Large"
    ],
    "colors": [
      "Olive",
      "Teal",
      "Navy"
    ],
    "stock": 50,
    "isFeatured": true
  },
  {
    "legacyId": 52,
    "name": "Courage Graphic T-shirt",
    "price": 145,
    "oldPrice": null,
    "discount": null,
    "rating": 4.0,
    "image": "/images/courage-graphic-t-shirt.png",
    "category": "T-shirts",
    "description": "Courage Graphic T-shirt \u2014 Shop.Co collection.",
    "sizes": [
      "Small",
      "Medium",
      "Large",
      "X-Large"
    ],
    "colors": [
      "Olive",
      "Teal",
      "Navy"
    ],
    "stock": 50,
    "isFeatured": true
  },
  {
    "legacyId": 53,
    "name": "Loose Fit Bermuda Shorts",
    "price": 80,
    "oldPrice": null,
    "discount": null,
    "rating": 3.0,
    "image": "/images/loose-fit-bermuda-shorts.png",
    "category": "Shorts",
    "description": "Loose Fit Bermuda Shorts \u2014 Shop.Co collection.",
    "sizes": [
      "Small",
      "Medium",
      "Large",
      "X-Large"
    ],
    "colors": [
      "Olive",
      "Teal",
      "Navy"
    ],
    "stock": 50,
    "isFeatured": false
  },
  {
    "legacyId": 54,
    "name": "Faded Skinny Jeans",
    "price": 210,
    "oldPrice": null,
    "discount": null,
    "rating": 4.5,
    "image": "/images/faded-skinny-jeans.png",
    "category": "Jeans",
    "description": "Faded Skinny Jeans \u2014 Shop.Co collection.",
    "sizes": [
      "Small",
      "Medium",
      "Large",
      "X-Large"
    ],
    "colors": [
      "Olive",
      "Teal",
      "Navy"
    ],
    "stock": 50,
    "isFeatured": true
  }
];
(async () => {
  try {
    await connectDB();
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log(`Inserted ${products.length} Shop.Co products from your frontend JSON.`);
  } catch (error) { console.error(error); process.exitCode = 1; }
  finally { await mongoose.disconnect(); }
})();
