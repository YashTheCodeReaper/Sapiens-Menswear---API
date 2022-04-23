require("dotenv").config();
const app = require("./app.js");
const mysql2 = require("mysql2");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { promisify } = require("util");
const e = require("express");

// Database connection params
const dbConnection = mysql2.createConnection({
  host: "localhost",
  user: "root",
  database: "sapiensmenswear",
  password: "",
  port: 3306,
});

// Database connection establishment
dbConnection.connect((error) => {
  if (error) console.log(error);
  console.log("database connection established...");
});

// Creating server
app.listen(process.env.PORT || 3000, () => {
  console.log("server created at port: " + 3000 || process.env.PORT);
});

app.get("/getallproducts", (req, res) => {
  let queryString = `SELECT * FROM product`;

  dbConnection.query(queryString, (error, result) => {
    if (error) {
      console.log(error);
      return;
    }
    if (result.length > 0) {
      res.send({
        message: "Successfully got all products!",
        data: result,
      });
    }
  });
});

app.get("/getProduct/:id", (req, res) => {
  let queryString = `SELECT * FROM product WHERE id='${req.params.id}'`;

  dbConnection.query(queryString, (error, result) => {
    if (error) {
      res.send({
        status: "failed",
        message: "Internal Server Error",
      });
    }
    if (result) {
      res.send({
        status: "success",
        message: "Successfully got the product!",
        data: result,
      });
    } else {
      res.send({
        status: "failed",
        message: "product not found",
      });
    }
  });
});

app.get("/getUser/:id", (req, res) => {
  let queryString = `SELECT * FROM user WHERE id='${req.params.id}'`;

  dbConnection.query(queryString, (error, result) => {
    if (error) {
      res.send({
        status: "failed",
        message: "Internal Server Error",
      });
    }
    if (result) {
      res.send({
        status: "success",
        message: "Successfully got the user!",
        data: result,
      });
    } else {
      res.send({
        status: "failed",
        message: "User not found",
      });
    }
  });
});

app.get("/getallcategories", (req, res) => {
  let queryString = `SELECT * FROM category`;

  dbConnection.query(queryString, (error, result) => {
    if (error) {
      console.log(error);
      return;
    }
    if (result.length > 0) {
      res.send({
        message: "Successfully got all categories!",
        data: result,
      });
    }
  });
});

app.get("/getallcombos", (req, res) => {
  let queryString = `SELECT * FROM combo`;

  dbConnection.query(queryString, (error, result) => {
    if (error) {
      console.log(error);
      return;
    }
    if (result.length > 0) {
      res.send({
        message: "Successfully got all combos!",
        data: result,
      });
    }
  });
});

app.get("/getUserCart/:id", (req, res) => {
  let queryString = `SELECT cart FROM user WHERE id='${req.params.id}'`;

  dbConnection.query(queryString, (error, result) => {
    if (error) {
      res.send({
        status: "failed",
        message: "Internal Server Error",
      });
    }
    if (result) {
      res.send({
        status: "success",
        message: "Successfully got user cart!",
        data: result,
      });
    } else {
      res.send({
        status: "failed",
        message: "User not found",
      });
    }
  });
});

app.post("/updateUserCart", (req, res) => {
  let id = req.body.id;
  let cartItem = req.body.cartItem;

  let queryString = `UPDATE user SET cart='${cartItem}' WHERE id='${id}'`;

  dbConnection.query(queryString, (error, result) => {
    if (error) {
      res.send({
        status: "failed",
        message: "Internal Server Error",
      });
    }
    if (result) {
      res.send({
        status: "success",
        message: "Successfully updated user cart!",
        data: result,
      });
    } else {
      res.send({
        status: "failed",
        message: "User not found",
      });
    }
  });
});

app.post("/updateUser/:id", (req, res) => {
  let name = req.body.name;
  let email = req.body.email;
  let phone = req.body.phone;
  let country = req.body.country;
  let doorno = req.body.doorno;
  let locality = req.body.locality;
  let district = req.body.district;
  let state = req.body.state;
  let picture = req.body.picture;

  let queryString = `UPDATE user SET name='${name}',email='${email}',phone='${phone}',country='${country}',doorno='${doorno}',locality='${locality}',district='${district}',state='${state}',picture='${picture}' WHERE id='${req.params.id}'`;

  dbConnection.query(queryString, (error, result) => {
    if (error) {
      res.send({
        status: "failed",
        message: "Internal Server Error",
      });
    }
    if (result) {
      res.send({
        status: "success",
        message: "Successfully updated user!",
        data: result,
      });
    } else {
      res.send({
        status: "failed",
        message: "User not found",
      });
    }
  });
});

app.post("/insertUserCart/:id", (req, res) => {
  let cart = req.body.cart;
  let queryString = `INSERT INTO orders(orderid, id, products) VALUES (UUID(), '${req.params.id}','${cart}')`;

  dbConnection.query(queryString, (error, result) => {
    if (error) {
      res.send({
        status: "failed",
        message: "Internal Server Error",
      });
    }
    if (result) {
      res.send({
        status: "success",
        message: "Successfully updated user!",
        data: result,
      });
    } else {
      res.send({
        status: "failed",
        message: "User not found",
      });
    }
  });
});

app.get('/getCombo/:name', (req, res) => {
  let queryString = `SELECT * FROM combo WHERE name='${req.params.name}'`;

    dbConnection.query(queryString, (error, result) => {
      if (error) {
        res.send({
          status: "failed",
          message: "Internal Server Error",
        });
      }
      if (result) {
        res.send({
          status: "success",
          message: "Successfully got combo!",
          data: result,
        });
      } else {
        res.send({
          status: "failed",
          message: "User not found",
        });
      }
    });
})

app.get("/getUserOrders/:id", (req, res) => {
  let queryString = `SELECT * FROM orders WHERE id='${req.params.id}'`;

  dbConnection.query(queryString, (error, result) => {
    if (error) {
      res.send({
        status: "failed",
        message: "Internal Server Error",
      });
    }
    if (result) {
      res.send({
        status: "success",
        message: "Successfully got user orders!",
        data: result,
      });
    } else {
      res.send({
        status: "failed",
        message: "User not found",
      });
    }
  });
});

///////////////////////////////////
// Authentication Section
///////////////////////////////////

// function to create jwt token
const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
};

// cookieOptions object
const cookieOptions = {
  expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  httpOnly: true,
  secure: false,
};

// Enable secure cookie options if in production
if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

// function to create jwt token(signToken()) and send the response, set the jwt in the header
const createSendToken = (userid, statusCode, res) => {
  const token = signToken(userid);
  res.status(statusCode).json({
    status: "success",
    token,
    data: userid,
  });
};

// Register a new user
app.post("/registerUser", async (req, res) => {
  let {
    name,
    email,
    password,
    phone,
    country,
    doorno,
    locality,
    district,
    state,
    picture,
    cart,
    islogged,
  } = req.body;

  encryptedPassword = await bcrypt.hash(password, 12);

  let queryString = `INSERT INTO user (name, id, email, password, phone, country, doorno, locality, district, state, picture, cart, islogged) VALUES ('${name}', UUID(), '${email}', '${encryptedPassword}', '${phone}', '${country}', '${doorno}', '${locality}', '${district}', '${state}', '${picture}', '[]', '${islogged}');`;

  dbConnection.query(queryString, (error, result) => {
    if (error) {
      res.send({
        status: "failed",
        message: "Internal Server Error",
      });
      return;
    }
    if (result) {
      let queryString = `SELECT id FROM user WHERE email = '${email}'`;
      dbConnection.query(queryString, (error, result) => {
        if (error) {
          res.send({
            status: "failed",
            message: "Internal Server Error",
          });
          return;
        }
        if (result) {
          createSendToken(result[0].id, 200, res);
        } else {
          res.send({
            status: "failed",
            message: "Internal Server Error",
          });
        }
      });
    } else {
      res.send({
        status: "failed",
        message: "User could not be registered",
      });
    }
  });
});

const checkPassword = async (loginPassword, registeredPassword) => {
  return await bcrypt.compare(loginPassword, registeredPassword);
};

// Login a user
app.post("/loginUser", (req, res) => {
  let { email, password } = req.body;
  let user;
  let isAuthorized;

  let queryString = `SELECT * FROM user WHERE email='${email}'`;

  dbConnection.query(queryString, async (error, result) => {
    if (error) {
      res.send({
        status: "failed",
        message: "Internal Server Error",
      });
      return;
    }
    if (result.length) {
      user = result[0];
      if (user) {
        isAuthorized = await checkPassword(password, user.password);
        if (isAuthorized) {
          createSendToken(user.id, 200, res);
        } else {
          res.send({
            status: "failed",
            message: "Invalid Password!",
          });
        }
      } else {
        res.send({
          status: "failed",
          message: "User not found!",
        });
      }
    } else {
      res.send({
        status: "failed",
        message: "User with that email id not found",
      });
    }
  });
});

// User Login Validation
app.get("/validateUserLogin/:token", async (req, res) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  } else {
    token = req.params.token;
  }

  if (!token || token == "notoken") {
    res.send({
      status: "failed",
      message: "You are not logged in! Please login again!",
    });
    return;
  }

  const decodedToken = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );

  let queryString = `SELECT * FROM user WHERE id='${decodedToken.id}'`;

  dbConnection.query(queryString, (error, result) => {
    if (error) {
      res.send({
        status: "failed",
        message: "Wront Token / Internal Server Error!",
      });
    }
    if (result) {
      res.send({
        status: "success",
        message: "User already logged in!",
        data: result,
      });
    } else {
      res.send({
        status: "failed",
        message: "Wrong token / Internal Server Error",
      });
    }
  });
});
