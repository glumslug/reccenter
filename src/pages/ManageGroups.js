import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ModalYN from "../components/ModalYN";
import { AuthContext } from "../context/AuthContext";
import userAuth from "../hooks/userAuth";
import fetchData from "../hooks/fetchData";
import deleteGroup from "../hooks/deleteGroup";
import handleInvite from "../hooks/handleInvite";
import manageMember from "../hooks/manageMember";

function ManageGroups() {
  const [rows, setRows] = useState("");
  const [invites, setInvites] = useState("");
  const { user, dispatch } = useContext(AuthContext);
  const { fetchBoard, fetchGroup } = fetchData;
  const navigate = useNavigate();

  const board = user.boards[0];
  const boardId = board._id;
  const [modal, setModal] = useState(false);
  const [modalToggle, setModalToggle] = useState(false);
  const { acceptInvite, declineInvite } = handleInvite;
  const { removeMember } = manageMember;

  const handleDeleteGroup = ({ groupId, groupName, groupMembers }) => {
    const handleDelete = (groupId) => {
      Promise.all(
        deleteGroup({ groupId: groupId, groupMembers: groupMembers })
      ).then(contextRefresh());
    };
    setModal(
      <ModalYN
        propFunction={() => handleDelete(groupId)}
        toggle={setModal}
        prompt={"Delete " + groupName + "?"}
      />
    );
  };

  const contextRefresh = () => {
    userAuth
      .refresh(user._id)
      .then((resp) => dispatch({ type: "RESET", payload: resp }));
  };

  const handleLeave = (groupId, groupName) => {
    const leaveGroup = async (groupId) => {
      await removeMember(boardId, groupId);
      contextRefresh();
    };
    setModal(
      <ModalYN
        propFunction={() => leaveGroup(groupId)}
        toggle={setModal}
        prompt={"Leave " + groupName + "?"}
      />
    );
  };

  const handleRespond = async (type, boardId, groupId) => {
    switch (type) {
      case "accept":
        const acc = await acceptInvite(boardId, groupId, user.token);
        if (acc) {
          contextRefresh();
        }
        break;
      case "decline":
        const dec = await declineInvite(boardId, groupId);
        if (dec) {
          contextRefresh();
        }
        break;
      default:
        console.log("default");
    }
  };

  const setDisplay = (res) => {
    const temp = [];

    res.map((group) => {
      if (group.admins.includes(boardId)) {
        temp.push(
          <li className="group">
            <div className="member" id="group-row">
              <img
                src={
                  "https://reccenter-boardicons.s3.amazonaws.com/uploads/" +
                  group.icon
                }
                alt=""
              />
              <p className="name">{group.name}</p>
            </div>
            <div className="settings">
              {group.requests.length !== 0 && (
                <div className="reqNotification">{group.requests?.length}</div>
              )}
              <div
                className="settings-wheel"
                onClick={() => navigate("/edit-group/" + group._id)}
              ></div>
              <div
                className="remove"
                onClick={() =>
                  handleDeleteGroup({
                    groupId: group._id,
                    groupName: group.name,
                    groupMembers: group.members,
                  })
                }
              >
                &#10060;
              </div>
            </div>
          </li>
        );
      } else {
        temp.push(
          <li className="group">
            <div className="member" id="group-row">
              <img
                src={
                  "https://reccenter-boardicons.s3.amazonaws.com/uploads/" +
                  group.icon
                }
                alt=""
              />
              <p className="name">{group.name}</p>
            </div>
            <div className="settings">
              <div
                className="leave"
                onClick={() => handleLeave(group._id, group.name)}
              ></div>
            </div>
          </li>
        );
      }
    });
    setRows(temp);
  };

  const setInviteDisplay = (res) => {
    const temp = [];
    res.map((group) => {
      temp.push(
        <li className="group">
          <div className="member" id="group-row">
            <img
              src={
                "https://reccenter-boardicons.s3.amazonaws.com/uploads/" +
                group.icon
              }
              alt=""
            />
            <p className="name">{group.name}</p>
          </div>
          <div className="settings">
            <div
              className="accept"
              onClick={() => handleRespond("accept", boardId, group._id)}
            >
              &#x2714;
            </div>
            <div
              className="decline"
              onClick={() => handleRespond("decline", boardId, group._id)}
            >
              &#10060;
            </div>
          </div>
        </li>
      );
    });
    setInvites(temp);
  };

  useEffect(() => {
    fetchBoard(boardId).then((board) =>
      Promise.all(board.groups.map((group) => fetchGroup(group))).then((res) =>
        setDisplay(res)
      )
    );
    fetchBoard(boardId)
      .then((board) =>
        Promise.all(board.groupInvites.map((group) => fetchGroup(group)))
      )
      .then((res) => setInviteDisplay(res));
  }, [user.boards[0]]);

  return (
    <div className="body">
      <>
        {/* Display Groups */}
        <div className="form">
          <div className="title">My Groups</div>
          {modal}
          {rows}
          <li className="addContainer">
            <p>Add a Group: </p>
            <div className="add" onClick={() => navigate("/create-group")}>
              &#xff0b;
            </div>
          </li>
        </div>

        {/* Display Group Invites */}
        <div className="form">
          <div className="title">Group Invites</div>
          {invites}
        </div>
      </>
    </div>
  );
}

export default ManageGroups;
