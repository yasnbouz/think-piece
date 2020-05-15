import React from "react";
import { auth, firestore, storage } from "services/firebase";
export default class UserProfile extends React.Component {
  state = { displayName: "" };
  imageInput = null;
  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };
  get Uid() {
    return auth.currentUser.uid;
  }
  get userRef() {
    return firestore.doc(`users/${this.Uid}`);
  }
  get file() {
    return this.imageInput && this.imageInput.files[0];
  }
  handleSubmit = (e) => {
    e.preventDefault();
    const { displayName } = this.state;
    if (displayName) {
      this.userRef.update({
        displayName,
      });
    }
    if (this.file) {
      storage
        .ref()
        .child(`user-profiles/${this.Uid}/${this.file.name}`)
        .put(this.file)
        .then((res) => res.ref.getDownloadURL())
        .then((photoURL) => {
          this.userRef.update({ photoURL });
        });
    }
  };
  render() {
    return (
      <section className="userProfile">
        <h3>User Profile</h3>
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="displayName">Display Name</label>
          <input
            type="text"
            name="displayName"
            id="displayName"
            value={this.state.displayName}
            onChange={this.handleChange}
          />
          <input type="file" ref={(ref) => (this.imageInput = ref)} />
          <input type="submit" className="update" />
        </form>
      </section>
    );
  }
}
