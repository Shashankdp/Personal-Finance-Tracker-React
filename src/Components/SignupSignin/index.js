import React, { useState } from 'react'
import "./style.css";
import Input from '../Input';
import Button from '../Button';
import { toast } from 'react-toastify';
import { GoogleAuthProvider, createUserWithEmailAndPassword , signInWithEmailAndPassword, signInWithPopup} from "firebase/auth";
import { auth , db, provider} from '../../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';



function SignupSigninComponent() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading,setLoading] = useState(false);
  const [loginForm, setLoginForm] = useState(false);
  const navigate = useNavigate();


  function signupWithEmail(){
    setLoading(true);
    //write your conditions here
    if(name!=="" && email!=="" && password!=="" && confirmPassword!==""){
      if(password==confirmPassword){
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in 
          const user = userCredential.user;
          console.log(user);
          toast.success("User Created!");
          setLoading(false);
          setEmail("");
          setPassword("");
          setConfirmPassword("");
          // ...

          //Create a doc with user id as the following id
          createDoc(user);

          navigate("/dashboard");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          toast.error(errorMessage);
          setLoading(false);
          // ..
        });
      }
      else{
        toast.error("Password and confirm password don't match")
        setLoading(false);
      }
      
    }
    else{
      toast.error("All fields are mandatory");
      setLoading(false);
    }
  }

  function loginUsingEmail(){
    console.log(email);
    console.log(password);
    setLoading(true);

    if(email!="" && password!=""){
      signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        toast.success("User Logged In!");
        console.log("User Logged In!",user);
        setLoading(false);
        createDoc(user);
        navigate("/dashboard");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setLoading(false);
        toast.error(errorMessage);
      });

    }
    else{
      toast.error("All fields are mandatory!");
      setLoading(false);
    }

  }


  async function createDoc(user){
    setLoading(true);
    // make sure that the doc with the uid doesn't exist
     // create a doc
     if(!user) return;

     const userRef = doc(db, "users", user.uid);
     const userData = await getDoc(userRef);

    if(!userData.exists()){
      try{
        await setDoc(doc(db, "users", user.uid), { 
          name: user.displayName ? user.displayName : name,
          email: user.email,
          photoURL : user.photoURL ? user.photoURL : "",
          createdAt : new Date(),
        });
        toast.success("Doc created!");
        setLoading(false);
      }
      catch(e){
        toast.error(e.message);
        setLoading(false);
      }
   }
   else{
    // toast.error("Doc Already Exists!");
    setLoading(false);
   }
 }

 function googleAuth(){
  setLoading(true);
  try{
      signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;

        // console.log(credential);
        // console.log(token);

        // The signed-in user info.
        const user = result.user;
        console.log(user);
        createDoc(user);
        setLoading(false);
        navigate("/dashboard");
        toast.success("User authenticated!");

        // IdP data available using getAdditionalUserInfo(result)
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        toast.error(errorMessage); 
      });
  }
  catch(e){
    toast.error(e.message);
  }
 }

  return (
    <>
      {loginForm ? 
        <div className='signup-wrapper'>
          <h2 className='title'>
            Login on <span style={{color: "var(--theme)"}}>Financely.</span>
          </h2>
          <form>
            <Input type="email" label={"email"} state={email} setState={setEmail} placeholder={"JohnDoe@gmail.com"} ></Input>
            <Input type="password" label={"Password"} state={password} setState={setPassword} placeholder={"Example@123"} ></Input>
            <Button disabled={loading} text={loading? "Loading..." : "Login Using Email and Password"} onClick={loginUsingEmail}></Button>
            <p className='p-login'>or</p>
            <Button onClick={googleAuth} text={loading? "Loading..." : "Login Using Google"} blue={true}></Button>

            <p className='p-login' onClick={()=>setLoginForm(!loginForm)}>Or Don't Have An Account? Click Here</p>
          </form>
        </div> 
      :
        <div className='signup-wrapper'>
          <h2 className='title'>
            Sign Up on <span style={{color: "var(--theme)"}}>Financely.</span>
          </h2>
          <form>
            <Input type="text" label={"full name"} state={name} setState={setName} placeholder={"John Doe"} ></Input>
            <Input type="email" label={"email"} state={email} setState={setEmail} placeholder={"JohnDoe@gmail.com"} ></Input>
            <Input type="password" label={"Password"} state={password} setState={setPassword} placeholder={"Example@123"} ></Input>
            <Input type="password" label={"Confirm Password"} state={confirmPassword} setState={setConfirmPassword} placeholder={"Example@123"} ></Input>
            <Button disabled={loading} text={loading? "Loading..." : "Signup Using Email and Password"} onClick={signupWithEmail}></Button>
            <p className='p-login'>or</p>
            <Button onClick={googleAuth} text={loading? "Loading..." : "Signup Using Google"} blue={true} ></Button>
            <p className='p-login' onClick={()=>setLoginForm(!loginForm)}>Or Have An Account? Click Here</p>
          </form>
        </div> } 
    </>
  )
}

export default SignupSigninComponent;