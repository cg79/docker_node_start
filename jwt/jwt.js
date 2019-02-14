// Import jsonwebtoken
const jsonwebtoken = require("jsonwebtoken");
const responseWrapper = require('../utils/responseWrapper')();

const jwt = require("koa-jwt");

const config = require('../config/development');
const SECRET = "S3cRET~!";
const jwtInstance = jwt({secret: SECRET});

function JWTErrorHandler(ctx, next) {
  return next().catch((err) => {
      if (401 == err.status) {
    ctx.status = 401;
    ctx.body = {
      "error": "Not authorized"
    };
  } else {
    throw err;
  }
});
};

async function routeJwtMiddleware(ctx, next) {
  var authHeader = ctx.req.headers.authorization;
  // console.log(ctx.req.headers);
  var r = await jsonwebtoken.verify(authHeader, config.tokenPassword);
  ctx.request.body.tokenObj = r;


  return next().catch((err) => {
      throw err;
  });
};


async function mainMiddleware(ctx, next) {
  // debugger;
  // console.log("mainMiddleware");
  let response = null;
  try {
    // console.log("mainMiddleware");
    response = await next(); // next is now a function
    ctx.body = responseWrapper.success(response);
  } catch (err) {
    console.log("errrorrrrrrrrrrr");
    console.log(err);
    //ctx.status = 401;
    ctx.body = responseWrapper.failure(err);
  }
};

async function mainPrivateMiddleware(ctx, next) {
  // debugger;
  // console.log("mainPrivateMiddleware");
  var response = null;
  try {
    var authHeader = ctx.req.headers.authorization;
    var r = await jsonwebtoken.verify(authHeader, config.tokenPassword);
    ctx.request.body.tokenObj = r;

    response = await next(); // next is now a function
    ctx.body = responseWrapper.success(response);
  } catch (err) {
    console.log(err);
    //ctx.status = 401;
    ctx.body = responseWrapper.failure(err);
  }
};

async function probablyMiddleware(ctx, next) {
  // debugger;
  // console.log("mainPrivateMiddleware");
  var response = null;
  try {
    try {
      var authHeader = ctx.req.headers.authorization;
      var r = await
      jsonwebtoken.verify(authHeader, config.tokenPassword);
      ctx.request.body.tokenObj = r;
    }
    catch(xxx){}
    response = await next(); // next is now a function
    ctx.body = responseWrapper.success(response);
  } catch (err) {
    console.log(err);
    //ctx.status = 401;
    ctx.body = responseWrapper.failure(err);
  }
};

// helper function
module.exports.issue =  (payload) => {
  return jsonwebtoken.sign(payload, SECRET);
};
module.exports.jwt = () => jwtInstance;
module.exports.errorHandler = () => JWTErrorHandler;
module.exports.routeJwtMiddleware = () => routeJwtMiddleware;
module.exports.mainMiddleware = () => mainMiddleware;
module.exports.mainPrivateMiddleware = () => mainPrivateMiddleware;
module.exports.probablyMiddleware = () => probablyMiddleware;

