import React, { useContext, useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ModalYN from "../components/ModalYN";
import AddFriend from "../components/addFriend";
import { AuthContext } from "../context/AuthContext";
import friendHooks from "../hooks/friendHooks";
import userAuth from "../hooks/userAuth";

const Friends = () => {
  // const [funcToggle, setFuncToggle] = useState('requests')
  const [displayRequests, setDisplayRequests] = useState();
  const [displayFriends, setDisplayFriends] = useState();
  const [modalToggle, setModalToggle] = useState(null);
  // Hooks
  const { acceptFriendRequest, declineFriendRequest, unfriend } = friendHooks;
  // Get friend data from context
  const { user, dispatch } = useContext(AuthContext);
  const friendRequests = user.boards[0].friendRequests;
  const friends = user.boards[0].friends;
  const myId = user.boards[0]._id;

  const contextRefresh = () => {
    userAuth
      .refresh(user._id)
      .then((resp) => dispatch({ type: "RESET", payload: resp }));
  };

  const handleRespond = async (type, requestId) => {
    switch (type) {
      case "accept":
        const acc = await acceptFriendRequest({
          id: myId,
          requestId: requestId,
          token: user.token,
        });
        if (acc.data) {
          contextRefresh();
        }
        break;
      case "decline":
        const decl = await declineFriendRequest({
          id: myId,
          requestId: requestId,
        });
        if (decl.data) {
          contextRefresh();
        }
        break;
      default:
        console.log("default");
    }
  };

  const handleUnfriend = ({ friendId, name }) => {
    setModalToggle({ friendId: friendId, name: name });
  };

  const unFriend = async (friendId) => {
    const unf = await unfriend({ id: myId, friendId: friendId });
    if (unf.data) {
      contextRefresh();
    }
  };

  // Creates jsx out of friendRequests array
  const pushRequests = () => {
    const rows = [];
    if (friendRequests.length !== 0) {
      friendRequests.map((request, index) => {
        rows.push(
          <li className="group" key={index}>
            <div className="member" id="group-row">
              <img
                src={
                  "https://reccenter-boardicons.s3.amazonaws.com/uploads/" +
                  request.icon
                }
                alt=""
              />
              <p className="name">{request.name}</p>
            </div>
            <div className="settings">
              <div
                className="accept"
                onClick={() => handleRespond("accept", request._id)}
              >
                &#x2714;
              </div>
              <div
                className="decline"
                onClick={() => handleRespond("decline", request._id)}
              >
                &#10060;
              </div>
            </div>
          </li>
        );
      });
    } else {
      rows.push(
        <li className="group" style={{ backgroundColor: "#919191" }} key="0">
          <span className="none">No Friend Requests</span>{" "}
        </li>
      );
    }

    setDisplayRequests(rows);
  };
  const pushFriends = () => {
    const rows = [];
    if (friends.length !== 0) {
      friends.map((friend, i) => {
        rows.push(
          <li className="group" key={i}>
            <div className="member" id="group-row">
              <img
                src={
                  "https://reccenter-boardicons.s3.amazonaws.com/uploads/" +
                  friend.icon
                }
                alt=""
              />
              <p className="name">{friend.name}</p>
            </div>
            <div className="settings">
              <div
                className="decline"
                onClick={() =>
                  handleUnfriend({ friendId: friend._id, name: friend.name })
                }
              >
                &#10060;
              </div>
            </div>
          </li>
        );
      });
    } else {
      rows.push(
        <li className="group" style={{ backgroundColor: "#919191" }} key="0">
          <div className="none">No Friends Just Yet!</div>{" "}
        </li>
      );
    }

    setDisplayFriends(rows);
  };

  useEffect(() => {
    pushRequests();
    pushFriends();
  }, [user]);
  return (
    <div className="body">
      {/* Manage Friend Requests */}
      <div className="form">
        <div
          className="title"
          style={{ backgroundColor: "#c0f8e3", cursor: "pointer" }}
        >
          Friend Requests
        </div>

        {displayRequests}
      </div>
      {/* My Friends */}
      <div className="form">
        <div
          className="title"
          style={{ backgroundColor: "#c0eff8", cursor: "pointer" }}
        >
          My Friends
        </div>

        {displayFriends}

        {modalToggle && (
          <ModalYN
            propFunction={() => unFriend(modalToggle.friendId)}
            toggle={setModalToggle}
            prompt={
              <>
                Un-friend <span className="emphasis">{modalToggle.name}</span>?
              </>
            }
          />
        )}
      </div>

      {/* Add Friends */}
      <div className="form">
        <div className="title" style={{ cursor: "pointer" }}>
          Add Friends
        </div>
        <AddFriend myId={myId} />
      </div>
    </div>
  );
};

export default Friends;
