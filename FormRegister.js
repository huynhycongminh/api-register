import React, { Component } from "react";
import axios from "axios";
export default class FormRegister extends Component {
  constructor(props) {
    super(props);
    this.state = {
      customer:"ObjectId",
      name: "",
      phoneNumber: "",
      email: "",
      address: "",
      car_model_id: "",
      car_id: "",
      note: "",
      cars: [],
      car_models: [],
    };
  }
  componentWillMount() {
    axios.get("http://localhost:3000/new_test_driver").then((data) => {
      this.setState({
        cars: data["data"]["cars"],
        car_models: data["data"]["car_models"],
      })
    })
  }

  isChangeData = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({ [name]: value });
  };
  handleSubmit = (event,onSubmitForm) => {
    event.preventDefault();
   
    var user = {
      customer:this.state.customer,
      name: this.state.name,
      phoneNumber: this.state.phoneNumber,
      email: this.state.email,
      address: this.state.address,
      note: this.state.note,
      car_model_id: this.state.car_model_id,
      car_id: this.state.car_id,
    };
    axios
      .post("http://localhost:3000/api/register_test_drive", user, {
        headers: {
          "Content-type": "application/json",
        },
      })
      .then((res) => {
        console.log(res);
        alert("successful registration")
      })
      .catch((err) => {
        console.log(err);
      });
     
  };

  render() {
    const { cars, car_models } = this.state;
    // document.getElementById("register-form").reset();

    return (
      <div>
        <form id="register-form" className="container wide" >
          <h1 className="heading-form">
            PLEASE COMPLETE INFORMATION BELLOW TO REGISTER
          </h1>
          <div className="spacer" />
          {/* FullName */}
          <div className="row">
            <div className="form-group col-lg-12 col-md-12 col-12">
              <label htmlFor="fullName" className="form-label">
                Full Name
              </label>
              <input
                onChange={(event) => {
                  this.isChangeData(event);
                }}
                id
                required
                name="name"
                type="text"
                placeholder="Eg: Joe Biden"
                className="form-control"
              />
            </div>
          </div>
          <div className="row">
            {/* Phone Number */}
            <div className="form-group Col-lg-6 col-md-6 col-12">
              <label htmlFor="phoneNumber" className="form-label">
                Phone Number
              </label>
              <input
                onChange={(event) => {
                  this.isChangeData(event);
                }}
                id
                required
                name="phoneNumber"
                type="text"
                placeholder="Eg:+84 123 456 789"
                className="form-control"
              />
            </div>
            {/* Email */}
            <div className="form-group Col-lg-6 col-md-6 col-12">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                onChange={(event) => {
                  this.isChangeData(event);
                }}
                id
                required
                name="email"
                type="email"
                placeholder="VD: email@domain.com"
                className="form-control"
              />
            </div>
          </div>
          {/* Address */}
          <div className="row">
            <div className="form-group col-lg-12 col-md-12 col-12">
              <label htmlFor="address" className="form-label">
                Address
              </label>
              <input
                onChange={(event) => {
                  this.isChangeData(event);
                }}
                id
                required
                name="address"
                type="text"
                placeholder="Your Address: District - City"
                className="form-control"
              />
            </div>
          </div>

          <div className="row">
            <div className="form-group Col-lg-6 col-md-6 col-12">
              <label htmlFor="vehicletype" className="form-label">
                Choose Vehicle Model
              </label>
              <select
                onChange={(event) => {
                  this.isChangeData(event);
                }}
                name="car_model_id"
                required
                id="vehicletype"
                className="form-control"
                style={{
                  WebkitAppearance: "none",
                  MozAppearance: "none",
                  appearance: "none",
                }}
                // options={options}
              >
                 {this.state.car_models.map((car_models) => (
                 <option value={car_models._id}>{car_models.name}</option>
                ))}
             
                {/* <option value>All Vehicle Model</option>
                <option value= "1">SUV</option>
                <option value="2">Sedan</option> */}
              </select>
            </div>

            <div className="form-group Col-lg-6 col-md-6 col-12">
              <label htmlFor="vehiclemodel" className="form-label">
                Choose Vehicle Type
              </label>
              <select
                onChange={(event) => {
                  this.isChangeData(event);
                }}
                name="car_id"
                required
                id="vehiclemodel"
                className="form-control"
                style={{
                  WebkitAppearance: "none",
                  MozAppearance: "none",
                  appearance: "none",
                }}
              >
                   {this.state.cars.map((car) => (
                  <option value={car._id}>{car.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="row">
            {/* Note */}
            <div className="form-group col-lg-12 col-md-12 col-12">
              <label htmlFor="note" className="form-label">
                Note
              </label>
              <textarea
                onChange={(event) => {
                  this.isChangeData(event);
                }}
                name="note"
                id
                cols={30}
                rows={3}
                placeholder="Enter note..."
                className="form-control"
                style={{ height: "unset" }}
                defaultValue={""}
              />
            </div>
          </div>
          <input
            value="SEND"
            className="form-submit"
            type="reset"
            onClick={this.handleSubmit}
          />
         
        </form>
      </div>
    );
  }
}