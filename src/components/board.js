import React, { useState, useEffect, useContext } from "react";
import Schedule from "./schedule";
import BallNow from "./ball-now";
import userAuth from "../hooks/userAuth";
import { AuthContext } from "../context/AuthContext";
import ModalYN from "./ModalYN";
import friendHooks from "../hooks/friendHooks";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Board({ boardId, me }) {
  const [myWeek, setMyWeek] = useState("unrender");
  const [name, setName] = useState();
  const [updated, setUpdated] = useState(0);
  const [now, setNow] = useState(false);
  const [board, setBoard] = useState();
  const [icon, setIcon] = useState("");
  const [friend, setFriend] = useState(false);
  const [modalToggle, setModalToggle] = useState(false);
  const { user, dispatch } = useContext(AuthContext);
  const [mutualFriends, setMutualFriends] = useState(
    <>
      <span className="none">0</span>
      <span> Mutual Friends</span>
    </>
  );
  const [mutualGroups, setMutualGroups] = useState(
    <>
      <span className="none">0</span>
      <span> Mutual Groups</span>
    </>
  );
  const [AddOrRequest, setAddOrRequest] = useState(
    <div className="request" onClick={() => handleRequest()}>
      Add Friend
    </div>
  );
  const [backgroundColor, setBackgroundColor] = useState(null);
  const [friends, setFriends] = useState([]);
  const [groups, setGroups] = useState([]);
  const userFriends = user.boards[0].friends;
  const userGroups = user.boards[0].groups;
  const userReqs = user.boards[0].friendRequests;
  const { sendFriendRequest, acceptFriendRequest, declineFriendRequest } =
    friendHooks;
  const token = user.token;
  const navigate = useNavigate();

  // Sets mutual friends
  useEffect(() => {
    // Compare friends and userfriends, increment mutualFriends
    let friendCount = 0;
    userFriends.map((friend) => {
      if (friends.includes(friend._id)) {
        friendCount++;
      }
    });

    if (friendCount === 1) {
      setMutualFriends(
        <>
          <span className="number">1</span>
          <span> Mutual Friend</span>
        </>
      );
    } else if (friendCount !== 0) {
      setMutualFriends(
        <>
          <span className="number">{friendCount}</span>
          <span> Mutual Friends</span>
        </>
      );
    }
    // Compare groups and userGroups, increment mutualGroups
    let groupCount = 0;
    userGroups.map((group) => {
      if (groups.includes(group)) {
        groupCount++;
      }
    });

    if (groupCount === 1) {
      setMutualGroups(
        <>
          <span className="number">1</span>
          <span> Mutual Group</span>
        </>
      );
    } else if (groupCount !== 0) {
      setMutualGroups(
        <>
          <span className="number">{groupCount}</span>
          <span> Mutual Groups</span>
        </>
      );
    }
  }, [friends, groups]);

  // Function used by Td component to update schedule data that is to be sent to the server
  const updateWeek = (i, j, k) => {
    myWeek[i][j] = k;

    updateDB(myWeek);
    setUpdated(updated + 1);
  };

  // Update data on server using "Update a board" route
  const updateDB = async (newWeek) => {
    fetch("/api/boards/" + boardId, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: '{"schedule" :' + JSON.stringify(newWeek) + "}",
    });
  };
  // Get user data from server using "get a single board" route
  useEffect(() => {
    const fetchBoard = async () => {
      const response = await fetch("/api/boards/" + boardId);
      const json = await response.json();

      if (response.ok) {
        setMyWeek(json.schedule);
        setBoard(json);
        setFriends(json.friends);
        setGroups(json.groups);
        setName(json.name);
        setUpdated(updated + 1);
        if (json.icon) {
          setIcon(
            "https://reccenter-boardicons.s3.amazonaws.com/uploads/" + json.icon
          );
        } else {
          setIcon("/userIcons/user-solid.svg");
        }
      }
    };

    fetchBoard();

    if (userFriends.some((friend) => friend._id === boardId)) {
      setFriend(true);
      setBackgroundColor("#A9D18E");
    } else if (!me) {
      setBackgroundColor("#AFABAB");

      // Checks whether they have already requested you, and changes prompt if so
      // Then checks if you already requested them and changes the prompt accordingly
      if (userReqs.some((userReq) => userReq._id === boardId)) {
        setAddOrRequest(
          <>
            <div
              className="decline-request"
              onClick={() => handleRespond("decline")}
            >
              Decline
            </div>
            <div
              className="accept-request"
              onClick={() => handleRespond("accept")}
            >
              Accept
            </div>
          </>
        );
      } else if (board?.friendRequests.includes(user.boards[0]._id)) {
        setAddOrRequest(<div className="pending">Pending</div>);
      }
    }
  }, [user]);
  const handleRequest = () => {
    setModalToggle({
      propFunction: handleSend,
      prompt: "Send Friend Request?",
    });
  };
  const handleRespond = (type) => {
    if (type === "accept") {
      setModalToggle({
        propFunction: handleAccept,
        prompt: "Accept Friend Request?",
      });
    }
    if (type === "decline") {
      setModalToggle({
        propFunction: handleDecline,
        prompt: "Decline Friend Request?",
      });
    }
  };

  const handleAccept = async () => {
    const resp = await acceptFriendRequest({
      id: user.boards[0]._id,
      requestId: boardId,
      token: user.token,
    });
    if (resp) {
      toast.success("Friend added!");
      userAuth
        .refresh(user._id)
        .then((resp) => dispatch({ type: "RESET", payload: resp }));
    }
  };
  const handleDecline = async () => {
    const resp = await declineFriendRequest({
      id: user.boards[0]._id,
      requestId: boardId,
    });
    if (resp) {
      toast.success("Friend declined.");
      setAddOrRequest(
        <div className="request" onClick={() => handleRequest()}>
          Add Friend
        </div>
      );
      userAuth
        .refresh(user._id)
        .then((resp) => dispatch({ type: "RESET", payload: resp }));
    }
  };
  const handleSend = async () => {
    const resp = await sendFriendRequest({
      targetId: boardId,
      senderId: user.boards[0]._id,
    });
    if (resp) {
      toast.success("Friend request sent!");
      setAddOrRequest(<div className="pending">Pending</div>);
    }
  };

  // Update current time, check if current time is scheduled, udpated BallNow icon if scheduled
  useEffect(() => {
    const updateNow = () => {
      const d = new Date();
      const time = d.getHours();
      const day = d.getDay();

      if (time < 12) {
        if (myWeek[day][0]) {
          setNow(true);
        } else {
          setNow(false);
        }
      } else if (time < 17) {
        if (myWeek[day][1]) {
          setNow(true);
        } else {
          setNow(false);
        }
      } else if (time < 24) {
        if (myWeek[day][2]) {
          setNow(true);
        } else {
          setNow(false);
        }
      } else {
        setNow(false);
      }
    };
    updateNow();
  }, [updated]);

  return (
    <div className="board" style={{ background: backgroundColor }}>
      <div className="card">
        <img src={icon} alt="" />
        <div className="cardText">
          <div className="name">
            <h2>{name}</h2>
          </div>

          {(me || friend) && <BallNow now={now} />}
        </div>
      </div>
      {/* <NewActivity changeActivity={img => handleAdd(img)} /> */}
      {(me || friend) && (
        <Schedule
          updateWeek={updateWeek}
          sched={myWeek}
          me={me}
          boardId={boardId}
        />
      )}
      {!me && !friend && (
        <div className="addFriend">
          <div className="mutual-group">
            <div className="mutual">{mutualFriends}</div>
            <div className="mutual">{mutualGroups}</div>
          </div>
          {AddOrRequest}
        </div>
      )}
      {modalToggle && (
        <ModalYN
          propFunction={modalToggle.propFunction}
          toggle={setModalToggle}
          prompt={modalToggle.prompt}
        />
      )}
    </div>
  );
}

export default Board;
