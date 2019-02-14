//https://scotch.io/tutorials/using-mongoosejs-in-node-js-and-mongodb-applications
//https://scotch.io/tutorials/authenticate-a-node-js-api-with-json-web-tokens#set-up-our-node-application-(package-json)


var q = require('q');
var logger = require("../../utils/logger/logger")();
var co = require('co');
const ObjectID = require("mongodb").ObjectID;
var mongo = require('../../mongo/mongo');
const jwt = require('jsonwebtoken');
const uuid = require('uuid');
const cryptoJS = require('node-cryptojs-aes').CryptoJS;
const encryption = require('../../utils/encryption')(cryptoJS, uuid);
const utilsService = require('../../utils/core.utils')();

const responseWrapper = require('../../utils/responseWrapper')();
const config = require('../../config/development');

class SecurityService {

    createUserResponse(obj) {
        var tokenObj = {
            email: obj.email,
            id: obj._id,
            permission: obj.permission
        };
        var token = jwt.sign(tokenObj, config.tokenPassword, {
            expiresIn: '245h'
        });
        var result = {
            id: obj._id,
            name: obj.firstName ? obj.firstName : obj.email.split("@")[0],
            email: obj.email,
            firstName: obj.firstName,
            lastName: obj.lastName,
            nick: obj.nick,
            address: obj.address,
            address_coord: obj.loc,
            avatar: obj.avatar,
            fbAvatar: obj.fbAvatar,
            genre: obj.genre,
            birth: obj.birth,
            phone: obj.phone,
            registered: obj.registered,
            token: token,
            permission: obj.permission,
            amount: obj.amount,
            userOrCompany: obj.userOrCompany,
            allowLogo: obj.allowLogo,
            companyName: obj.companyName,
            companyLogo: obj.companyLogo
        };
        if (obj.t) {
            result.t = obj.t;
        }
        return result;
    }

    async createToken(obj) {
        // obj.userId

        var user = await
        mongoQuery.collection("users").findOne({
            _id: new ObjectID(obj.userId),
        });
        if (!user) {
            throw {message: "user_not_found"};
        }

        var userResponse = models.createUserResponse(user);
        return userResponse;
    }

    async login(obj) {
        console.log(obj);
        if (!obj || !obj.login || !obj.password) {
            throw {message: "invalid_password1"};
            //return responseWrapper.sendResponse(false, null, "invalid_password", "");
        }
        //logger.log(mongoQuery);
        logger.log(JSON.stringify(obj).green);
        // var query = mongoQuery.userSchemas.Users.find({
        //     $or: [{
        //         'name': obj.Login
        //     }, {
        //         'email': obj.Login
        //     }]
        // });
        var user = await
        mongoQuery.collection("users").findOne({
            email: obj.login.toLowerCase()
        });
        // console.log("user8888888888888888888888");
        // var user = await mongoQuery.executeQuery(userCrit);
        // console.log("u");
        // console.log(user);
        if (!user) {
            throw {message: "no_user"};
            //return responseWrapper.sendResponse(false, null, "invalid_password1", "");
        }
        if (!obj.password) {
            throw {message: "no password"};
            //return responseWrapper.sendResponse(false, null, "invalid_password2", "");
        }

        var password = encryption.encrypt(obj.password, user.salt);

        //logger.log(password + " -- " + user.password);

        if (password != user.password) {
            throw {message: "invalid_password3"};
            // return responseWrapper.sendResponse(false, null, "invalid_password3", "");
        }

        var userResponse = models.createUserResponse(user);
        return userResponse;

        //return responseWrapper.sendResponse(true, userResponse, "", "");
    }

    async createUser(obj) {
        if (!obj || !obj.email) {
            throw {message: "no_email"};
        }
        if (!obj.password) {
            throw {message: "no_password"};
        }
        obj.email = obj.email.toLowerCase();

        var existentUserCriteria = mongoQuery.userSchemas.Users.findOne({
            'email': obj.email
        });

        const existentUser = await
        mongoQuery.executeQuery(existentUserCriteria);
        if (existentUser) {
            throw {message: "email_used"};
        }

        var salt = encryption.salt();
        var encryptedPassword = encryption.encrypt(obj.password, salt);
        var dbUser = new mongoQuery.userSchemas.Users({
            name: obj.login,
            email: obj.email,
            password: encryptedPassword,
            salt: salt,
            //guid: encryption.guid(),
            langId: obj.langId,
            confirmed: false,
            reset: encryption.guid(),
            companyName: obj.companyName,
            phone: obj.phone,
            firstName: obj.firstName,
            lastName: obj.lastName,
            userOrCompany: obj.userOrCompany,
            allowLogo: obj.allowLogo,
            created: new Date(),

            amount: {
                value: 10
            }
        });

        if (obj.files && obj.files.length > 0) {
            dbUser.companyLogo = obj.files[0].newFileName;
        }

        await
        dbUser.save();

        dbUser.langId = obj.langId;
        if (obj.sendEmail == undefined) {
            email.emailCreateUser(dbUser);
        }
        return await
        models.login({
            login: obj.email,
            password: obj.password
        });
    }


    async getUsers(obj, tokenObj) {

        // console.log(obj);
        const filterCriteria = {};


        const fields = {password: -1, 'salt': -1};

        var filter = mongoQuery.userSchemas.Users
            .find(filterCriteria);


        if (obj.pager) {
            obj.pager.itemsOnPage = parseInt(obj.pager.itemsOnPage);
            obj.pager.pageNo--;
            filter = filter.limit(obj.pager.itemsOnPage)
                .skip(obj.pager.itemsOnPage * obj.pager.pageNo)
                .sort({
                    created: -1
                });
            // query = query.sort({
            //   dateAdded: -1
            // });
        }
        // filter = filter.toArray();
        const list = await
        mongoQuery.executeQuery(filter);

        const count = await
        mongoQuery.collection('users').count(filterCriteria);
        return {
            items: list,
            count: count,
            pageNo: obj.pager ? obj.pager.pageNo + 1 : 0
        };
    }

    getUsers(obj, tokenObj) {

        // console.log(obj);
        const filterCriteria = {};


        const fields = {password: -1, 'salt': -1};

        var filter = mongoQuery.userSchemas.Users
            .find(filterCriteria);


        if (obj.pager) {
            obj.pager.itemsOnPage = parseInt(obj.pager.itemsOnPage);
            obj.pager.pageNo--;
            filter = filter.limit(obj.pager.itemsOnPage)
                .skip(obj.pager.itemsOnPage * obj.pager.pageNo)
                .sort({
                    created: -1
                });
            // query = query.sort({
            //   dateAdded: -1
            // });
        }
        // filter = filter.toArray();
        const list = await
        mongoQuery.executeQuery(filter);

        const count = await
        mongoQuery.collection('users').count(filterCriteria);
        return {
            items: list,
            count: count,
            pageNo: obj.pager ? obj.pager.pageNo + 1 : 0
        };
    }

}

module.exports = new SecurityService();

