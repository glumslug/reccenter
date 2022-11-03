import React, { useState, useEffect } from "react";
import NoPic from "../images/user-solid.svg";
import Modal from "./modal";
import GroupSchedule from "./groupSchedule";
import NumbersNow from "./numbers-now";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import ModalYN from "./ModalYN";
import { toast } from "react-toastify";
import userAuth from "../hooks/userAuth";
import handleInvite from "../hooks/handleInvite";
import { useNavigate } from "react-router-dom";

const fetchBoard = async (boardId) => {
  const response = await fetch("/api/boards/" + boardId);
  const json = await response.json();

  if (response.ok) {
    return json;
  }
};

// Create a blank week
const blankWeek = function () {
  const week = [];
  for (let i = 0; i < 7; i++) {
    week.push([]);
    for (let j = 0; j < 3; j++) {
      week[i].push(0);
    }
  }
  return week;
};

const blankIconWeek = function () {
  const week = [];
  for (let i = 0; i < 7; i++) {
    week.push([]);
    for (let j = 0; j < 3; j++) {
      week[i].push([]);
    }
  }
  return week;
};

const aggregateBoards = (boards) => {
  // Get a blank week to serve as our starting point
  const week = blankWeek();

  boards.forEach((board) => {
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j]) {
          // Increment the count of the day/time slot
          week[i][j] += 1;
        }
      }
    }
  });

  return week;
};

const aggregateIconWeek = (boards) => {
  // Get a blank week to serve as our starting point
  const iconWeek = blankIconWeek();

  boards.forEach((board) => {
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 3; j++) {
        if (board.schedule[i][j]) {
          // Increment the list of IDs for each count

          iconWeek[i][j].push(board.icon);
        }
      }
    }
  });

  return iconWeek;
};

const aggregateIcons = (boards) => {
  const icons = [];
  boards.forEach((board) => {
    icons.push(board);
  });

  return icons;
};

const aggIconIDs = (boards) => {
  const iconIDs = {};
  boards.forEach((board) => {
    iconIDs[board.icon] = board._id;
  });

  return iconIDs;
};

function Group({ group, loadBoard }) {
  const groupId = group?._id;
  const groupName = group?.name;
  const groupMembers = group?.members;
  const groupIcon = group?.icon;
  const [memberWeek, setMemberWeek] = useState(blankWeek());
  const [icons, setIcons] = useState([]);
  const [iconWeek, setIconWeek] = useState(blankIconWeek());
  const [modalToggle, setModalToggle] = useState(false);
  const [requestToggle, setRequestToggle] = useState(false);
  const [numbers, setNumbers] = useState(0);
  const [state, setState] = useState(0);
  const [IdsByIcon, setIDsByIcon] = useState({});
  const [included, setIncluded] = useState(false);
  const [mutualFriends, setMutualFriends] = useState(
    <>
      <span className="none">0</span>
      <span> Mutual Friends</span>
    </>
  );
  // This entire add or request nonsense can be handled by just redirecting them to the groups page.
  // Honestly, if you see the notification is there, why would you even be searching? Pending and request are fine, but maybe remove this
  const [AddOrRequest, setAddOrRequest] = useState(
    <div className="request" onClick={() => handleRequest()}>
      Ask to join?
    </div>
  );
  const { user, dispatch } = useContext(AuthContext);
  const myId = user.boards[0]._id;
  const userFriends = user.boards[0].friends;
  const groupInvites = user.boards[0].groupInvites;
  const navigate = useNavigate();
  const { acceptInvite, declineInvite, sendGroupRequest } = handleInvite;

  useEffect(() => {
    const updateNow = () => {
      const d = new Date();
      const time = d.getHours();
      const day = d.getDay();

      if (time < 12) {
        setNumbers(memberWeek[day][0]);
      } else if (time < 17) {
        setNumbers(memberWeek[day][1]);
      } else if (time < 24) {
        setNumbers(memberWeek[day][2]);
      } else {
        setNumbers(0);
      }
    };
    updateNow();
  }, [memberWeek]);
  useEffect(() => {
    // Create a single promise that will resolve when all of its child promises
    // have been fulfilled
    if (groupMembers.includes(myId)) {
      setIncluded(true);
      console.log(included);
      Promise.all(groupMembers.map((member) => fetchBoard(member))).then(
        (boards) => {
          const memberBoard = aggregateBoards(
            boards.map((board) => board.schedule)
          );
          const memberIcons = aggregateIcons(boards.map((board) => board.icon));
          const iconIDs = aggIconIDs(boards.map((board) => board));
          const memberIconWeek = aggregateIconWeek(
            boards.map((board) => board)
          );

          setIcons(memberIcons);
          setMemberWeek(memberBoard);
          setIconWeek(memberIconWeek);
          setIDsByIcon(iconIDs);
        }
      );
    } else {
      let friendCount = 0;
      userFriends.map((friend) => {
        if (groupMembers.includes(friend._id)) {
          friendCount++;
        }
      });

      if (friendCount === 1) {
        setMutualFriends(
          <>
            <span className="number">1</span>
            <span> Friend</span>
          </>
        );
      } else if (friendCount !== 0) {
        setMutualFriends(
          <>
            <span className="number">{friendCount}</span>
            <span> Friends</span>
          </>
        );
      }
      if (groupInvites.includes(groupId)) {
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
      } else if (group?.requests.includes(myId)) {
        setAddOrRequest(<div className="pending">Pending</div>);
      }
    }
  }, [user, state]);

  const handleRespond = (type) => {
    if (type === "accept") {
      setRequestToggle({
        propFunction: handleAccept,
        prompt: "Accept Group Invite?",
      });
    }
    if (type === "decline") {
      setRequestToggle({
        propFunction: handleDecline,
        prompt: "Decline Group Invite?",
      });
    }
  };

  const handleRequest = () => {
    setRequestToggle({
      propFunction: handleSend,
      prompt: "Send group request?",
    });
  };
  const handleAccept = async () => {
    const resp = await acceptInvite(myId, groupId, user.token);
    if (resp) {
      toast.success("Group added!");
      userAuth
        .refresh(user._id)
        .then((resp) => dispatch({ type: "RESET", payload: resp }))
        .then(navigate(0));
    }
  };
  const handleDecline = async () => {
    const resp = await declineInvite(myId, groupId);
    if (resp) {
      toast.success("Friend declined.");
      setAddOrRequest(
        <div className="request" onClick={() => handleRequest()}>
          Ask to join?
        </div>
      );
      userAuth
        .refresh(user._id)
        .then((resp) => dispatch({ type: "RESET", payload: resp }));
    }
  };
  const handleSend = async () => {
    const resp = await sendGroupRequest({ groupId: groupId, myId: myId });
    if (resp) {
      toast.success("Group request sent!");
      setAddOrRequest(<div className="pending">Pending</div>);
    }
  };

  return (
    <div className="board" style={{ background: "#C4C4C4" }}>
      <div className="card">
        <img
          src={
            "https://reccenter-boardicons.s3.amazonaws.com/uploads/" + groupIcon
          }
          alt=""
        />
        <div className="cardText">
          <div className="refresh" onClick={() => setState(state + 1)}></div>
          <h2>{groupName}</h2>
          <NumbersNow numbers={numbers} />
        </div>
      </div>
      {included && (
        <div
          onClick={() => setModalToggle(true)}
          className="group-member-icons"
        >
          {icons.map((icon) => (
            <img
              src={
                "https://reccenter-boardicons.s3.amazonaws.com/uploads/" + icon
              }
              alt=""
            />
          ))}
        </div>
      )}
      {modalToggle && (
        <Modal
          toggle={setModalToggle}
          ballerIcons={icons}
          members={groupMembers}
          loadBoard={loadBoard}
        />
      )}
      {included && (
        <GroupSchedule
          sched={memberWeek}
          iconWeek={iconWeek}
          memberIcons={IdsByIcon}
          loadBoard={loadBoard}
          group={group}
        />
      )}
      {!included && (
        <div className="addFriend">
          <div className="mutual-group">
            <div className="mutual">
              <span className="number">{groupMembers.length}</span> Members
            </div>
            <div className="mutual">{mutualFriends}</div>
          </div>
          {AddOrRequest}
        </div>
      )}
      {requestToggle && (
        <ModalYN
          propFunction={requestToggle.propFunction}
          toggle={setRequestToggle}
          prompt={requestToggle.prompt}
        />
      )}
    </div>
  );
}

export default Group;
