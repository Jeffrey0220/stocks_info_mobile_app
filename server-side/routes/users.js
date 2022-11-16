var express = require("express");
var router = express.Router();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secretKey = "secret key";

/* GET users listing. */
router.get("/", async function (req, res, next) {
  res.send("respond with a resource");
});
// login endpoint
router.post("/login", async function (req, res, next) {
  const email = req.body.email;
  const password = req.body.password;
  /// check the email and password is not emty
  if (!email || !password) {
    res.status(400).json({
      error: true,
      message: "Request body incomplete - email and password needed",
    });
    return;
  }
  /// create the  variable to check if user in the database
  const queryUsers = await req.db
    .from("users")
    .select("*")
    .where("email", "=", email);
  /// check if it in the database or not
  if (queryUsers.length === 0) {
    console.log("Auth failed");
    // 401 unauthorise
    res.status(401).json({
      error: true,
      message: "Wrong Email or Password",
    });
    return;
  }
  /// set user email
  const user = queryUsers[0];
  const match = await bcrypt.compare(password, user.hash);

  if (!match) {
    res.status(401).json({ error: true, message: "Wrong Email or Password" });
    return;
  } else {
    const expires_in = 60 * 60 * 24;

    const exp = Date.now() + expires_in * 1000;

    const token = jwt.sign({ email, exp }, secretKey);
    res.status(200).json({
      token_type: "Bearer",
      token,
      expires_in,
      error: false,
      email: email,
    });
  }
});
// register end point
router.post("/register", async function (req, res, next) {
  const email = req.body.email;
  const password = req.body.password;
  // check the email format [ .....@ .... .]
  const filter =
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
  //password must have 8 charactor, 1 special charactor, 1 uppder and 1 number at least
  const filterPassword =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
  if (!email || !password) {
    res.status(400).json({
      error: true,
      message: "Request body incomplete - email and password needed",
    });
    return;
  }
  //test the email format
  if (filter.test(email) === false) {
    res.status(406).json({
      error: true,
      message: "Invalid Emailformat",
    });
  }
  // test the password format
  if (filterPassword.test(password) === false) {
    res.status(406).json({
      error: true,
      message:
        "Password must have minimum eight characters, at least one letter, one number and one special character",
    });
  }
  //checked user database
  const queryUsers = await req.db
    .from("users")
    .select("*")
    .where("email", "=", email);
  // if the user in the database rise error
  if (queryUsers.length > 0) {
    console.log("User already exists");
    res.status(409).json({
      error: true,
      message: "User already exists",
    });
    return;
  } else {
    const saltRounds = 10;
    // hash the password with bcrypt
    const hash = bcrypt.hashSync(password, saltRounds, (err, hash) => {
      if (err) {
        return res.status(500).json({
          error: err,
        });
      } else {
        return hash;
      }
    });
    //insert the user and password into database
    await req.db.from("users").insert({ email, hash });
    res
      .status(201)
      .json({ error: false, message: "Successfully inserted user" });
  }
});

router.get("/authorise", function (req, res, next) {
  const authorization = req.headers.authorization;
  let token;
  if (authorization && authorization.split(" ").length === 2) {
    token = authorization.split(" ")[1];
  } else {
    console.log("Unauthorized user");
  }

  try {
    const decode = jwt.verify(token, secretKey);
    if (decode.exp < Date.now()) {
      console.log("Token has expired");
      res.status(410).send({ Message: "The token is expired!", error: true });
    }
    res.status(200).send({ Message: "Success", data: decode, error: false });
  } catch (e) {
    console.log("Token is not valid", err);
    res.status(400).send({ Message: "The token is not valid!" });
  }
});

module.exports = router;
