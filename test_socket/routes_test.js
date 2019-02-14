// require the Koa server
const server = require("../server_koa_2");
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

    	console.log("body ", body);
    const response = await
    request(server).post("/api/pub/security/createUser").send(body);
    expect(response.status).toEqual(200);
  expect(response.body.success).toEqual(true);
  });

});

describe("routes: forms", () => {
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
  test("add form", async() => {
      const body = {
        data: {
          _id: '',
          name: 'f2'
        },
        proxy: {
          module: "form",
          method: "add"
        }
      };
      console.log("TTTTTTTTTTTTTTTTTTTT", token);
      const response = await
      request(server).post("/api/private")
          .set('authorization', token)
          .send(body);
      expect(response.status).toEqual(200);
        expect(response.body.success).toEqual(true);
  });

	test("get form by name", async() => {
	    const body = {
	        data: {
	            _id: '',
	            name: 'f2'
	        },
	        proxy: {
	            module: "form",
	            method: "getByName"
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

	test("get forms", async() => {
	    const body = {
	        data: {
	            _id: '',
	            name: 'f2'
	        },
	        proxy: {
	            module: "form",
	            method: "getForms"
	        }
	    };

	    const response = await
	    request(server).post("/api/private")
	        .set('authorization', token)
	        .send(body);
	    expect(response.status).toEqual(200);
	    expect(response.body.success).toEqual(true);
	    console.log(response.body.data.length);
	});

	test("get paged", async() => {
	    const body = {
	        data: {
	            pager:{
	            	itemsOnPage: 5,
	            	pageNo: 1
	            }
	        },
	        proxy: {
	            module: "form",
	            method: "getPaged"
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


describe("routes: generic", () => {
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

  test("add item", async() => {
      const body = {
        data: {
          name: 'f2'
        },

        proxy: {
          module: "generic",
          method: "add",
          info: {
            collection : 'testttt',
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
  });

  test("findOne", async() => {
      const body = {
        data: {
          name: 'f2'
        },

        proxy: {
          module: "generic",
          method: "findOne",
          info: {
            collection : 'testttt',
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
          module: "generic",
          method: "findOne",
          info: {
            collection : 'testttt',
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
              module: "generic",
              method: "page",
              info: {
                collection : 'testttt',
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