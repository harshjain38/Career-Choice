import { useState } from "react"
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Logo from "../UI/Logo/logo";
import Brain from "./brain.jpg";
import "./log.css"

const Register = () => {
    const navigate=useNavigate();

    const [ user, setUser] = useState({
        name: "",
        email:"",
        password:"",
        reEnterPassword: ""
    })

    const handleChange = e => {
        const { name, value } = e.target
        setUser({
            ...user,
            [name]: value
        })
    }

    const register = (e) => {
        e.preventDefault();
        document.getElementById('SignUpButton').innerHTML='Signing up...';
        user.email=user.email.toLowerCase();
        
        if( user.password === user.reEnterPassword){
            axios.post("https://api.careerchoice.pro/register", user)
            .then( res => {
                document.getElementById('SignUpButton').innerHTML='Sign up';
                alert(res.data.message);
                navigate("/login");
            })
            .catch(err => {
                document.getElementById('SignUpButton').innerHTML='Sign up';
                alert("Something went wrong. Try again later!");
                console.log(err);
                navigate("/login");
            })
        } 
        else {
            alert("Invalid Input!");
        }
    }

    return (
        <div className="main reg">
            <Logo />
            <div className="brainDiv">
                <img className="brainImage" src={Brain} alt="img.png" />
            </div>
            <div className="log regi">
                <h1>Create your account</h1>
                <form action="" onSubmit={(e)=>register(e)}>
                    <input type="text" name="name" value={user.name} placeholder="Full Name" onChange={ handleChange } required/>
                    <input type="email" name="email" value={user.email} placeholder="Email Address" onChange={ handleChange } required/>
                    <input type="password" name="password" value={user.password} placeholder="Password" onChange={ handleChange } minLength={8} required/>
                    <input type="password" name="reEnterPassword" value={user.reEnterPassword} placeholder="Re-enter Password" onChange={ handleChange } minLength={8} required/>
                    <button className="button butup" id="SignUpButton">Sign up</button>
                </form>
                <div className="or">Already have an account?</div>
                <button className="button" onClick={() => navigate("/login")}>Log in</button>
            </div>
            {/* <div className="disclaimer">Disclaimer: You are about to converse with a Career Counsellor, which is essentially an AI based on a Large Language Model.</div>
            <div className="disclaimer">According to the “Spheres of Understanding” copyrighted Career Decision Making Model by Mr Saurabh Nanda, most people use the “Outside” sphere of understanding, which means they depend on external information for their decision making related to education and careers. This AI Career Counsellor intends to solve for that information which is not easily available at one single source on the internet. Most information is scattered, mis-leading, mis-interpreted, opinionated and biased for marketing purposes. Career Choice Pro intends to solve that and subsequently, we shall incorporate the other Spheres of Understanding as part of the AI Career Counsellor app.</div> */}
        </div>
    )
}

export default Register;