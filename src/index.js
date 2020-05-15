import React from "react";
import { render } from "react-dom";
import UserProvider from "providers/UserProvider";
import PostsProvider from "providers/PostsProvider";
import "index.scss";
import { BrowserRouter as Router } from "react-router-dom";
import Application from "components/Application";
console.log(process.env);

render(
  <Router>
    <UserProvider>
      <PostsProvider>
        <Application />
      </PostsProvider>
    </UserProvider>
  </Router>,
  document.getElementById("root")
);
