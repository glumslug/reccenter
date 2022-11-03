import React, { useEffect, useState } from "react";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import ModalYN from "../components/ModalYN";
import { useNavigate, useParams } from "react-router-dom";
import UpdateGroup from "../components/updateGroup";
import fetchData from "../hooks/fetchData";
import manageMember from "../hooks/manageMember";
import AddMember from "../components/addMember";
import { toast } from "react-toastify";
import handleInvite from "../hooks/handleInvite";
import userAuth from "../hooks/userAuth";

function EditGroup() {
  const [groupName, setGroupName] = useState("");
  const [groupIcon, setGroupIcon] = useState("");
  const [displayList, setDisplayList] = useState([]);
  const [displayRequests, setDisplayRequests] = useState([]);
  const { user, dispatch } = useContext(AuthContext);
  const me = user.boards[0]._id;
  const [memToggle, setMemToggle] = useState(false);
  const [reqToggle, setReqToggle] = useState(false);
  const navigate = useNavigate();
  const groupId = useParams().groupId;
  const success = useParams().success;
  const { fetchBoard, fetchGroup } = fetchData;
  const { addMember, removeMember } = manageMember;
  const { manageGroupRequest } = handleInvite;
  const [funcToggle, setFuncToggle] = useState("edit");

  const contextRefresh = async () => {
    const resp = await userAuth.refresh(user._id);
    dispatch({ type: "RESET", payload: resp });
  };
  useEffect(() => {
    if (success === "invite") {
      toast.success("Invite sent!");
    }
    if (success === "remove") {
      toast.success("Member removed");
    }
  }, []);
  const handleMember = async (type, memberId, groupId) => {
    console.log(type);
    switch (type) {
      case "add":
        const resp = await addMember(memberId, groupId);
        if (resp) {
          navigate("/edit-group/" + groupId + "/invite");
          navigate(0);
        }
        break;
      case "remove":
        Promise.all(removeMember(memberId, groupId))
          .then(navigate("/edit-group/" + groupId + "/remove"))
          .then(navigate(0));
        break;
      case "req":
        Promise.all(manageGroupRequest(reqToggle.params)).then(
          contextRefresh()
        );
        break;
      default:
        console.log("default");
    }
  };

  const pushRows = (boards) => {
    const rows = [];
    boards.map((board) => {
      rows.push(
        <li key={board._id} className="group">
          <div className="member">
            <img
              src={
                "https://reccenter-boardicons.s3.amazonaws.com/uploads/" +
                board.icon
              }
              alt=""
            />
            <p className="name">{board.name}</p>
          </div>
          <div className="settings">
            {board._id !== me && (
              <div
                className="remove"
                onClick={() =>
                  setMemToggle({ id: board._id, name: board.name })
                }
              >
                &#10060;
              </div>
            )}
            {board._id == me && <div className="admin"></div>}
          </div>
        </li>
      );
    });
    setDisplayList(rows);
  };

  const pushReqs = (boards) => {
    const rows = [];
    boards.map((board) => {
      rows.push(
        <li key={board._id} className="group">
          <div className="member">
            <img
              src={
                "https://reccenter-boardicons.s3.amazonaws.com/uploads/" +
                board.icon
              }
              alt=""
            />
            <p className="name">{board.name}</p>
          </div>
          <div className="settings">
            <div
              className="accept"
              onClick={() =>
                setReqToggle({
                  params: {
                    groupId: groupId,
                    personId: board._id,
                    accept: true,
                  },
                  name: board.name,
                  action: "Accept ",
                })
              }
            >
              &#x2714;
            </div>
            <div
              className="remove"
              onClick={() =>
                setReqToggle({
                  params: {
                    groupId: groupId,
                    personId: board._id,
                    accept: false,
                  },
                  name: board.name,
                  action: "Decline ",
                })
              }
            >
              &#10060;
            </div>
          </div>
        </li>
      );
    });
    console.log(rows);
    setDisplayRequests(rows);
  };
  useEffect(() => {
    // Create a single promise that will resolve when all of its child promises
    // have been fulfilled

    fetchGroup(groupId).then((group) => {
      const members = group.members;
      const requests = group.requests;
      setGroupName(group.name);
      setGroupIcon(group.icon);
      Promise.all(members.map((member) => fetchBoard(member))).then(
        (boards) => {
          pushRows(boards);
        }
      );
      Promise.all(requests.map((request) => fetchBoard(request))).then(
        (boards) => {
          pushReqs(boards);
        }
      );
    });
  }, [user]);

  return (
    <div className="body">
      <div className="titleCard">
        <div className="title">
          <h1>{groupName}</h1>
        </div>
      </div>

      <div className="form">
        <div className="form-header">
          <div
            className="title"
            style={{ backgroundColor: "#c0eff8", cursor: "pointer" }}
            onClick={() => setFuncToggle("edit")}
          >
            Edit Group Members
          </div>
          <div
            className="return"
            onClick={() => navigate("/manage-groups")}
          ></div>
        </div>
        {funcToggle === "edit" && <ul>{displayList}</ul>}
        {memToggle && (
          <ModalYN
            propFunction={() => handleMember("remove", memToggle.id, groupId)}
            prompt={"Remove " + memToggle.name + "?"}
            toggle={setMemToggle}
          />
        )}
      </div>

      <div className="form">
        <div className="form-header">
          <div
            className="title"
            style={{ backgroundColor: "#c0f8e3", cursor: "pointer" }}
            onClick={() => setFuncToggle("requests")}
          >
            Manage Group Requests
          </div>
        </div>
        {(funcToggle === "requests" || "edit") && <ul>{displayRequests}</ul>}
        {reqToggle && (
          <ModalYN
            propFunction={() => handleMember("req")}
            prompt={
              <div>
                {reqToggle.action}
                <span className="emphasis">{reqToggle.name}'s</span> request?
              </div>
            }
            toggle={setReqToggle}
          />
        )}
      </div>

      <div className="form">
        <div
          className="title"
          style={{ backgroundColor: "#bbf296", cursor: "pointer" }}
          onClick={() => setFuncToggle("add")}
        >
          Add Group Members
        </div>
        {funcToggle === "add" && (
          <AddMember handleMember={handleMember} groupId={groupId} />
        )}
      </div>
      <UpdateGroup
        update={{ funcToggle, setFuncToggle }}
        groupId={groupId}
        oldName={groupName}
        oldPic={groupIcon}
      />
    </div>
  );
}

export default EditGroup;
