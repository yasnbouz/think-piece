import React, { useContext } from "react";
import { Link } from "react-router-dom";
import moment from "moment/moment";
import { firestore } from "services/firebase";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { UserContext } from "providers/UserProvider";
toast.configure();
const belongsToCurrentUser = (currentUser, postAuthor) => {
  if (!currentUser) return false;
  return currentUser.uid === postAuthor.uid;
};

const Post = ({ id, title, content, user, createdAt, stars, comments }) => {
  const currentUser = useContext(UserContext);
  const postRef = firestore.doc(`posts/${id}`);
  // remove post
  const remove = async () => {
    await postRef.delete();
    toast.success(`${user.displayName} delete a post`, {
      bodyClassName: "grow-font-size",
    });
  };
  // starup post
  const starUp = () => {
    postRef.update({
      stars: stars + 1,
    });
  };
  return (
    <article className="Post">
      <div className="Post--content">
        <h3>
          <Link to={`/posts/${id}`}>{title}</Link>
        </h3>
        <div>{content}</div>
      </div>
      <div className="Post--meta">
        <div>
          <p>
            <span role="img" aria-label="star">
              ⭐️
            </span>
            {stars}
          </p>
          <p>
            <span role="img" aria-label="comments">
              🙊
            </span>
            {comments}
          </p>
          <p>Posted by {user.displayName}</p>
          <p>{moment(createdAt.toDate()).calendar()}</p>
        </div>
        <div>
          <button onClick={starUp} className="star">
            Star
          </button>
          {belongsToCurrentUser(currentUser, user) && (
            <button onClick={remove} className="delete">
              Delete
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

Post.defaultProps = {
  title: "An Incredibly Hot Take",
  content:
    "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ducimus est aut dolorem, dolor voluptatem assumenda possimus officia blanditiis iusto porro eaque non ab autem nihil! Alias repudiandae itaque quo provident.",
  user: {
    id: "123",
    displayName: "Bill Murray",
    email: "billmurray@mailinator.com",
    photoURL: "https://www.fillmurray.com/300/300",
  },
  createdAt: new Date(),
  stars: 0,
  comments: 0,
};

export default Post;
