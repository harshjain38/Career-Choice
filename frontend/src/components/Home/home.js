import classes from "./home.module.css";
import Login from "../Sign/login";
import Logo from "../UI/Logo/logo";

import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    return (
        // currentUser && currentUser._id
        // ? 
        <div className={classes.mainHome}>
            <Logo />
            
            <div className={classes.divCard} onClick={() => navigate("/search")}>
                <h1 className={classes["home-head"]}>Conversational Search</h1>
                <p className={classes["home-para"]}>Search like asking a real person and get human like response. Ask follow up questions.</p>
            </div>
            <div className={classes.divCard} onClick={() => navigate("/aicounsellor")}>
                <h1 className={classes["home-head"]}>AI Counsellor</h1>
                <p className={classes["home-para"]}>Your personal Career Counsellor. Ask anything related to your career and get Human like, Empathetic response.</p>
            </div>
            <div className={classes.divCard} onClick={() => navigate("/aimentor")}>
                <h1 className={classes["home-head"]}>AI Mentor</h1>
                <p className={classes["home-para"]}>Tired of listening to long videos/podcasts? We have made them conversational. Ask Questions, get Summaries, and many more.</p>
            </div>
            {/* <div className={classes.divCard}>
                <h1 className={classes["home-head"]}>Video Search</h1>
                <p className={classes["home-para"]}>Tired of listening to long videos/podcasts? We have made them conversational. Ask Questions, get Summaries, and many more.</p>
                <br />
                <p className={classes["home-para"]}>Will be available soon...</p>
            </div> */}
        </div>
        // : <Login />
    )
};

export default Home;