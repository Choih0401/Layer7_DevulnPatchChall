import React, { Component } from "react";
import { connect } from "react-redux";
import { logout } from "modules/account";
import { URL } from "config";
import { Link } from "react-router-dom";

import MonacoEditor from "@uiw/react-monacoeditor";

class Problem extends Component {
  state = {
    content: "#include <iostream>\n\nint main(void){\n\n\treturn 0;\n}",
    prob_title: "prob_title",
    prob_content: "prob_content",
    prob_options: "prob_options"
  };
  constructor(props) {
    super(props);
    if (props.store.login.status !== "SUCCESS") props.history.push("/");
  }

  componentWillMount() {
    const questionIndex = this.props.match.params.num;
    if (this.props.location === undefined) {
      /*fetch(URL + "challenge/question/", {
        method: "POST"
      })
        .then(response => response.json())
        .then(json => {
          cosnt question = json.detail.question[questionIndex];
          this.setState({
            ...this.state,
            prob_title: question.title,
            prob_content: question.content,
            prob_options: question.compile
          });
        }); // set current solvedCnt*/
    }
  }

  handleChange = (newValue, event) => {
    this.setState({
      ...this.state,
      content: newValue
    });
  };

  handleCompileButton = event => {
    event.preventDefault();
    fetch(URL + "challenge/updatescore", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body:
        "id=" +
        this.props.store.status.id +
        "&content=" +
        this.state.content.replace(/\+/gi, "%2b") +
        "&question=" +
        this.props.match.params.n
    })
      .then(response => response.json())
      .then(json => {
        if (json.code === 500) {
          this.setState({
            ...this.state,
            isCompiled: true,
            results: "COMPILE ERROR"
          });
          return;
        }
        alert("Your score: " + json.detail.score);
      });
  };

  render() {
    return (
      <div style={{ textAlign: "center" }}>
        <h2 style={{ marginTop: "2vh" }}>{this.state.prob_title}</h2>
        <div style={{ marginTop: "1vh" }}>{this.state.prob_content}</div>
        <div>{this.state.prob_options}</div>
        <br />
        <div style={{ textAlign: "left" }}>
          <MonacoEditor
            language="cpp"
            name="content"
            value={this.state.content}
            options={{
              selectOnLineNumbers: true,
              roundedSelection: false,
              cursorStyle: "line",
              automaticLayout: true,
              theme: "vs-dark"
            }}
            onChange={this.handleChange}
            height="75vh"
            width="100vw"
          />
        </div>
        <div style={{ marginTop: "2vh" }}>
          <Link
            className="btn btn btn-danger"
            to={{
              pathname: "/list"
            }}
          >
            Back
          </Link>
          <button
            style={{ marginTop: "2vh", margin: "5px" }}
            className="btn btn btn-primary"
            onClick={this.handleCompileButton}
          >
            Compile
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return { store: state };
};

const mapDispatchToProps = dispatch => {
  return {
    logout: () => {
      return dispatch(logout());
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Problem);