var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");
/* GET home page. */

const secretKey = "secret key";
// the authorize function to check if the user have authorise to acces the application or not
const authorize = (req, res, next) => {
  const authorization = req.headers.authorization;
  let token;
  // check token setup token
  if (authorization && authorization.split(" ").length === 2) {
    token = authorization.split(" ")[1];
  } else {
    console.log("Unauthorized user");
    res.status(406).send("Unauthorized user");
  }

  try {
    // decode the JWT know what is email of the user check the date expire
    const decode = jwt.verify(token, secretKey);
    console.log(decode);
    // date checker
    if (decode.exp < Date.now()) {
      console.log("Token has expired");
      res.status(410).send({ Message: "The token is expired!", error: true });
    }
    next();
  } catch (e) {
    console.log("Token is not valid", err);
    res.status(400).send({ Message: "The token is not valid!" });
  }
};

router.get("/", authorize, function (req, res, next) {
  res.status(200).send({ Message: "Success", error: false });
});
// update the stock data in the watchlis database
router.post("/updates", authorize, async function (req, res, next) {
  const email = req.body.email;
  //Store data as string
  const stockData = JSON.stringify(req.body.data);
  // check user database
  const userStock = await req.db
    .from("watchList")
    .select("*")
    .where("email", "=", email);
  // check how many data they have
  try {
    if (userStock.length > 0) {
      await req.db
        .from("watchList")
        .update({ stockData: stockData })
        .where("email", "=", email);
      res.status(201).json({
        error: false,
        message: `Successfully update stock data into the database for user email: ${email}`,
      });
    } else {
      await req.db
        .from("watchList")
        .insert({ email: email, stockData: stockData });
      res.status(201).json({
        error: false,
        message: `Successfully inserted stock data into the database watchlist for  user email: ${email}`,
      });
    }
  } catch (e) {
    console.log(e);
  }
});
// getting watchlist from database
router.post("/stock", authorize, async function (req, res, next) {
  const email = req.body.email;
  try {
    let row = req.db
      .from("watchList")
      .select("stockData")
      .where("email", "=", email);
    res.status(200).json({
      Error: false,
      Message: "Success",
      stock: await row,
    });
  } catch (err) {
    console.log("SQL quert");
    res.status(500).json({ Error: true, Message: "Error in MySQL query" });
  }
});

module.exports = router;
