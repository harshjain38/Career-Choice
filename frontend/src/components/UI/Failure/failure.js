import Logo from "../Logo/logo";
import classes from "./failure.module.css";

const Failure = () => {
    return <div className={classes.mainFail}>
        <Logo />
        <h1 className={classes.headFail1}>404</h1>    
        <h1 className={classes.headFail2}>This page is not found!</h1>
    </div> 
}

export default Failure;