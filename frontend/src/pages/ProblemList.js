import React, { Component } from "react";
import { connect } from "react-redux";
import { logout } from "modules/account";
import { Link } from "react-router-dom";
import { URL } from "config";

import "../css/Problem.css";

class ProblemList extends Component {
  state = {
    problems: []
  };

  constructor(props) {
    super(props);
    if (props.store.login.status !== "SUCCESS") props.history.push("/");
  }

  _renderRanks = () => {
    let i = 1;
    console.log(this.state);
    const ranks = this.state.problems.map(problem => {
      return (
        <span
          style={{
            width: "calc(23% - 22.5px)",
            margin: "30px 15px",
            backgroundColor: "rgb(218, 218, 218)",
            boxShadow: "0 3px 6px rgba(0,0,0,0.0), 0 3px 6px rgba(0,0,0,0.23)"
          }}
          key={i}
        >
          <Link
            to={{
              pathname: "/problem/" + i++,
              state: {
                title: problem.title,
                content: problem.content,
                options: problem.compile
              }
            }}
          >
            <h3>{problem.title}</h3>
            <div>{problem.content}</div>
          </Link>
        </span>
      );
    });
    return ranks;
  };

  onLogOut = event => {
    event.preventDefault();
    if (
      window.confirm(
        "You can't log in again if you end the challenge now. Proceed?\n"
      )
    ) {
      // timecompare
      // alert with allscore
      // logout
      fetch(URL + "challenge/compare/", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: "id=" + this.props.store.status.id
      });
      fetch(URL + "challenge/allscore/", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: "id=" + this.props.store.status.id
      })
        .then(response => response.json())
        .then(json => {
          alert(
            "Your total score is: " +
              json.detail.score +
              "\nNow you're logged out."
          );
          this.props.logout();
          this.props.history.push("/");
        });
    }
  };

  componentDidMount() {
    fetch(URL + "challenge/question/", {
      method: "POST"
    })
      .then(response => response.json())
      .then(json => {
        this.setState({
          ...this.state,
          problems: json.detail
        });
      }); // set current solvedCnt
  }

  render() {
    return (
      <div>
        <div
          style={{
            display: "absolute",
            marginTop: "1vh",
            textAlign: "right",
            padding: "1vw"
          }}
        >
          <button className="btn btn btn-danger" onClick={this.onLogOut}>
            END
          </button>
        </div>
        <div
          style={{
            textAlign: "center",
            display: "flex",
            flexDirection: "row",
            margin: "0 auto",
            marginTop: "200px",
            paddingRight: "90px",
            paddingLeft: "90px",
            flexWrap: "wrap",
            justifyContent: "center"
          }}
        >
          {this._renderRanks()}
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
)(ProblemList);
