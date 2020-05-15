import React, { createContext, useContext } from "react";
import { auth, createUserProfileDocument, firestore } from "services/firebase";

export const UserContext = createContext();

export default class UserProvider extends React.Component {
  state = { user: null };
  async componentDidMount() {
    this.unsubscribeFromAuth = auth.onAuthStateChanged(async (userAuth) => {
      if (userAuth) {
        const userRef = await createUserProfileDocument(userAuth);
        this.unsubscribeFromUpdatePosts = userRef.onSnapshot(
          async (snapshot) => {
            this.setState({ user: { uid: snapshot.id, ...snapshot.data() } });
            const querySnapshot = await firestore
              .collection("posts")
              .where("user.uid", "==", userAuth.uid)
              .get();
            await querySnapshot.forEach((doc) => {
              doc.ref.update({
                user: { uid: snapshot.id, ...snapshot.data() },
              });
            });
          }
        );
      }
      this.setState({ user: userAuth });
    });
  }
  componentWillUnmount() {
    this.unsubscribeFromAuth();
    this.unsubscribeFromUpdatePosts();
  }
  render() {
    const { user } = this.state;
    const { children } = this.props;
    return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
  }
}
const getDisplayName = (WrappedComponent) => {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
};
export const withUser = (Component) => {
  const WrappedComponent = (props) => {
    const user = useContext(UserContext);
    return <Component user={user} {...props} />;
  };
  WrappedComponent.displayName = `withUser(${getDisplayName(Component)})`;
  return WrappedComponent;
};
