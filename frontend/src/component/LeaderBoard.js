import React from "react";

function LeaderBoard({ username, score, question }) {
  return (
    <li
      style={{
        borderColor: "black",
        margin: "5px",
        fontSize: "20px"
      }}
    >
      <span margin={{}}>{username}</span>
      <span style={{ position: "absolute", right: "50%", textAlign: "center" }}>
        {score}
      </span>
      <span
        style={{
          marginRight: "50px",
          position: "absolute",
          right: "0",
          textAlign: "center"
        }}
      >
        {question}
      </span>
    </li>
  );
}

export default LeaderBoard;
