var CarModel = require("../model/CarModel");
var Car = require("../model/Car");
var async = require("async");
var CustomerCarModel = require("../model/CustomerCarModel");
var CustomerCar = require("../model/CustomerCar");
var Customer = require("../model/Customer");
var AdminLogin = require("../model/AdminLogin");

// Retrieve all [car, car model] and render form register test driver
exports.new_test_drive = (reg, res) => {
  async.parallel(
    [
      //Read car_models data
      function (callback) {
        var car_models = CarModel.find();
        car_models.exec(function (err, car_models) {
          if (err) {
            callback(err);
          }
          callback(null, car_models);
        });
      },

      //Read cars data
      function (callback) {
        var cars = Car.find();
        cars.exec(function (err, cars) {
          if (err) {
            callback(err);
          }
          callback(null, cars);
        });
      },
    ],

    //Compute all results
    function (err, results) {
      if (err) {
        console.log(err);
        res.send(400);
      }

      if (results == null || results[0] == null) {
        res.send(400);
      }

      var data = { car_models: results[0], cars: results[1] };
      // check data
      // console.log(data);
      res.send(data);
    }
  );
};

// create and save customer into form register test driver
exports.register_test_drive = async function (req, res) {
  // validate request
  if (!req.body) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }
  try {
    const customer = new Customer({
      _id: req.body.customer_id,
      name: req.body.name,
      phoneNumber: req.body.phoneNumber,
      email: req.body.email,
      address: req.body.address,
      note: req.body.note,
    });
    await customer.save().then((data) => {
      res.send();
    });
    const customer_car_model = new CustomerCarModel({
      customer: req.body.customer_id,
      car_model: req.body.car_model_id,
    });
    await customer_car_model.save().then((data) => {
      res.send();
    });

    const customer_car = new CustomerCar({
      customer: req.body.customer_id,
      car: req.body.car_id,
      status: req.body.status,
    });
    await customer_car.save().then((data) => {
      res.send();
    });
  } catch (err) {
    console.log(err);
  }
};

// Retrieve all car or a single car
exports.find_car = (req, res) => {
  if (req.params.id) {
    const id = req.params.id;

    Car.findById(id)
      .populate({
        path: "car_detail",
        model: "CarDetail",
        populate: [
          {
            path: "furniture",
            model: "Furniture",
          },
          {
            path: "exterior",
            model: "Exterior",
          },
        ],
      })
      .then((data) => {
        if (!data) {
          res.status(404).send({ message: "Not found car with id " + id });
        } else {
          res.send(data);
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({ message: "Error retrieving car with id " + id });
      });
  } else {
    Car.find()
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Error Occurred while retrieving user information",
        });
      });
  }
};

// Search car
exports.search_car = (req, res) => {
  var query = {};

  if (req.query.name) {
    query.name = { $regex: req.query.name, $options: "i" };
  }
  Car.find(query)
    .populate({
      path: "car_detail",
      model: "CarDetail",
      populate: [
        {
          path: "furniture",
          model: "Furniture",
        },
        {
          path: "exterior",
          model: "Exterior",
        },
      ],
    })
    .then((data) => {
      res.send(data);
    });
};
// login
exports.login = (req, res) => {
  AdminLogin.findOne()
    .lean()
    .exec(function (err, data) {
      if (!req.query.username || !req.query.password) {
        res.send("login failed");
      } else if (
        req.query.username === data.username &&
        req.query.password === data.password
      ) {
        console.log(req.query);
        req.session.user = data.username;
        req.session.admin = true;
        res.send("login success!");
      } else res.send("Password or username incorrect !!!");
    });
};
exports.logout = (req, res) => {
  req.session.destroy();
  res.send("logout success!");
};

exports.get_data = (req, res) => {
  CustomerCar.find()
    .populate({
      path: "customer",
      model: "Customer",
    })
    .populate({
      path: "car",
      model: "Car",
      populate: [
        {
          path: "car_model",
          model: "CarModel",
        },
      ],
    })
    .then((data) => {
      res.send(data);
    });
};

exports.get_list_car = (req, res) => {
  Car.find()
    .then((data) => res.send(data))
    .catch((err) => console.log(err));
};

exports.select_car = (req, res) => {
  Car.find({ _id: req.query._id })
    .populate({
      path: "car_detail",
      model: "CarDetail",
      populate: [
        {
          path: "furniture",
          model: "Furniture",
        },
        {
          path: "exterior",
          model: "Exterior",
        },
        {
          path: "engine_transmission",
          model: "EngineTransmission",
        },
        {
          path: "size_volume",
          model: "SizeVolume",
        },
      ],
    })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => console.log(err));
};
