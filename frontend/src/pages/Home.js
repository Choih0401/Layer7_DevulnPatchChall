import React, { Component } from "react";
import { connect } from "react-redux";
import { login, loginFailure, loginSuccess } from "modules/account";
import { URL } from "config";

import "../css/Home.css";
import yg_pic from "../img/team/1.jpg";
import king_pic from "../img/team/2.jpg";
import hw_pic from "../img/team/3.jpg";

class Home extends Component {
  state = {
    name: "",
    phoneNumber: "",
    email: "",
    id: "",
    password: ""
  };
  constructor(props) {
    super(props);
    if (props.store.login.status === "SUCCESS") props.history.push("/problem/");
  }
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
        if (json.code === 500) {
          alert(json.detail.message);
          return;
        } else {
          this.props.loginSuccess({ id: this.state.id });
          this.props.history.push("/list/");
          alert(json.detail);
        }
      });
  };
  render() {
    return (
      <div>
        <header className="masthead">
          <div className="container" style={{ height: "100vh" }}>
            <div className="intro-text">
              <div
                className="intro-heading text-uppercase"
                style={{ backgroundColor: "rgba(185, 60, 77)" }}
              >
                Layer7 DevulnPatchChall
              </div>
              <a
                className="btn btn-primary btn-xl text-uppercase js-scroll-trigger"
                style={{ width: "150px" }}
                href="#services"
              >
                More info
              </a>
              <br />
              <br />
              <a
                className="btn btn-primary btn-xl text-uppercase js-scroll-trigger"
                style={{ width: "150px" }}
                href="#contactForm"
              >
                {" "}
                Register{" "}
              </a>
              <br />
            </div>
          </div>
        </header>

        <section className="page-section" id="services">
          <div className="container" style={{ height: "70vh" }}>
            <div className="row">
              <div className="col-lg-12 text-center">
                <h2 className="section-heading text-uppercase">how to</h2>
              </div>
            </div>
            <div className="row text-center">
              <div className="col-md-4">
                <span className="fa-stack fa-4x"></span>
                <h4 className="service-heading"> </h4>
                <p className="text-muted"> </p>
              </div>
              <div className="col-md-4   ">
                <span className="fa-stack fa-4x">
                  <i className="fas fa-circle fa-stack-2x text-primary"></i>
                  <i className="fas fa-laptop fa-stack-1x fa-inverse"></i>
                </span>
                <p className="text-muted">
                  Fill your forms at the registration page to get started.
                  <br />
                  Find the vulnerabilities in the given binary and make it safe
                  to get the score.
                  <br />
                  The number of the vulnerabilities is unknown. Good Luck!
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="page-section" id="team">
          <div className="container" style={{ height: "65vh" }}>
            <div className="row">
              <div className="col-lg-12 text-center">
                <h2 className="section-heading text-uppercase">Programmers</h2>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-4">
                <div className="team-member">
                  <img
                    className="mx-auto rounded-circle"
                    src={yg_pic}
                    alt="Face of a handsome guy"
                  />
                  <h4>Kim Yeongyu</h4>
                </div>
              </div>
              <div className="col-sm-4">
                <div className="team-member">
                  <img
                    className="mx-auto rounded-circle"
                    src={king_pic}
                    alt="Face of a handsome guy"
                  />
                  <h4>Kim Junseo</h4>
                </div>
              </div>
              <div className="col-sm-4">
                <div className="team-member">
                  <img
                    className="mx-auto rounded-circle"
                    src={hw_pic}
                    alt="Face of a handsome guy"
                  />
                  <h4>Choi Hyunwoo</h4>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="page-section" id="contact">
          <div className="container" style={{ height: "80vh" }}>
            <div className="row">
              <div className="col-lg-12 text-center">
                <h2 className="section-heading text-uppercase">
                  Register here
                </h2>
                <h3 className="section-subheading text-muted"> </h3>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-12">
                <form
                  onSubmit={this.handleSubmit}
                  id="contactForm"
                  name="sentMessage"
                  method="POST"
                >
                  <div className="row">
                    <div className="clearfix"></div>
                    <div className="col-lg-12 text-center">
                      <div id="success"></div>
                      <div className="form-group">
                        <input
                          className="form-control"
                          onChange={this.handleChange}
                          id="id"
                          name="id"
                          type="text"
                          placeholder="ID *"
                          required="required"
                          data-validation-required-message="Please enter your ID."
                        />
                        <p className="help-block text-danger"></p>
                      </div>
                      <div className="form-group">
                        <input
                          className="form-control"
                          onChange={this.handleChange}
                          id="pw"
                          name="password"
                          type="password"
                          placeholder="PASSWORD *"
                          required="required"
                          data-validation-required-message="Please enter your PASSWORD."
                        />
                        <p className="help-block text-danger"></p>
                      </div>
                      <div className="form-group">
                        <input
                          className="form-control"
                          onChange={this.handleChange}
                          id="name"
                          name="name"
                          type="text"
                          placeholder="Name *"
                          required="required"
                          data-validation-required-message="Please enter your name."
                        />
                        <p className="help-block text-danger"></p>
                      </div>
                      <div className="form-group">
                        <input
                          className="form-control"
                          onChange={this.handleChange}
                          id="email"
                          name="email"
                          type="email"
                          placeholder="Email *"
                          required="required"
                          data-validation-required-message="Please enter your email address."
                        />
                        <p className="help-block text-danger"></p>
                      </div>
                      <div className="form-group">
                        <input
                          className="form-control"
                          onChange={this.handleChange}
                          id="phone"
                          name="phoneNumber"
                          type="tel"
                          placeholder="Phone *"
                          required="required"
                          data-validation-required-message="Please enter your phone number."
                        />
                        <p className="help-block text-danger"></p>
                      </div>
                      <button
                        id="sendMessageButton"
                        className="btn btn-primary btn-xl text-uppercase"
                        type="submit"
                      >
                        Start
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return { store: state };
};

const mapDispatchToProps = dispatch => {
  return {
    login: () => {
      return dispatch(login());
    },
    loginSuccess: data => {
      return dispatch(loginSuccess(data));
    },
    loginFailure: () => {
      return dispatch(loginFailure());
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
