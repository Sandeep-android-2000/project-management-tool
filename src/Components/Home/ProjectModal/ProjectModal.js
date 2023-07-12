import React from "react";
import { Link } from "react-router-dom";
import { GitHub, Paperclip } from "react-feather";

import Modal from "../../Modal/Modal";

function ProjectModal(props) {
  const details = props.details;

  return (
    <Modal onClose={() => (props.onClose ? props.onClose() : "")}>
      <div className="p-[30px] flex flex-col gap-[30px] min-w-[650px]">
        <p className="text-[1.5rem] font-bold">Project Details</p>
        <div className="flex gap-[30px] ">
          <div className="flex-1 flex flex-col gap-[30px]">
            <div className="h-[160px] w-[280px]">
              <img
                src={
                  details?.thumbnail ||
                  "https://www.agora-gallery.com/advice/wp-content/uploads/2015/10/image-placeholder-300x200.png"
                }
                alt="Project thumbnail"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex justify-evenly items-center">
              <Link
                target="_blank"
                to={`//${details.github}`}
                className="h-[22px] w-[22px] cursor-pointer text-[#22c48b]"
              >
                <GitHub />
              </Link>
              <Link
                target="_blank"
                to={`//${details.link}`}
                className="h-[22px] w-[22px] cursor-pointer text-[#22c48b]"
              >
                <Paperclip />
              </Link>
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-[30px]">
            <p className="font-[500] text-[1.2rem]">{details.title}</p>
            <p className="text-[1rem] text-gray-700">{details.overview}</p>
            <ul className="flex flex-col gap-[8px] pl-[15px]">
              {details.points.map((item) => (
                <li key={item} className="text-[1rem] text-slate-700">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default ProjectModal;
