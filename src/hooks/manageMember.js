import axios from "axios";
import io from "socket.io-client";
const socket = io();

const addMember = async (memberId, groupId) => {
  // Send group request to member
  const response = await axios({
    url: "/api/boards/" + memberId + "/invite",
    method: "PATCH",
    data: { group: groupId },
  });
  if (response.data) {
    console.log("emit");
    socket.emit("send-push", {
      room: memberId,
      message: "invited you to group",
    });
    return response.data;
  }
};

const removeMember = async (memberId, groupId) => {
  axios({
    url: "/api/groups/" + groupId + "/remove-member",
    method: "PATCH",
    data: {
      member: memberId,
    },
  });
};

const manageMember = { addMember, removeMember };

export default manageMember;
