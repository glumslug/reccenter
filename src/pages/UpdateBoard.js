import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import userAuth from "../hooks/userAuth";
import { toast } from "react-toastify";

const UpdateBoard = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState("");
  const [name, setName] = useState("");
  const [oldName, setOldName] = useState("");
  const [oldPic, setOldPic] = useState("");
  const { user, dispatch } = useContext(AuthContext);
  const boardId = useParams().boardId;

  const contextRefresh = () => {
    userAuth
      .refresh(user._id)
      .then((resp) => dispatch({ type: "RESET", payload: resp }));
  };
  useEffect(() => {
    const fetchBoard = async () => {
      const response = await fetch("/api/boards/" + boardId);
      const json = await response.json();

      if (response.ok) {
        setOldName(json.name);
        setOldPic(json.icon);
      }
    };

    fetchBoard();
  }, []);

  const submitForm = async (e) => {
    e.preventDefault();
    if (!selectedFile && !name) {
      toast.error("Please fill out one or more form fields.");
      return;
    }
    const token = user.token;
    const formData = new FormData();
    if (selectedFile) {
      formData.append("userIcon", selectedFile);
    }
    const updateIcon = name
      ? await axios({
          url: "/api/boards/" + boardId + "/name",
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          data: { name: name },
        })
      : null;
    const updateName = selectedFile
      ? await axios({
          url: "/api/boards/" + boardId + "/icon",
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          data: formData,
        })
      : null;

    if (updateName || updateIcon) {
      navigate("/home");
    }
  };
  return (
    <div className="form">
      <div className="title">Update Your Board</div>
      <form>
        <input
          type="text"
          placeholder={oldName}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="file"
          onChange={(e) => setSelectedFile(e.target.files[0])}
        />
        <img src={"../userIcons/" + oldPic} alt="" />
        <div className="form-actions">
          <input
            type="button"
            value="Update"
            id="submit"
            onClick={(e) => submitForm(e)}
          />
        </div>
        <button type="button" className="cancel" onClick={() => navigate("/")}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default UpdateBoard;
