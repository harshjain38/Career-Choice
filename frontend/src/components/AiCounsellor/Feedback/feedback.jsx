import {useState} from "react";
import axios from "axios";
import Logo from "../../UI/Logo/logo";
import Login from "../../Sign/login";
import classes from "./feedback.module.css";

function Feedback(){
    const [ feedback,setFeedback ] = useState("");
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    const feed = async(e) => {
        e.preventDefault();
        
        document.getElementById('SubmitButton').innerHTML='Submitting...';
        await axios.post("https://api.careerchoice.pro/feedback",
        {
            email: currentUser.email,
            feedback : feedback.trim()
        })
        .then(res => {
            document.getElementById('SubmitButton').innerHTML='Submit';
            alert(res.data.message);    
            setFeedback("");
        })
        .catch(err => {
            document.getElementById('SubmitButton').innerHTML='Submit';
            alert("Something went wrong. Try again later!");
            setFeedback("");
            console.log(err);
        })
    }

    return (
        currentUser && currentUser._id
        ? <div className={classes.mainFeed} >
            <Logo />    
            <div className={classes.feed}>
                <h1 className={classes.feedhead}>Give Your Feedback</h1>
                <form action="" onSubmit={(e)=>feed(e)}>
                    <textarea 
                      name="feedback" 
                      value={feedback} 
                      placeholder="Give Feedback on what you liked and disliked"
                      onChange={(e) => setFeedback(e.target.value)} 
                      required
                    />
                    <button className={classes.feedBut} id="SubmitButton">Submit</button>
                </form>
            </div>
        </div>
        : <Login />
    )
}

export default Feedback;