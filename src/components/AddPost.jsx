import React, { Component } from "react";
import { firestore, auth } from "services/firebase";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

toast.configure();

class AddPost extends Component {
  state = { title: "", content: "" };

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };
  create = async (post) => {
    await firestore.collection("posts").add(post);
    await toast.success(`${post.user.displayName} add a post`, {
      bodyClassName: "grow-font-size",
    });
  };
  handleSubmit = (event) => {
    event.preventDefault();
    const { title, content } = this.state;
    const { uid, displayName, email, photoURL } = auth.currentUser || {};

    const post = {
      title,
      content,
      user: {
        displayName,
        email,
        photoURL,
        uid,
      },
      favorites: 0,
      comments: 0,
      createdAt: new Date(),
    };
    this.create(post);
    this.setState({ title: "", content: "" });
  };

  render() {
    const { title, content } = this.state;
    return (
      <form onSubmit={this.handleSubmit} className="AddPost">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={title}
          onChange={this.handleChange}
        />
        <input
          type="text"
          name="content"
          placeholder="Body"
          value={content}
          onChange={this.handleChange}
        />
        <input className="create" type="submit" value="Create Post" />
      </form>
    );
  }
}

export default AddPost;
