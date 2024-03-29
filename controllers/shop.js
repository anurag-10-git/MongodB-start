const Product = require("../models/product");
const Cart = require("../models/cart");
const Order = require('../models/order');

exports.getProducts = (req, res, next) => {
  Product.find().populate('userId').then(products => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products'
    })
  }).catch(err => {
    console.log(err);
  })
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId).then(
    (product) => {
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title,
        path: "/products",
      });
    }).catch(err => {
      console.log(err);
    })
};

exports.getIndex = (req, res, next) => {
  Product.find().then(products => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });
  }).catch(err => {
    console.log(err);
  })
};

// exports.getCart = (req, res, next) => {
//   Cart.getCart((cart) => {
//     Product.fetchAll((products) => {
//       const cartProducts = [];
//       for (let product of products) {
//         const cartProductData = cart.products.find(
//           (prod) => prod.id === product.id
//         );
//         if (cartProductData) {
//           cartProducts.push({ productData: product, qty: cartProductData.qty });
//         }
//       }
//       res.render("shop/cart", {
//         path: "/cart",
//         pageTitle: "Your Cart",
//         products: cartProducts
//       });
//     });
//   });
// };

// exports.postCart = (req, res, next) => {
//   const prodId = req.body.productId;
//   Product.findById(prodId).then(product => {
//     Cart.addProduct(prodId, product.price);
//     res.redirect("/cart");
//   });
// };

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    path: "/orders",
    pageTitle: "Your Orders",
  });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, product => {
    Cart.deleteProduct(prodId, product.price);
    res.redirect('/cart');
  })
} 

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};

exports.postCart = (req,res,next) => {
  const prodId = req.body.productId;
 
  Product.findById(prodId).then(product => {
    return req.user.addToCart(product);
  }).then(result => {
      res.redirect('/cart');
    console.log(result);
  }).catch(err=> {
    console.log(err);
  })

  // let fetchCart;
  // let newQuantity = 1;
  // req.user.getCart().then(cart => {
  //   fetchCart = cart;
  //   return cart.getProducts({where: {id: prodId}})
  // }).then(products => {
  //   let product;
  //   if(products.length > 0) {
  //     product = products[0];
  //   }
  // })
}

//populate doesnot retrun a promise so using execPopulate
exports.getCart = (req, res, next) => {
  console.log('this is in getCart',req.user);
  req.user.populate('cart.items.productId')
  .then(user => {
    const products = user.cart.items;
    res.render('shop/cart', {
      path: '/cart',
      pageTitle: 'Your Cart',
      products: products
    });
  }).catch(err => console.log(err));
}

exports.postCartDeleteProduct = (req,res,next) => {
  const prodId = req.body.productId;
  req.user.removeFromCart(prodId).then(result =>{
      res.redirect('/cart');
    }).catch(err => console.log(err));
};

exports.postOrder = (req, res, next) => {
  req.user
  .populate('cart.items.productId')
  .then(user => {
    console.log("this is in orders",user.cart.items);
    const products = user.cart.items.map(i => {
      return { quantity: i.quantity, product: {...i.productId._doc } };//with _doc we get access to just data
    });

    const order = new Order({
      user:{
        name: req.user.name,
        userId: req.user
      },

      products: products
    });
    return order.save();
  }).then(result => {
    return req.user.clearCart();
  }).then(()=> {
    res.redirect('/orders'); 
  })
  .catch(err=>console.log(err));
}

exports.getOrders = (req, res, next) => {
  Order.find({'user.userId': req.user._id}).then(orders => {
    res.render('shop/orders',{
      path: '/orders',
      pageTitle: 'Your Orders',
      orders: orders
    })
  }).catch(err => console.log(err));
}