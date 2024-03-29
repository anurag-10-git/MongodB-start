const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const errorController = require('./controllers/error');
// const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('63ac410edaefabecdd1e335c')
    .then(user => {
      console.log(user);
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404);

mongoose.set("strictQuery", false);
mongoose.connect("mongodb+srv://anurag:R3DfiPAZnt78pkg8@clusters.nmumkwm.mongodb.net/shop?retryWrites=true&w=majority").then(result =>{
  User.findOne().then(user => {
    if(!user){
      const user = new User({
        name: 'Anurag',
        email: 'anurag@gmail.com',
        cart: {
          items: []
        }
      });
      user.save();
    }
    });
  app.listen(3000);
}).catch(err => {
  console.log(err);
})
