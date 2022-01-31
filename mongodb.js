//CRUD create read update delete

// const mongodb = require("mongodb");
// const MongoClient = mongodb.MongoClient;
// const ObjectID = mongodb.ObjectId;

const { MongoClient, ObjectID } = require("mongodb");

const connectionURL = "mongodb://127.0.0.1:27017"; //local host is 127.0.0.1
const databaseName = "task-manager";

// const id = new ObjectID();
// console.log(id);
// console.log(id.getTimestamp());

MongoClient.connect(
  connectionURL,
  { useNewUrlParser: true },
  (error, client) => {
    if (error) {
      return console.log("Unable to connect to database");
    }

    //console.log("Connected correctly");   //successfully connect to mongodb server using nodejs

    const db = client.db(databaseName); //returns database ref

    // db.collection("tasks")
    //   .deleteOne({
    //     description: "take out trash",
    //   })
    //   .then((result) => {
    //     console.log(result);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });

    // db.collection("users")
    //   .deleteMany({
    //     age: 27,
    //   })
    //   .then((result) => {
    //     console.log(result);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });

    // db.collection("tasks")
    //   .updateMany(
    //     { completed: false },
    //     {
    //       $set: {
    //         completed: true,
    //       },
    //     }
    //   )
    //   .then((result) => {
    //     console.log(result.modifiedCount);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });

    // db.collection("users")
    //   .updateOne(
    //     {
    //       _id: new ObjectID("61f572811cd3d13bfd9ce991"),
    //     },
    //     {
    //       $inc: {
    //         age: 20,
    //       },
    //     } //provide callback (error, result) OR promises
    //   )
    //   .then((result) => {
    //     console.log(result);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });

    // db.collection("tasks").findOne(
    //   { _id: new ObjectID("61f5ee2e0189337a42fcb712") },
    //   (error, task) => {
    //     if (error) {
    //       return console.log("unable to retrieve last task");
    //     }

    //     console.log(task);
    //   }
    // );

    // db.collection("tasks")
    //   .find({
    //     completed: false,
    //   })
    //   .toArray((error, uncompleted) => {
    //     if (error) {
    //       return console.log("unable to retrieve uncompleted tasks");
    //     }

    //     console.log(uncompleted);
    //   });

    // db.collection("users").findOne(
    //   { _id: new ObjectID("61f5e686d50addfddc68ccac") },
    //   (error, user) => {
    //     if (error) {
    //       return console.log("Unable to fetch");
    //     }

    //     console.log(user);
    //   }
    // );

    // db.collection("users")
    //   .find({ age: 27 })
    //   .toArray((error, users) => {
    //     console.log(users);
    //   }); //find returns cursor

    // db.collection("tasks").insertMany(
    //   [
    //     {
    //       description: "workout",
    //       completed: false,
    //     },
    //     {
    //       description: "study",
    //       completed: false,
    //     },
    //     {
    //       description: "take out trash",
    //       completed: true,
    //     },
    //   ],
    //   (error, result) => {
    //     if (error) {
    //       return console.log("Unable to insert tasks");
    //     }

    //     console.log(result.insertedIds);
    //   }
    // );

    // db.collection("users").insertOne(
    //   {
    //     user: "Vikram",
    //     age: 26,
    //   },
    //   (error, result) => {
    //     if (error) {
    //       return console.log("Unable to insert user");
    //     }

    //     console.log(result);
    //   }
    // );

    // db.collection("users").insertMany(
    //   [
    //     {
    //       name: "Jen",
    //       age: 20,
    //     },
    //     {
    //       name: "Gunther",
    //       age: 27,
    //     },
    //   ],
    //   (error, result) => {
    //     if (error) {
    //       return console.log("Unable to insert documents!");
    //     }

    //     console.log(result);
    //   }
    // );
  }
);
