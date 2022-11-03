import axios from "axios";
import io from "socket.io-client";
const socket = io();

const acceptInvite = async (boardId, groupId, token) => {
  // Add own ID to group
  axios.patch("api/groups/" + groupId + "/add-member/" + boardId);
  // Add group to my groups

  const response = await axios({
    url: "api/boards/" + boardId + "/add-group",
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    data: {
      group: groupId,
    },
  });
  if (response.data) {
    return response;
  }
};

const declineInvite = async (boardId, groupId) => {
  // Remove invite from my board
  const response = await axios({
    url: "/api/boards/" + boardId + "/remove-invite",
    method: "PATCH",
    data: { group: groupId },
  });

  if (response.data) {
    return response.data;
  }
};

const sendGroupRequest = async ({ groupId, myId }) => {
  const response = await axios({
    url: "/api/groups/" + groupId + "/send-request",
    method: "PATCH",
    data: { person: myId },
  });

  if (response.data) {
    socket.emit("send-push", { room: groupId, message: "requested to join" });
    return response.data;
  }
};

const manageGroupRequest = async ({ groupId, personId, accept }) => {
  const response = await axios({
    url: "/api/groups/" + groupId + "/manage-request",
    method: "PATCH",
    data: {
      person: personId,
      accept: accept,
    },
  });

  if (response.data) {
    const sck = socket.emit("send-push", {
      room: personId,
      message: "managed your request",
    });
    return response.data;
  }
};

const handleInvite = {
  acceptInvite,
  declineInvite,
  sendGroupRequest,
  manageGroupRequest,
};

export default handleInvite;
