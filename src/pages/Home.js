import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Board from "../components/board";
import Group from "../components/group";
import Search from "../components/Search";
import PostBoard from "../components/postBoard";
import MyGroups from "../components/myGroups";
import { AuthContext } from "../context/AuthContext";
import userAuth from "../hooks/userAuth";

const Home = () => {
  const navigate = useNavigate();
  const { user, dispatch } = useContext(AuthContext);
  const board = user.boards[0];

  const [boardToggle, setBoardToggle] = useState(false);
  const [groupToggle, setGroupToggle] = useState(false);
  const [group, setGroup] = useState();
  const [boardId, setBoardId] = useState("");
  const [groupId, setGroupId] = useState("");
  const [searchKey, setSearchKey] = useState(0);
  const [me, setMe] = useState();
  const [isGroup, setIsGroup] = useState(false);

  useEffect(() => {
    userAuth
      .refresh(user._id)
      .then((resp) => dispatch({ type: "RESET", payload: resp }));
  }, []);

  const loadBoard = (loadId) => {
    setBoardToggle(false);
    setGroupToggle(false);
    setBoardId(loadId);
    setGroupId("");
  };
  const loadGroup = (group) => {
    setGroupToggle(false);
    setBoardToggle(false);
    setGroup(group);
    setBoardId("");
  };
  useEffect(() => {
    if (boardId !== "") {
      setBoardToggle(true);
      setSearchKey(searchKey + 1);
    }
  }, [boardId]);

  useEffect(() => {
    if (group !== undefined) {
      setGroupToggle(true);

      setSearchKey(searchKey + 1);
    }
  }, [group]);

  // Get Board data from context
  useEffect(() => {
    setMe(board._id);
    if (board.groups.length !== 0) {
      setIsGroup(true);
    }
  }, []);

  return (
    <div className="body">
      {me && <Board boardId={me} me={true} />}

      <div className="utilities">
        <Search key={searchKey} loadBoard={loadBoard} loadGroup={loadGroup} />
        {isGroup && <MyGroups loadGroup={loadGroup} />}
      </div>

      {boardToggle && <Board boardId={boardId} me={false} />}
      {groupToggle && <Group group={group} loadBoard={loadBoard} />}
    </div>
  );
};

export default Home;
