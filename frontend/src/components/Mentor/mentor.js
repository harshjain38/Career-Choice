import { useState } from "react";
import axios from "axios";
import Login from "../Sign/login";
import Logo from "../UI/Logo/logo";
import Chats from "../AiCounsellor/Chat/chat";
import NavBar from "../UI/NavBar/navbar";
import classes from "./mentor.module.css";

const Mentor = props => {
    const [pdfInp, setPdfInp] = useState(true);
    const [userMessage, setUserMessage] = useState("");
    const [chats, setChats] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [pdfContent,setPdfContent]=useState('');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    const chat = async (e, userMess) => {
        e.preventDefault();

        if (!userMess.trim()) {
            return;
        }
        const msgg = userMess.trim();
        setUserMessage("");
        setIsTyping(true);
        window.scrollTo(0, 1e10);

        let msgs = chats;
        msgs.push({ role: "user", content: msgg });
        setChats(() => {
            return [...msgs];
        });

        try {
            const response = await fetch("https://api.careerchoice.pro/mentor_streaming", {
                method: "POST",
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
                    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token"
                },
                body: JSON.stringify({
                    unique_id: currentUser.email,
                    session_id: props.sessId,
                    report: pdfContent,
                    customer_message: msgg
                })
            });

            const reader = response.body.getReader();
            const decoder = new TextDecoder("utf-8");

            let co = 0;
            msgs.push({ role: "AI Mentor", content: "" });
            while (true) {
                const { done, value } = await reader.read();
                if (done) {
                    break;
                }

                const chunk = decoder.decode(value);
                const lines = chunk.split("\n");

                let parsedLines = [];
                let c = 0;
                lines.forEach((line) => {
                    if (line.includes("data:")) {
                        c = 0;
                        let arr = line.split("data: ");
                        arr.forEach((item, idx) => {
                            if (idx !== 0) {
                                parsedLines.push(item);
                            }
                        });
                    }
                    else {
                        c++;
                        if (c > 2) {
                            c = 0;
                            parsedLines.push('#%#');
                        }
                    }
                });
                setIsTyping(false);
                for (const parsedLine of parsedLines) {
                    if (parsedLine === ":" && co === 0) {
                        co = 1;
                        continue;
                    }
                    if (parsedLine === '#%#') {
                        msgs[msgs.length - 1].content += '\n';
                        continue;
                    }
                    if (parsedLine !== "CC") {
                        msgs[msgs.length - 1].content += parsedLine;
                        setChats(() => {
                            return [...msgs];
                        });
                    }
                }
            }
            setUserMessage("");
        }
        catch (err) {
            setIsTyping(false);
            alert("Too many users are using it at this time. Please wait for some time and try again!");
            console.log(err);
        }
    };

    const handleChange = async () => {
        let selectedFile = document.getElementById('pdfInp').files[0];
        document.getElementById('pdfInpBtn').innerHTML='Uploading...';

        try{
            const form = new FormData();
            form.append('user_id', props.sessId);
            form.append('pdf_file', selectedFile);
    
            const url = 'https://api.careerchoice.pro/pdf_upload';
            const response = await axios.post(url, form, {
                headers: {
                    "Content-Type": `multipart/form-data; boundary=${form._boundary}`
                },
            });
            setPdfContent(response.data);
            setPdfInp(false);
        }
        catch(err){
            alert("Something went wrong. Try again later!");
            console.log(err);
        }
        document.getElementById('pdfInpBtn').innerHTML='Upload PDF';
    }

    return (
        // currentUser && currentUser._id
        //     ? 
            <main>
                <Logo />
                {/* <NavBar setSessId={props.setSessId} /> */}

                <h1 className={classes.head1}>AI Mentor</h1>
                <Chats chats={chats} />

                <div className={isTyping ? "" : classes.hide}>
                    <p className={classes.msgg}>
                        <span>
                            <b>AI MENTOR</b>
                        </span>
                        <span>:</span>
                        <i> Typing...</i>
                    </p>
                </div>

                {
                    pdfInp
                        ? <form className={classes.inputForm}>
                            <label htmlFor="pdfInp" className={classes.uploadPdf} id='pdfInpBtn'>Upload PDF</label>
                            <input type="file" className={classes.hide} id="pdfInp" onChange={handleChange} />
                        </form>
                        : <form className={classes.inputForm} onSubmit={(e) => chat(e, userMessage)}>
                            <input className={classes.inp} type="text" name="userMessage" value={userMessage} placeholder="Enter your question..." onChange={(e) => setUserMessage(e.target.value)} />
                            <button className={`${classes.but} ${classes.submit}`}>Submit</button>
                        </form>
                }
            </main>
            // : <Login />
    );
}

export default Mentor;