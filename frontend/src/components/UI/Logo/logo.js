import { useNavigate } from "react-router-dom";
import classes from "./logo.module.css";
import logo from "./logo.png";

const Logo = () => {
    const navigate=useNavigate();
    return <div className={classes.logo} onClick={()=> navigate("/")}>
        <img src={logo} alt="Logo Img" className={classes["logo-img"]}/>
    </div>
}

export default Logo;