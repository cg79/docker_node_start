// require the Koa server
const server = require("../server");
// require supertest
const request = require("supertest");
const ObjectID = require("mongodb").ObjectID;
// close the server after each test

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function getRndInteger(max) {
  return Math.floor(Math.random() * max);
}

function randomCharacters()
{
  function S4() {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
  }

// then to call it, plus stitch in '4' in the third group
  guid = (S4() + S4() + "-" + S4() + "-4" + S4().substr(0,3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
  return guid;
}
function generateEmail() {

  return randomCharacters()+ "@test.com";
}

function generatePassword() {

  return "pass -" +randomCharacters();
}

var token = null;

// afterEach(() => {
//   server.close();
// });

var auth = {};


function loginUser() {
  return async function() {
    const body = {
      login: "test@test.com",
      password: "test",
      sendEmail: false
    };
    const response = await request(server).post("/api/pub/security/login").send(body);
    expect(response.status).toEqual(200);
    expect(response.type).toEqual("application/json");
    // expect(response.type).toEqual("text/html");


    expect(response.body.message).toEqual("");
    expect(response.body.success).toEqual(true);


    token = response.body.data.token;
  };
}

describe("routes: index", () => {
  test("create user used for tests", async() => {
    const body = {
      email: generateEmail(),
      password: generatePassword(),
      sendEmail: false
    };

    const response = await
    request(server).post("/api/pub/security/createUser").send(body);
    expect(response.status).toEqual(200);
  });

});


describe("routes: directory", () => {
  beforeAll(async() => {
    var callLogin = async() => {
      //await new Promise(resolve => setTimeout(resolve, 500));
      if(token){
        return;
      }
    try {
      console.log('LOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO');
      const body = {
        login: "test@test.com",
        password: "test",
        sendEmail: false
      };
      const response = await request(server).post("/api/pub/security/login").send(body);
      expect(response.status).toEqual(200);
      expect(response.type).toEqual("application/json");

      expect(response.body.success).toEqual(true);


      token = response.body.data.token;
      // done();
      } catch (error) {
        console.log(error);
      }
  }
    await callLogin();
  });

  test("add directory", async() => {
      const body = {
        data: {
          name: 'f2'
        },

        proxy: {
          module: "directory",
          method: "add",
          info: {
            collection : 'topics',
          },
        }
      };
      console.log("TTTTTTTTTTTTTTTTTTTT", token);
      const response = await
      request(server).post("/api/private")
          .set('authorization', token)
          .send(body);
      expect(response.status).toEqual(200);
  });

  findById = async (id) => {
      const body = {
        data: {
          _id: id
        },

        proxy: {
          module: "directory",
          method: "findById",
          info: {
            collection : 'topics',
          },
        }
      };
      console.log("TTTTTTTTTTTTTTTTTTTT", token);
      const response = await
      request(server).post("/api/private")
          .set('authorization', token)
          .send(body);

      return response;
  }

  test("find by id directory", async() => {
      const diretoryName = generatePassword();
      const body = {
        data: {
          name: diretoryName
        },

        proxy: {
          module: "directory",
          method: "add",
          info: {
            collection : 'topics',
          },
        }
      };
      console.log("TTTTTTTTTTTTTTTTTTTT", token);
      const response = await
      request(server).post("/api/private")
          .set('authorization', token)
          .send(body);
      
      console.log(response.body);

      expect(response.status).toEqual(200);


      const addedDirectory = await findById(response.body.data);
      console.log(addedDirectory.body);
      expect(addedDirectory.body.data._id).toEqual(response.body.data);

  });


  test("findOne", async() => {
      const body = {
        data: {
          name: 'f2'
        },

        proxy: {
          module: "directory",
          method: "findOne",
          info: {
            collection : 'topics',
          },
        }
      };
      console.log("TTTTTTTTTTTTTTTTTTTT", token);
      const response = await
      request(server).post("/api/private")
          .set('authorization', token)
          .send(body);
      expect(response.status).toEqual(200);
        expect(response.body.success).toEqual(true);
        const data = response.body.data; 
        expect(data.name).toEqual('f2');
  });

  test("findOne sorted", async() => {
      const body = {
        data: {
          name: 'f2',
        },

        proxy: {
          module: "directory",
          method: "findOne",
          info: {
            collection : 'topics',
            sort: {
              added: 1
            }
          }

        }
      };
      console.log("TTTTTTTTTTTTTTTTTTTT", token);
      const response = await
      request(server).post("/api/private")
          .set('authorization', token)
          .send(body);
      expect(response.status).toEqual(200);
        expect(response.body.success).toEqual(true);
        const data = response.body.data; 
        expect(data.name).toEqual('f2');
  });
  

  test("get paged", async() => {
      const body = {
          data: {
              
          },
          proxy: {
              module: "directory",
              method: "page",
              info: {
                collection : 'topics',
                sort: [{
                  added: 1
                }],
                pager:{
                  itemsOnPage: 5,
                  pageNo: 1
                }
            }
          }
      };

      const response = await
      request(server).post("/api/private")
          .set('authorization', token)
          .send(body);
      expect(response.status).toEqual(200);
      expect(response.body.success).toEqual(true);
      console.log(response.body);
  });

});