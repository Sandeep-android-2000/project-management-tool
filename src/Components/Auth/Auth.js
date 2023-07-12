import React, { useState } from "react";
import InputControl from "../InputControl/InputControl";
import { Link, useNavigate} from "react-router-dom";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import {auth, updateUserDatabase} from '../../firebase'
function Auth(props) {
  const [values,setValues] = useState({
    name:"",
    email : "",
    password : "",

  })
  const [submitbuttonDisabled,setsubmitbuttonDisabled] = useState(false)
  const [errorMsg,setErrorMsg] = useState("")

  const isSignup = props.signup ? true : false;
  const navigate = useNavigate()
  
  const handleLogin = ()=>{
    if(!values.email || !values.password){
      setErrorMsg("All fields required");
      return;

    }
    setsubmitbuttonDisabled(true);
    signInWithEmailAndPassword(auth,values.email,values.password).then(
      async(response) => {
        
        setsubmitbuttonDisabled(false);
        navigate('/')

      }
    ).catch(err =>{
      setsubmitbuttonDisabled(false);
      setErrorMsg(err.message);
    })
  }
  const handleSignup = ()=>{
    if(!values.name || !values.email || !values.password){
      setErrorMsg("All fields required");
      return;

    }
    setsubmitbuttonDisabled(true);
    createUserWithEmailAndPassword(auth,values.email,values.password).then(
      async(response) => {
        const userId = response.user.uid;
        await updateUserDatabase({name : values.name,email:values.email},userId)
        setsubmitbuttonDisabled(false);
        navigate('/')

      }
    ).catch(err =>{
      setsubmitbuttonDisabled(false);
      setErrorMsg(err.message);
    })
  }
  const handleSubmission = (e)=>{
    e.preventDefault();
    if(isSignup) handleSignup();
    else handleLogin();
  }
  
  return (
    <div className="min-h-screen h-full w-full bg-gradient-to-r from-teal-500 to-cyan-200 flex justify-center items-center flex-col gap-[20px]">
      <form onSubmit = {handleSubmission} className="bg-white shadow-md rounded-[5px] p-[30px] w-fit min-w-[300px] relative">
        <p className="absolute left-[0%] top-[-28px] text-white font-bold cursor-pointer text-[0.95rem]">
          <Link to="/" className="text-white font-bold cursor-pointer text-[0.95rem] no-underline">{"< Back to Home"}</Link>
        </p>

        <p className="font-bold text-[1.5rem]">
          {isSignup ? "Signup" : "Login"}
        </p>

        {isSignup && (
          <InputControl label="Name" placeholder="Enter your name"  onChange={(event)=>setValues((prev)=>({...prev,name:event.target.value}))}/>
        )}
        <InputControl label="Email" placeholder="Enter your email"  onChange={(event)=>setValues((prev)=>({...prev,email:event.target.value}))}/>
        <InputControl label="Password" placeholder="Enter your password" onChange={(event)=>setValues((prev)=>({...prev,password:event.target.value}))} isPassword/>

        <p className="text-[0.875rem] font-bold text-[#f12929] w-full text-center">
          {errorMsg}
        </p>
        <button type = "submit" disabled = {submitbuttonDisabled} className="border-none outline-none py-[10px] px-[16px] bg-[#22c48b] text-[#fff] rounded-[5px] text-center w-full text-[1.3rem] cursor-pointer hover:bg-[#36e4a6] transition-[200ms] active:translate-y-[1px] flex gap-[5px] justify-center items-center mt-5 disable:bg-gray-500 ">
          {isSignup ? "Signup" : "Login"}
        </button>
        <div className="">
          {isSignup ? (
            <p className="text-[1rem] font-bold w-full text-center">
              Already have an account ?{" "}
              <Link
                className="text-[#22c48b] font-bold underline cursor-pointer"
                to="/login"
              >
                Login here
              </Link>
            </p>
          ) : (
            <p className="text-[1rem] font-bold w-full text-center">
              New here ? <Link to="/signup">Create an account</Link>{" "}
            </p>
          )}
        </div>
      </form>
    </div>
  );
}

export default Auth;
