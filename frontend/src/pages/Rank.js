import React, { Component } from "react";
import { LeaderBoard } from "component";
import { URL } from "config";

class Rank extends Component {
  state = {
    ranks: null
  };
  _renderRanks = () => {
    var i = 1;
    const ranks = this.state.ranks.map(rank => {
      return (
        <div>
          <LeaderBoard
            key={i++}
            username={rank.name}
            score={rank.score}
            question={rank.question}
          />
        </div>
      );
    });
    return ranks;
  };
  componentWillMount() {
    fetch(URL + "challenge/leaderboard", {
      method: "GET"
    })
      .then(response => response.json())
      .then(json => {
        this.setState({
          ...this.state,
          ranks: json.detail
        });
      });
  }
  render() {
    return (
      <div>
        <h1
          style={{
            textAlign: "left",
            padding: "20px",
            backgroundColor: "#649DFF",
            color: "white"
          }}
        >
          LEADERBOARD
        </h1>
        <ol
          style={{
            borderRadius: "10px",
            margin: "20px",
            backgroundColor: "#272821",
            color: "white"
          }}
        >
          <div style={{ fontSize: "25px", marginBottom: "25px" }}>
            <span>NAME</span>
            <span
              style={{
                position: "absolute",
                right: "50%",
                textAlign: "center"
              }}
            >
              SCORE
            </span>
            <span
              style={{
                marginRight: "50px",
                position: "absolute",
                right: "0",
                textAlign: "center"
              }}
            >
              SOLVED
            </span>
          </div>
          {this.state.ranks ? this._renderRanks() : null}
        </ol>
      </div>
    );
  }
}

export default Rank;
