const countries = require('./routes/world');
const express = require('express');
const countryRoute = require('./routes/countryRoute');

const app = express();
const port = 3000;

//app.use(express.static(path.join(__dirname, 'public')));
app.use(countryRoute);


//listen to

app.listen(port, () => {
    console.log(`server running on port ${port}`)
})
/* 
app.post(
    '/',
    body('username').isEmail(),
    // password must be at least 5 chars long
    body('password').isLength({ min: 5 }),
    (req, res) => {
      // Finds the validation errors in this request and wraps them in an object with handy functions
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      User.create({
        username: req.body.username,
        password: req.body.password,
      }).then(user => res.json(user));
    },
  ); */