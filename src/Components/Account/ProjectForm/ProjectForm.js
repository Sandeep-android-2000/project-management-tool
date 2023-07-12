import React, { useRef, useState } from "react";
import { X } from "react-feather";

import Modal from "../../Modal/Modal";
import InputControl from "../../InputControl/InputControl";

import {
  addProjectInDatabase,
  updateProjectInDatabase,
  uploadImage,
} from "../../../firebase";



function ProjectForm(props) {
  const fileInputRef = useRef();
  const isEdit = props.isEdit ? true : false;
  const defaults = props.default;

  const [values, setValues] = useState({
    thumbnail: defaults?.thumbnail || "",
    title: defaults?.title || "",
    overview: defaults?.overview || "",
    github: defaults?.github || "",
    link: defaults?.link || "",
    points: defaults?.points || ["", ""],
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [imageUploadStarted, setImageUploadStarted] = useState(false);
  const [imageUploadProgress, setImageUploadProgress] = useState(0);
  const [submitButtonDisabled, setSetSubmitButtonDisabled] = useState(false);

  const handlePointUpdate = (value, index) => {
    const tempPoints = [...values.points];
    tempPoints[index] = value;
    setValues((prev) => ({ ...prev, points: tempPoints }));
  };

  const handleAddPoint = () => {
    if (values.points.length > 4) return;
    setValues((prev) => ({ ...prev, points: [...values.points, ""] }));
  };

  const handlePointDelete = (index) => {
    const tempPoints = [...values.points];
    tempPoints.splice(index, 1);
    setValues((prev) => ({ ...prev, points: tempPoints }));
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setImageUploadStarted(true);
    uploadImage(
      file,
      (progress) => {
        setImageUploadProgress(progress);
      },
      (url) => {
        setImageUploadStarted(false);
        setImageUploadProgress(0);
        setValues((prev) => ({ ...prev, thumbnail: url }));
      },
      (error) => {
        setImageUploadStarted(false);
        setErrorMessage(error);
      }
    );
  };

  const validateForm = () => {
    const actualPoints = values.points.filter((item) => item.trim());

    let isValid = true;

    if (!values.thumbnail) {
      isValid = false;
      setErrorMessage("Thumbnail for project is required");
    } else if (!values.github) {
      isValid = false;
      setErrorMessage("Project's repository link required");
    } else if (!values.title) {
      isValid = false;
      setErrorMessage("Project's Title required");
    } else if (!values.overview) {
      isValid = false;
      setErrorMessage("Project's Overview required");
    } else if (!actualPoints.length) {
      isValid = false;
      setErrorMessage("Description of Project is required");
    } else if (actualPoints.length < 2) {
      isValid = false;
      setErrorMessage("Minimum 2 description points required");
    } else {
      setErrorMessage("");
    }

    return isValid;
  };

  const handleSubmission = async () => {
    if (!validateForm()) return;

    setSetSubmitButtonDisabled(true);
    if (isEdit)
      await updateProjectInDatabase(
        { ...values, refUser: props.uid },
        defaults.pid
      );
    else await addProjectInDatabase({ ...values, refUser: props.uid });
    setSetSubmitButtonDisabled(false);
    if (props.onSubmission) props.onSubmission();
    if (props.onClose) props.onClose();
  };

  return (
    <Modal onClose={() => (props.onClose ? props.onClose() : "")}>
      <div className="max-[600px]:min-w-[450px] min-w-[650px]  p-[30px] flex flex-col  gap-[30px] ">
        <input
          ref={fileInputRef}
          type="file"
          style={{ display: "none" }}
          onChange={handleFileInputChange}
        />
        <div className="flex gap-[30px] max-[600px]:flex-col">
          <div className="flex max-[600px]:items-center flex-col gap-[30px] ">
            <div className="flex flex-col gap-[10px]">
              <img
                src={
                  values.thumbnail ||
                  "https://www.agora-gallery.com/advice/wp-content/uploads/2015/10/image-placeholder-300x200.png"
                }
                className="h-[130px] w-[230px] object-cover"
                alt="Thumbnail"
                onClick={() => fileInputRef.current.click() }
              />
              {imageUploadStarted && (
                <p>
                  <span className="font-bold text-[0.875rem] tracking-[1px]">{imageUploadProgress.toFixed(2)}%</span> Uploaded
                </p>
              )}
            </div>

            <InputControl
              label="Github"
              value={values.github}
              placeholder="Project repository link"
              onChange={(event) =>
                setValues((prev) => ({
                  ...prev,
                  github: event.target.value,
                }))
              }
            />
            <InputControl
              label="Deployed link"
              placeholder="Project Deployed link"
              value={values.link}
              onChange={(event) =>
                setValues((prev) => ({
                  ...prev,
                  link: event.target.value,
                }))
              }
            />
          </div>
          <div className="flex max-[600px]:items-center flex-col  gap-[25px]">
            <InputControl
              label="Project Title"
              placeholder="Enter project title"
              value={values.title}
              onChange={(event) =>
                setValues((prev) => ({
                  ...prev,
                  title: event.target.value,
                }))
              }
            />
            <InputControl
              label="Project Overview"
              placeholder="Project's brief overview"
              value={values.overview}
              onChange={(event) =>
                setValues((prev) => ({
                  ...prev,
                  overview: event.target.value,
                }))
              }
            />

            <div className="flex flex-col gap-[15px]">
              <div className="flex max-[600px]:flex-col justify-between items-center">
                <p className="font-[500] text-[#252525] text-[0.9rem]">Project Description</p>
                <p className="text-[#22c48b] font-bold text-[0.875rem] cursor-pointer" onClick={handleAddPoint}>
                  + Add point
                </p>
              </div>
              <div className="flex flex-col gap-[15px]">
                {values.points.map((item, index) => (
                  <div className="flex items-center gap-[10px] max-[600px]:justify-center" key={index}>
                    <InputControl
                      key={index}
                      placeholder="Type something..."
                      value={item}
                      onChange={(event) =>
                        handlePointUpdate(event.target.value, index)
                      }
                    />
                    {index > 1 && (
                      <X onClick={() => handlePointDelete(index)} className="h-[18px] w-[18px] cursor-pointer text-gray-400"/>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <p className="text-[0.875rem] font-bold text-[rgb(243,80,59)] text-center w-full">{errorMessage}</p>
        <div className="flex gap-[20px] justify-end items-center max-[600px]:flex-col">
          <p
            className="cursor-pointer transition-[200ms] text-gray-400 font-[500] text-[1rem] hover:text-[#000]"
            onClick={() => (props.onClose ? props.onClose() : "")}
          >
            Cancel
          </p>
          <button
            className="border-none outline-none py-[10px] px-[16px] bg-[#22c48b] text-[#fff] rounded-[5px] text-center w-fit text-[1.3rem] cursor-pointer hover:bg-[#36e4a6] transition-[200ms] active:translate-y-[1px] flex gap-[5px] justify-center items-center mt-5 disable:bg-gray-500 min-[601px]:ml-auto"
            onClick={handleSubmission}
            disabled={submitButtonDisabled}
          >
            Submit
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default ProjectForm;
