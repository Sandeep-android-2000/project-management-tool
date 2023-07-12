import React, { useEffect, useState } from "react";
import designIcon from "../../assets/designer.svg";
import { getAllProjects } from "../../firebase";
import Spinner from "../Spinner/Spinner";
import { ArrowRight } from "react-feather";
import { useNavigate } from "react-router-dom";
import ProjectModal from "./ProjectModal/ProjectModal";
function Home(props) {
  const navigate = useNavigate();
  const isAuthenticated = props.auth ? true : false;

  const [projectsLoaded, setProjectsLoaded] = useState(false);

  const [projects, setProjects] = useState([]);
  const [showProjectModal,setShowProjectModal] = useState(false)
  const [projectDetails,setProjectDetails] = useState({})
  const handleNextButtonClick = () => {
    if (isAuthenticated) navigate("/account");
    else navigate("/login");
  };

  const fetchAllProjects = async () => {
    const result = await getAllProjects();
    setProjectsLoaded(true);
    if (!result) {
      return;
    }

    const tempProjects = [];
    result.forEach((doc) => tempProjects.push({ ...doc.data(), pid: doc.id }));

    setProjects(tempProjects);
  };

  const handleProjectCardClick = (project)=>{
    setShowProjectModal(true);
    setProjectDetails(project)
  }
  useEffect(() => {
    fetchAllProjects();
  },[]);
  return (
    <div className="h-full w-full min-h-screen">
      {
        showProjectModal && (
          <ProjectModal onClose = {()=> setShowProjectModal(false)} details = {projectDetails}/>
        )
      }
      <div className="p-[30px] flex items-center justify-evenly gap-[10px] bg-[#b7ffe6] w-full h-screen">
        <div className="flex flex-col gap-[30px]">
          <p className="font-bold text-[#1EE29C] text-5xl">Projects Fair</p>

          <p className="text-[2rem] font-semibold leading-[2.9rem] max-[600px]:text-[1.5rem]">
            One stop destination for all software development Projects
          </p>

          <button
            className="border-none outline-none py-[10px] px-[16px] bg-[#22c48b] text-[#fff] rounded-[5px] w-fit text-[1.3rem] cursor-pointer hover:bg-[#36e4a6] transition-[200ms] active:translate-y-[1px] flex gap-[5px] items-center max-[600px]:py-[4px] max-[600px]:px-[10px]"
            onClick={handleNextButtonClick}
          >
            {isAuthenticated ? "Manage your Projects" : "Get Started"}
            <ArrowRight />{" "}
          </button>
        </div>
        <div className="max-w-[45%]">
          <img
            src={designIcon}
            alt="Projects"
            className="object-contain w-full"
          />
        </div>
      </div>
       <div className="p-[30px] flex flex-col gap-[30px]">
        <p className="font-bold text-[1.4rem]">All Projects</p>
        <div className="flex gap-[30px] items-center justify-evenly flex-wrap">
          {projectsLoaded ? (
            projects.length > 0 ? (
              projects.map((item) => (
                <div
                  className="flex flex-col gap-[5px] rounded-[5px] overflow-hidden shadow-lg cursor-pointer"
                  key={item.pid} onClick={()=> handleProjectCardClick(item)}
                >
                  <div className="w-[300px] h-[160px]">
                    <img
                      src={
                        item.thumbnail ||
                        "https://www.agora-gallery.com/advice/wp-content/uploads/2015/10/image-placeholder-300x200.png"
                      }
                      alt="Thumbnail"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <p className="font-[500] text-[1rem] p-[20px]">
                    {item.title}
                  </p>
                </div>
              ))
            ) : (
              <p className="font-bold text-2xl">No Projects Found !!</p>
            )
          ) : (
            <Spinner />
          )}
        </div>
      </div> 
    </div>
  );
}

export default Home;
