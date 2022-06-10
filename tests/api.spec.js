const request = require("supertest");
const app = require("../app");
const truncate = require('../helpers/truncate')

describe("GET /api/v1/", () => {
  it("should return status success and meessage welcome to the challenge4 API", async () => {
    try {
      const res = await request(app).get("/api/v1/");
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe(true);
      expect(res.body.message).toBe("Selamat datang!");
    } catch (err) {
      expect(err.statusCode).toBe(500);
    }
  });
});

describe("Test user without token or token invalid", () => {
  it("should return 401 if user not logged in", async () => {
    try {
      const res = await request(app).get("/api/v1/users");

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty("status", "error");
      expect(res.body).toHaveProperty("message", "No token provided!");
    } catch (err) {
      expect(err.message).toEqual("Error")
    }
  });

  it("should return 401 if token is invalid", async () => {
    try {
      const res = await request(app)
        .get("/api/v1/users")
        .set("auth", "secretsecret");

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty("status", "error");
      expect(res.body).toHaveProperty("message", "Invalid token");
    } catch (err) {
      expect(err.statusCode).toBe(500);
    }
  });
});

describe("Test end-point create user", () => {
  const data = {
    username: "johndoe",
    password: "doe123",
  };
  it("should return 400 if username or password is empty", async () => {
    try {
      const res = await request(app).post("/api/v1/users").send({
        username: "",
        password: "",
      });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("status", "Error");
      expect(res.body).toHaveProperty("message", "Please fill all the fields");
    } catch (err) {
      throw err
    }
  });

  it("should return 201 if user created successfully", async () => {
    try {
      await truncate.user();
      const res = await request(app).post("/api/v1/users").send(data);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("status", "Success");
      expect(res.body).toHaveProperty("message", "User created successfully");
      expect(res.body).toHaveProperty("data");
      expect(res.body.data.username).toBe("johndoe");
      expect(res.body.data.password).toBe("doe123");
    } catch (err) {
      expect(err.statusCode).toBe(500);
    }
  });
});

describe("Test end-point get all user", () => {
  it("should return 200 and all user data", async () => {
    try {
      const res = await request(app).get("/api/v1/users").set("auth", "secret");

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("status", "Success");
      expect(res.body).toHaveProperty(
        "message",
        "Users retrieved successfully"
      );
    } catch (err) {
      expect(err.statusCode).toBe(500);
    }
  });
});

describe("Test end-point get user detail", () => {
  const data = {
    username: "johndoe",
    password: "doe123",
  };
  it("should return 200 and user detail", async () => {
    try {
      const res = await request(app)
        .get("/api/v1/users/1")
        .set("auth", "secret");

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("status", "Success");
      expect(res.body).toHaveProperty(
        "message",
        "User data retrieved successfully"
      );
      expect(res.body).toHaveProperty("data");
      expect(res.body.data.username).toBe("johndoe");
      expect(res.body.data.password).toBe("doe123");
    } catch (err) {
      expect(err.statusCode).toBe(500);
    }
  });
});

describe("Test end-point update user", () => {
  const data = {
    username: "johndoe",
    password: "doe123",
  };
  it("should return 404 if user not found", async () => {
    try {
      const res = await request(app)
        .put("/api/v1/users/100")
        .set("auth", "secret")
        .send({
          username: "johndoe123",
          password: "doe123",
        });

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty("status", "Error");
      expect(res.body).toHaveProperty("message", "User not found");
    } catch (err) {
      expect(err.statusCode).toBe(500);
    }
  });

  it("should return 200 if user updated successfully", async () => {
    try {
      const res = await request(app)
        .put("/api/v1/users/1")
        .set("auth", "secret")
        .send(data);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("status", "Success");
      expect(res.body).toHaveProperty("message", "User updated successfully");
      expect(res.body).toHaveProperty("data");
      expect(res.body.data.username).toBe("johndoe");
      expect(res.body.data.password).toBe("doe123");
    } catch (err) {
      expect(err.statusCode).toBe(500);
    }
  });
});

describe("Test end-point delete user", () => {
  it("should return 404 if user not found", async () => {
    try {
      const res = await request(app)
        .delete("/api/v1/users/100")
        .set("auth", "secret");

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty("status", "Error");
      expect(res.body).toHaveProperty("message", "User not found");
    } catch (err) {
      expect(err.statusCode).toBe(500);
    }
  });

  it("should return 200 if user deleted successfully", async () => {
    try {
      const res = await request(app)
        .delete("/api/v1/users/1")
        .set("auth", "secret");

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("status", "Success");
      expect(res.body).toHaveProperty("message", "User deleted successfully");
    } catch (err) {
      expect(err.statusCode).toBe(500);
    }
  });
});

//////////////////////////////////////////////////////////////////////////////////////////////

describe("test end-point create history", () => {
    const user = {
      username: "johndoe",
      password: "doe123",
    };
    const history = {
      score: 10,
      score_date: "2020-05-05",
      user_id: 2,
    };
  
    it("should return 404 if user not found", async () => {
      try {
        const res = await request(app)
          .post("/api/v1/histories")
          .set("auth", "secret")
          .send({
            score: 10,
            score_date: "2020-05-05",
            user_id: 100,
          });
  
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty("status", "error");
        expect(res.body).toHaveProperty("message", "User not found");
      } catch (err) {
        expect(err.statusCode).toBe(500);
      }
    });
  
    it("should return 400 if all field is not filled", async () => {
      try {
        await request(app).post("/api/v1/users").send({
          username: "test",
          password: "test",
      })
        const res = await request(app)
          .post("/api/v1/histories")
          .set("auth", "secret")
          .send({
            score: 10,
            user_id: 2,
          });
  
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty("status", "Error");
        expect(res.body).toHaveProperty("message", "Please fill all the fields");
      } catch (err) {
        throw err;
      }
    });
  
    it("should return 201 if history created successfully", async () => {
      try {
        // create user first then create history
        await request(app).post("/api/v1/users").send(user);
        await truncate.history();
        const res = await request(app)
          .post("/api/v1/histories")
          .set("auth", "secret")
          .send(history);
  
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("status", "Success");
        expect(res.body).toHaveProperty(
          "message",
          "History created successfully"
        );
        expect(res.body).toHaveProperty("data");
        expect(res.body.data.score).toBe(10);
        expect(res.body.data.score_date).toBe("2020-05-05T00:00:00.000Z");
        expect(res.body.data.user_id).toBe(2);
      } catch (err) {
        throw err;
      }
    });
  });
  
  describe("test end-point get history", () => {
    it("should return 404 if user not found", async () => {
      try {
        const res = await request(app)
          .get("/api/v1/histories/100")
          .set("auth", "secret");
  
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty("status", "error");
        expect(res.body).toHaveProperty("message", "User not found");
      } catch (err) {
        throw err;
      }
    });
  
    it("should return 200 if history retrieved successfully", async () => {
      try {
        const res = await request(app)
          .get("/api/v1/histories/2")
          .set("auth", "secret");
  
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("status", "Success");
        expect(res.body).toHaveProperty(
          "message",
          "History retrieved successfully"
        );
        expect(res.body).toHaveProperty("data");
        // expect array
        expect(res.body.data).toBeInstanceOf(Array);
      } catch (err) {
        throw err;
      }
    });
  });
  
  describe("test end-point update history", () => {
    it("should return 404 if history not found", async () => {
      try {
        const res = await request(app)
          .put("/api/v1/histories/100")
          .set("auth", "secret")
          .send({
            score: 10,
            score_date: "2020-05-05",
            user_id: 2,
          });
  
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty("status", "error");
        expect(res.body).toHaveProperty("message", "History not found");
      } catch (err) {
        throw err;
      }
    });
  
    it("should return 200 if one field history updated successfully", async () => {
      try {
        const res = await request(app)
          .put("/api/v1/histories/2")
          .set("auth", "secret")
          .send({
            score_date: "2020-05-05",
            user_id: 2,
          });
  
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("status", "Success");
        expect(res.body).toHaveProperty(
          "message",
          "History updated successfully"
        );
        expect(res.body).toHaveProperty("data");
        expect(res.body.data.score).toBe(10);
      } catch (err) {}
    });
  
    it("should return 200 if history updated successfully", async () => {
      try {
        const res = await request(app)
          .put("/api/v1/histories/2")
          .set("auth", "secret")
          .send({
            score: 100,
            score_date: "2020-05-05",
            user_id: 2,
          });
  
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("status", "Success");
        expect(res.body).toHaveProperty(
          "message",
          "History updated successfully"
        );
        expect(res.body).toHaveProperty("data");
        expect(res.body.data.score).toBe(10);
      } catch (err) {}
    });
  });
  
  describe("test end-point delete history", () => {
    it("should return 404 if history not found", async () => {
      try {
        const res = await request(app)
          .delete("/api/v1/histories/100")
          .set("auth", "secret");
  
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty("status", "error");
        expect(res.body).toHaveProperty("message", "History not found");
      } catch (err) {
        throw err;
      }
    });
  
    it("should return 200 if history deleted successfully", async () => {
      try {
        const res = await request(app)
          .delete("/api/v1/histories/1")
          .set("auth", "secret");
  
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("status", "Success");
        expect(res.body).toHaveProperty(
          "message",
          "History deleted successfully"
        );
      } catch (err) {
        throw err;
      }
    });
  });
  
  //////////////////////////////////////////////////////////////////////////////////////////////

describe("test end-point create biodata", () => {
    const user = {
      username: "johndoe",
      password: "doe123",
    };
    const history = {
      score: 10,
      score_date: "2020-05-05",
      user_id: 2,
    };

    const biodata = {
      name: "johndoe",
      age: 20,
      user_id: 2,
    };

    it("should return 404 if user not found", async () => {
      try {
        const res = await request(app)
          .post("/api/v1/biodata")
          .set("auth", "secret")
          .send({
            name: "johndoe",
            age: 20,
            user_id: 100,
          });
  
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty("status", "error");
        expect(res.body).toHaveProperty("message", "User not found");
      } catch (err) {
        expect(err.statusCode).toBe(500);
      }
    });

    it("should return 400 if all field is not filled", async () => {
        try {
          await request(app).post("/api/v1/users").send({
            username: "johndoe",
            password: "doe123",
        })
        await truncate.biodata()
          const res = await request(app)
            .post("/api/v1/biodata")
            .set("auth", "secret")
            .send({
                name: "johndoe",
                user_id: 2,
            });
    
          expect(res.statusCode).toBe(400);
          expect(res.body).toHaveProperty("status", "Error");
          expect(res.body).toHaveProperty("message", "Please fill all the fields");
        } catch (err) {
          throw err;
        }
      });

      it("should return 201 if biodata created successfully", async () => {
        try {
          // create user first then create history
          await request(app).post("/api/v1/users").send(user);
          await truncate.biodata();
          const res = await request(app)
            .post("/api/v1/biodata")
            .set("auth", "secret")
            .send(biodata);
    
          expect(res.statusCode).toBe(201);
          expect(res.body).toHaveProperty("status", "Success");
          expect(res.body).toHaveProperty(
            "message",
            "Biodata created successfully"
          );
          expect(res.body).toHaveProperty("data");
          expect(res.body.data.name).toBe("johndoe");
          expect(res.body.data.age).toBe(20);
          expect(res.body.data.user_id).toBe(2);
        } catch (err) {
          throw err;
        }
    });
});

describe("Test end-point get all biodata", () => {
    it("should return 200 and all user data", async () => {
        try {
        const res = await request(app).get("/api/v1/biodata").set("auth", "secret");
      
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("status", "Success");
        expect(res.body).toHaveProperty(
            "message",
            "Bios retrieved successfully"
            );
        } catch (err) {
        expect(err.statusCode).toBe(500);
        }
    });
});

describe("Test end-point get biodata", () => {
    const data = {
        name: "johndoe",
        age: 20,
        user_id: 2,
    };

    it("should return 200 and biodata detail", async () => {
        try {
         const res = await request(app)
            .get("/api/v1/biodata/1")
            .set("auth", "secret");
      
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("status", "Success");
        expect(res.body).toHaveProperty(
            "message",
            "Bio retrieved successfully"
            );
        expect(res.body).toHaveProperty("data");
        expect(res.body.data.name).toBe("johndoe");
        expect(res.body.data.age).toBe(20);
        expect(res.body.data.user_id).toBe(2);
        } catch (err) {
        expect(err.statusCode).toBe(500);
        }
    });
});

describe("test end-point update biodata", () => {
    it("should return 404 if biodata not found", async () => {
      try {
        const res = await request(app)
          .put("/api/v1/biodata/100")
          .set("auth", "secret")
          .send({
            name: "johndoe",
            age: 20,
            user_id: 2,
          });
  
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty("status", "Error");
        expect(res.body).toHaveProperty("message", "Bio not found");
      } catch (err) {
        throw err;
      }
    });
  
    it("should return 200 if one field history updated successfully", async () => {
      try {
        const res = await request(app)
          .put("/api/v1/biodata/2")
          .set("auth", "secret")
          .send({
            age: 20,
            user_id: 2,
          });
  
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("status", "Success");
        expect(res.body).toHaveProperty(
          "message",
          "Biodata updated successfully"
        );
        expect(res.body).toHaveProperty("data");
        expect(res.body.data.age).toBe(20);
      } catch (err) {}
    });
  
    it("should return 200 if history updated successfully", async () => {
      try {
        const res = await request(app)
          .put("/api/v1/biodata/2")
          .set("auth", "secret")
          .send({
            name: "johndoe",
            age: 20,
            user_id: 2,
          });
  
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("status", "Success");
        expect(res.body).toHaveProperty(
          "message",
          "Biodata updated successfully"
        );
        expect(res.body).toHaveProperty("data");
        expect(res.body.data.name).toBe("johndoe");
        expect(res.body.data.age).toBe(20);
        expect(res.body.data.user_id).toBe(2);
      } catch (err) {}
    });
});

describe("test end-point delete biodata", () => {
    it("should return 404 if history not found", async () => {
      try {
        const res = await request(app)
          .delete("/api/v1/biodata/100")
          .set("auth", "secret");
  
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty("status", "Error");
        expect(res.body).toHaveProperty("message", "Biodata not found");
      } catch (err) {
        throw err;
      }
    });
  
    it("should return 200 if biodata deleted successfully", async () => {
      try {
        const res = await request(app)
          .delete("/api/v1/biodata/1")
          .set("auth", "secret");
  
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("status", "Success");
        expect(res.body).toHaveProperty(
          "message",
          "Biodata deleted successfully"
        );
      } catch (err) {
        throw err;
      }
    });
  });
