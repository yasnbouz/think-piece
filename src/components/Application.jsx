import React, { Component } from "react";
import { Switch, Route, Link } from "react-router-dom";
import Authentication from "./Authentication";
import UserProfile from "./UserProfile";
import Posts from "./Posts";
import PostView from "./PostView";

class Application extends Component {
  state = {
    loading: false,
  };

  render() {
    return (
      <main className="Application">
        <Link to="/">
          <h1>Think Piece</h1>
        </Link>
        <Authentication loading={this.state.loading} />
        <Switch>
          <Route exact path="/" component={Posts} />
          <Route path="/profile" component={UserProfile} />
          <Route path={"/posts/:id"} component={PostView} />
        </Switch>
      </main>
    );
  }
}

export default Application;
