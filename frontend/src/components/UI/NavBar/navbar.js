import { useNavigate } from "react-router-dom";
import { v1 } from 'uuid';
import classes from "./navbar.module.css";

const NavBar = props => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const navigate = useNavigate();

    const handleLogout = () => {
        const uuidV1 = v1();
        props.setSessId(uuidV1.split('-')[0]);
        localStorage.removeItem('currentUser');
        navigate("/login");
    }

    return <div className={classes.navbar}>
        <button className={classes.butt} onClick={handleLogout}>Logout</button>
        <div className={classes.firstName}>{currentUser.name.split(' ')[0].toUpperCase()}</div>
    </div>
}

export default NavBar;