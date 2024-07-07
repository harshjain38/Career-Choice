import {useState} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Logo from "../UI/Logo/logo";
import Brain from "./brain.jpg";
import "./log.css";

function Login(){
    const navigate=useNavigate();

    const [ user, setUser] = useState({
        email:"",
        password:""
    })

    const handleChange = e => {
        const { name, value } = e.target
        setUser({
            ...user,
            [name]: value
        })
    }

    const login = async(e) => {
        e.preventDefault();
        document.getElementById('LoginButton').innerHTML='Logging in...';
        user.email=user.email.toLowerCase();

        await axios.post("https://api.careerchoice.pro/login", user)
        .then(res => {
            alert(res.data.message);
            document.getElementById('LoginButton').innerHTML='Log in';
            if(res.data.user && res.data.user._id){
                localStorage.setItem('currentUser',JSON.stringify({_id:res.data.user._id,email:res.data.user.email,name:res.data.user.name}));
                navigate("/");
            }
        })
        .catch(err => {
            document.getElementById('LoginButton').innerHTML='Log in';
            alert("Something went wrong. Try again later!");
            console.log(err);
        })
    }

    return (
        <div className="main">
            <Logo />
            <div className="brainDiv">
                <img className="brainImage" src={Brain} alt="img.png" />
            </div>
            <div className="log">
                <h1>Welcome back</h1>
                <form action="" onSubmit={(e)=>login(e)}>
                    <input type="email" name="email" value={user.email} onChange={handleChange} placeholder="Email Address" required/>
                    <input type="password" name="password" value={user.password} onChange={handleChange}  placeholder="Password" required />
                    <button className="button butup" id="LoginButton">Log in</button>
                </form>
                <div className="or">Do not have an account?</div>
                <button className="button" onClick={()=>navigate("/register")}>Sign up</button>
                {/* <div className="disclaimer">Disclaimer: You are about to converse with a Career Counsellor, which is essentially an AI based on a Large Language Model.</div>
                <div className="disclaimer">According to the “Spheres of Understanding” copyrighted Career Decision Making Model by Mr Saurabh Nanda, most people use the “Outside” sphere of understanding, which means they depend on external information for their decision making related to education and careers. This AI Career Counsellor intends to solve for that information which is not easily available at one single source on the internet. Most information is scattered, mis-leading, mis-interpreted, opinionated and biased for marketing purposes. Career Choice Pro intends to solve that and subsequently, we shall incorporate the other Spheres of Understanding as part of the AI Career Counsellor app.</div> */}
            </div>
        </div>
    )
}

export default Login;