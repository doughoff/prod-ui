import React from "react";
import { login } from '../api';
import { api } from '../api';

const IndexPage: React.FC = () => {
  return (
    <div>
      <div>hello</div>
      <button onClick={() => {
        login(
          "admin@hk.com",
          "12345"
        )
          .then((res) => {
            console.log(res);
          }).catch(err => {
            console.log(err)
          })
      }}>click me</button><br />
      <button onClick={() => {
        api.get("/users?").then(res => {
          console.log(res)
        }).catch(err => {
          console.log(err)
        })
      }}>users</button>
    </div >
  );
};

export default IndexPage;
