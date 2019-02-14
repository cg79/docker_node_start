
const koa = require('koa');
const http = require('http');

const appRouter = require('koa-router')();

const lcPublicRoutes = require('./routes/public.routes');
const routesPrivate = require('./routes/routes.private');

const responseWrapper = require('./utils/responseWrapper')();

const co = require('co');
const fs = require('fs');
const colors = require('colors');
const path = require('path');
const send = require('koa-send');

const logger = require('koa-logger');
const BodyParser = require("koa-bodyparser");

const serve = require('koa2-static-middleware');
const cors = require('@koa/cors');
const cors1 = require('koa2-cors');

const config =  require('./config/development');
const mongo = require('./mongo/mongo');

const app = new koa();
app.use(cors());
app.use(BodyParser());
app.use(cors());
app.use(cors1());


appRouter.use(lcPublicRoutes.routes());
appRouter.use(routesPrivate.routes());


app.use(appRouter.routes()).use(appRouter.allowedMethods());

appRouter.get('/', serve('../dist', { index: 'index.html' }));

appRouter.get("/uploads/*", async function (ctx) {
  await send(ctx, ctx.path);
});


let server = null;
const port =  3001;



debugger;

initConnection = function (callback) {
	console.log(config);
    // var x = mongo();
    mongo.createMongoConnection()
        .then(() => {
        console.log('connected to database');
        server = app.listen(port).on("error",  err =>
          {
            console.log(err);
          });
        })
        .catch((ex) => {
            console.log(ex);
            process.exit(1);
        })
};

initConnection();


module.exports = server;
