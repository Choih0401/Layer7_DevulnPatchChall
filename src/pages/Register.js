import React, { Component } from "react";
import { URL } from "config";

class Register extends Component {
  state = {
    name: "",
    phoneNumber: "",
    email: "",
    id: "",
    password: ""
  };
  handleChange = event => {
    const { name, value } = event.target;
    this.setState({
      ...this.state,
      [name]: value
    });
  };
  handleSubmit = event => {
    event.preventDefault();
    fetch(URL + "auth/signup/", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body:
        "name=" +
        this.state.name +
        "&phonenumber=" +
        this.state.phoneNumber +
        "&email=" +
        this.state.email +
        "&id=" +
        this.state.id +
        "&password=" +
        this.state.password
    })
      .then(response => response.json())
      .then(json => {
        alert(json.detail);
        if (json.code === 200) this.props.history.push("/login");
      });
  };
  render() {
    return (
      <div>
        <form class="RegisterForm" onSubmit={this.handleSubmit}>
          <input
            name="name"
            type="text"
            placeholder="Name"
            onChange={this.handleChange}
          />
          <br />
          <input
            name="email"
            type="email"
            placeholder="email"
            onChange={this.handleChange}
          />
          <br />
          <input
            name="phoneNumber"
            type="text"
            placeholder="phone number"
            onChange={this.handleChange}
          />
          <br />
          <input
            name="id"
            type="text"
            placeholder="ID"
            onChange={this.handleChange}
          />
          <br />
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={this.handleChange}
          />
          <br />
          <button otype="submit">Register</button>
        </form>
      </div>
    );
  }
}

export default Register;
