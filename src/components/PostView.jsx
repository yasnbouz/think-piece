import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Post from "./Post";
import Comments from "./Comments";
import { firestore } from "services/firebase";
import { CollectIdsAndDocs } from "Utilities";
import { withUser } from "providers/UserProvider";

class PostView extends Component {
  state = { post: null, comments: [] };
  unsubPost = null;
  unsubComments = null;
  get postID() {
    return this.props.match.params.id;
  }
  get postRef() {
    return firestore.doc(`posts/${this.postID}`);
  }
  get commentsRef() {
    return this.postRef.collection("comments");
  }
  async componentDidMount() {
    // listen for post
    this.unsubPost = this.postRef.onSnapshot((doc) => {
      if (doc.exists) {
        const post = CollectIdsAndDocs(doc);
        this.setState({ post });
      }
    });
    // listen for comments
    this.unsubComments = this.commentsRef.onSnapshot((snapshot) => {
      const comments = snapshot.docs.map(CollectIdsAndDocs);
      // this.postRef.update({ comments: comments.length });
      this.setState({ comments });
    });
  }
  componentWillUnmount() {
    this.unsubPost();
    this.unsubComments();
  }

  createComment = async (content) => {
    const { user } = this.props;
    await this.commentsRef.add({
      content,
      user,
      createdAt: new Date(),
    });
  };
  render() {
    const { post, comments } = this.state;

    return (
      <>
        <h2>Post Page</h2>
        {post && <Post {...post} />}
        <Comments comments={comments} onCreate={this.createComment} />
      </>
    );
  }
}

export default withRouter(withUser(PostView));
