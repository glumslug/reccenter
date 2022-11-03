import axios from "axios";
import io from "socket.io-client";
const socket = io();

const sendFriendRequest = async ({ targetId, senderId }) => {
  const response = await axios({
    url: "api/boards/friend-request/" + targetId,
    method: "PATCH",
    data: {
      senderId: senderId,
    },
  });
  if (response.data) {
    socket.emit("send-push", { room: targetId, message: "added a friend" });
    return response.data;
  }
};

const acceptFriendRequest = async ({ id, requestId, token }) => {
  const response = await axios({
    url: "api/boards/accept-friend/" + id,
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    data: {
      requestId: requestId,
    },
  });
  if (response.data) {
    return response;
  }
};

const declineFriendRequest = async ({ id, requestId }) => {
  const response = await axios({
    url: "api/boards/decline-friend/" + id,
    method: "PATCH",
    data: {
      requestId: requestId,
    },
  });
  if (response.data) {
    return response;
  }
};

const unfriend = async ({ id, friendId }) => {
  const response = await axios({
    url: "api/boards/unfriend/" + id,
    method: "PATCH",

    data: {
      friendId: friendId,
    },
  });
  if (response.data) {
    return response;
  }
};

const friendHooks = {
  sendFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
  unfriend,
};

export default friendHooks;
