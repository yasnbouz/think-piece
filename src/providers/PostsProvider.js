import React, { createContext } from "react";
import { firestore } from "services/firebase";
import { CollectIdsAndDocs } from "Utilities";

export const PostsContext = createContext();

export default class PostsProvider extends React.Component {
  state = {
    posts: [],
  };
  async componentDidMount() {
    this.unsubscribeFromFirestore = firestore
      .collection("posts")
      .onSnapshot((snapshot) => {
        const posts = snapshot.docs.map(CollectIdsAndDocs);
        this.setState({ posts });
      });
  }
  componentWillUnmount() {
    this.unsubscribeFromFirestore();
  }
  render() {
    const { posts } = this.state;
    const { children } = this.props;
    return (
      <PostsContext.Provider value={posts}>{children}</PostsContext.Provider>
    );
  }
}
