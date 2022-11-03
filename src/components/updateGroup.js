import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ModalYN from "./ModalYN";

const UpdateGroup = ({ update, groupId, oldName, oldPic }) => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState("");
  const [name, setName] = useState("");
  const { funcToggle, setFuncToggle } = update;

  useEffect(() => {
    console.log(groupId, oldName, oldPic);
  }, []);

  const submitForm = (e) => {
    e.preventDefault();
    const submit = () => {
      if (selectedFile) {
        const formData = new FormData();
        formData.append("groupIcon", selectedFile);
        axios({
          url: "/api/groups/" + groupId + "/icon",
          method: "PATCH",
          data: formData,
        });
      }
      if (name) {
        axios({
          url: "/api/groups/" + groupId,
          method: "PATCH",
          data: { name: name },
        });
      }
    };
    Promise.all(submit()).then(navigate(0));
  };
  return (
    <div className="form">
      <div
        className="title"
        style={{ cursor: "pointer" }}
        onClick={() => setFuncToggle("update")}
      >
        Update Group Name/Icon
      </div>
      {funcToggle === "update" && (
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
          <img src={"../groupIcons/" + oldPic} alt="" />
          <div className="form-actions">
            <input
              type="submit"
              value="Update"
              id="submit"
              onClick={(e) => submitForm(e)}
            />
          </div>
          <button
            type="button"
            className="cancel"
            onClick={() => navigate("/home")}
          >
            Cancel
          </button>
        </form>
      )}
    </div>
  );
};

export default UpdateGroup;
