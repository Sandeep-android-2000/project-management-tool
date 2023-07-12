import React, { useEffect, useRef, useState } from "react";
import { signOut } from "firebase/auth";
import { Camera, LogOut, Edit2, Trash, GitHub, Paperclip } from "react-feather";
import { Link, Navigate } from "react-router-dom";

import InputControl from "../InputControl/InputControl";
import Spinner from "../Spinner/Spinner";
import ProjectForm from "./ProjectForm/ProjectForm";

import {
  auth,
  uploadImage,
  updateUserDatabase,
  getAllProjectsForUser,
  deleteProject,
} from "../../firebase";

// import styles from "./Account.module.css";

function Account(props) {
  const userDetails = props.userDetails;
  const isAuthenticated = props.auth;
  const imagePicker = useRef();

  const [progress, setProgress] = useState(0);
  const [profileImageUploadStarted, setProfileImageUploadStarted] =
    useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState(
    userDetails.profileImage ||
      "https://cdn.pixabay.com/photo/2021/02/23/09/26/cat-6042858__340.jpg"
  );
  const [userProfileValues, setUserProfileValues] = useState({
    name: userDetails.name || "",
    designation: userDetails.designation || "",
    github: userDetails.github || "",
    linkedin: userDetails.linkedin || "",
  });
  const [showSaveDetailsButton, setShowSaveDetailsButton] = useState(false);
  const [saveButtonDisabled, setSaveButtonDisabled] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [projectsLoaded, setProjectsLoaded] = useState(false);
  const [projects, setProjects] = useState([]);
  const [isEditProjectModal, setIsEditProjectModal] = useState(false);
  const [editProject, setEditProject] = useState({});

  const handleLogout = async () => {
    await signOut(auth);
  };

  const handleCameraClick = () => {
    imagePicker.current.click();
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setProfileImageUploadStarted(true);
    uploadImage(
      file,
      (progress) => {
        setProgress(progress);
      },
      (url) => {
        setProfileImageUrl(url);
        updateProfileImageToDatabase(url);
        setProfileImageUploadStarted(false);
        setProgress(0);
      },
      (err) => {
        console.error("Error->", err);
        setProfileImageUploadStarted(true);
      }
    );
  };

  const updateProfileImageToDatabase = (url) => {
    updateUserDatabase(
      { ...userProfileValues, profileImage: url },
      userDetails.uid
    );
  };

  const handleInputChange = (event, property) => {
    setShowSaveDetailsButton(true);

    setUserProfileValues((prev) => ({
      ...prev,
      [property]: event.target.value,
    }));
  };

  const saveDetailsToDatabase = async () => {
    if (!userProfileValues.name) {
      setErrorMessage("Name required");
      return;
    }

    setSaveButtonDisabled(true);
    await updateUserDatabase({ ...userProfileValues }, userDetails.uid);
    setSaveButtonDisabled(false);
    setShowSaveDetailsButton(false);
  };

  const fetchAllProjects = async () => {
    const result = await getAllProjectsForUser(userDetails.uid);
    if (!result) {
      setProjectsLoaded(true);
      return;
    }
    setProjectsLoaded(true);

    let tempProjects = [];
    result.forEach((doc) => tempProjects.push({ ...doc.data(), pid: doc.id }));
    setProjects(tempProjects);
  };

  const handleEditClick = (project) => {
    setIsEditProjectModal(true);
    setEditProject(project);
    setShowProjectForm(true);
  };

  const handleDeletion = async (pid) => {
    await deleteProject(pid);
    fetchAllProjects();
  };

  useEffect(() => {
    fetchAllProjects();
  }, []);

  return isAuthenticated ? (
    <div className="flex flex-col gap-[30px]">
      {showProjectForm && (
        <ProjectForm
          onSubmission={fetchAllProjects}
          onClose={() => setShowProjectForm(false)}
          uid={userDetails.uid}
          isEdit={isEditProjectModal}
          default={editProject}
        />
      )}
      <div className="w-full bg-[#c6ffeb] flex justify-between items-center p-[30px]">
        <p className="font-semibold text-[2.5rem]">
          Welcome <span className="text-[#22c48b] text-[2.7rem] text-capitalize">{userProfileValues.name}</span>
        </p>

        <div className="flex items-center gap-[5px] text-[rgb(51,51,51)] font-[500] text-[0.9rem] hover:text-[#22c48b] cursor-pointer" onClick={handleLogout}>
          <LogOut className="h-[18px] w-[18px] hover:text-[#22c48b]"/> Logout
        </div>
      </div>
      <input
        ref={imagePicker}
        type="file"
        style={{ display: "none" }}
        onChange={handleImageChange}
      />
      <div className="flex flex-col gap-[20px] py-[20px] px-[30px]">
        <div className="font-bold text-[1.6rem] max-[600px]:text-center">Your profile</div>
        <div className= "flex gap-[30px] items-center max-[600px]:flex-wrap max-[549px]:flex-col max-[600px]:justify-center">
          <div className="flex flex-col gap-[20px] items-center justify-center relative">
            <div className= " h-[200px] w-[200px] rounded-full overflow-hidden border-solid border-[1px] border-[#eee] max-[650px]:w-[150px] max-[650px]:h-[150px]">
              <img src={profileImageUrl} alt="Profile Img" className="h-full w-full object-contain"/>
              <div className="absolute right-[12px] top-[10px] bg-[#fff] rounded-full p-[8px] z-10 h-fit w-fit flex justify-center items-center border-solid border-[1px] border-[#eee] cursor-pointer max-[600px]:top-[3px] max-[600px]:right-[7px]" onClick={handleCameraClick}>
                <Camera className="h-[22px] w-[22px] text-[#22c48b]"/>
              </div>
            </div>
            {profileImageUploadStarted ? (
              <p className="font-bold text-[0.9rem] text-center">
                {progress === 100
                  ? "Getting image url..."
                  : `${progress.toFixed(2)}% uploaded`}
              </p>
            ) : (
              ""
            )}
          </div>
          <div className="w-full flex flex-col gap-[30px] ">
            <div className="w-full flex gap-[30px] max-[480px]:flex-col">
              <InputControl
                label="Name"
                placeholder="Enter your Name"
                value={userProfileValues.name}
                onChange={(event) => handleInputChange(event, "name")}
              />
              <InputControl
                label="Title"
                placeholder="eg. Full stack developer"
                value={userProfileValues.designation}
                onChange={(event) => handleInputChange(event, "designation")}
              />
            </div>
            <div className="w-full flex gap-[30px] items-center  max-[480px]:flex-col">
              <InputControl
                label="Github"
                placeholder="Enter your github link"
                value={userProfileValues.github}
                onChange={(event) => handleInputChange(event, "github")}
              />
              <InputControl
                label="Linkedin"
                placeholder="Enter your linkedin link"
                value={userProfileValues.linkedin}
                onChange={(event) => handleInputChange(event, "linkedin")}
              />
            </div>
            <div className="flex gap-[30px]">
              <p className="flex-1 text-[0.875rem] font-bold w-full text-center text-[#ff3511]">{errorMessage}</p>
              {showSaveDetailsButton && (
                <button
                  disabled={saveButtonDisabled}
                  className="border-none outline-none py-[10px] px-[16px] bg-[#22c48b] text-[#fff] rounded-[5px] text-center w-fit ml-auto text-[1.3rem] cursor-pointer hover:bg-[#36e4a6] transition-[200ms] active:translate-y-[1px] flex gap-[5px] justify-center items-center mt-5 disable:bg-gray-500 "
                  onClick={saveDetailsToDatabase}
                >
                  Save Details
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <hr />

      <div className="flex flex-col gap-[20px] py-[20px] px-[30px]">
        <div className="flex items-center justify-between">
          <div className="font-bold text-[1.6rem]">Your Projects</div>
          <button className="border-none outline-none py-[10px] px-[16px] bg-[#22c48b] text-[#fff] rounded-[5px] text-center w-fit ml-auto text-[1.3rem] cursor-pointer hover:bg-[#36e4a6] transition-[200ms] active:translate-y-[1px] flex gap-[5px] justify-center items-center mt-5 disable:bg-gray-500" onClick={() => setShowProjectForm(true)}>
            Add Project
          </button>
        </div>

        <div className="flex flex-col gap-[15px]">
          {projectsLoaded ? (
            projects.length > 0 ? (
              projects.map((item, index) => (
                <div className="w-full flex justify-between items-center shadow-md p-[10px]" key={item.title + index}>
                  <p className="text-[1.1rem] font-[500] tracking-[0.5px]">{item.title}</p>

                  <div className="flex items-center gap-[18px]">
                    <Edit2 onClick={() => handleEditClick(item)} className="h-22 w-22 text-[rgb(59,59,59)] transition-[200ms] cursor-pointer hover:text-[#22c48b]"/>
                    <Trash onClick={() => handleDeletion(item.pid)} className="h-22 w-22 text-[rgb(59,59,59)] transition-[200ms] cursor-pointer hover:text-[#22c48b]"/>
                    <Link target="_blank" to={`//${item.github}`}>
                      <GitHub />
                    </Link>
                    {item.link ? (
                      <Link target="_blank" to={`//${item.link}`}>
                        <Paperclip />
                      </Link>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p>No projects found</p>
            )
          ) : (
            <Spinner />
          )}
        </div>
      </div>
    </div>
  ) : (
    <Navigate to="/" />
  );
}

export default Account;