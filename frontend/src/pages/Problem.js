import React, { Component } from "react";
import { connect } from "react-redux";
import { logout } from "modules/account";
import { URL } from "config";
import { Link } from "react-router-dom";

import MonacoEditor from "@uiw/react-monacoeditor";

class Problem extends Component {
  state = {
    content: "#include <stdio.h>\n\nint main(void){\n\n\treturn 0;\n}",
    prob_title: "if you're seeing this, please call the staff",
    prob_content: "if you're seeing this, please call the staff",
    prob_options: "if you're seeing this, please call the staff"
  };
  constructor(props) {
    super(props);
    if (props.store.login.status !== "SUCCESS") props.history.push("/");
  }

  componentWillMount() {
    const questionIndex = this.props.match.params.num - 1;

    console.log(questionIndex);
    fetch(URL + "challenge/question/", {
      method: "POST"
    })
      .then(response => response.json())
      .then(json => {
        const question = json.detail[questionIndex];
        console.log(json.detail[questionIndex]);
        this.setState({
          ...this.state,
          prob_title: question.title,
          prob_content: question.content,
          prob_options: question.compile
        });
      }); // set current solvedCnt
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
        encodeURI(this.state.content.replace(/\+/gi, "%2b")) +
        "&question=" +
        this.props.match.params.num
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
        <div style={{ marginTop: "1vh" }}>
          <a href={this.state.prob_content}>View Binary Source</a>
        </div>
        <div>{this.state.prob_options}</div>
        <br />
        <div style={{ textAlign: "left" }}>
          <MonacoEditor
            language="c"
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
