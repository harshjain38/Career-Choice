import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v1 } from 'uuid';
// import { useWhisper } from "@chengsokdara/use-whisper";
// import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import Login from "../../Sign/login";
import Logo from "../../UI/Logo/logo";
import Chats from "../Chat/chat";
import NavBar from "../../UI/NavBar/navbar";
import "./aicounsellor.css";
// import mic from "./microphone.png";

const AiCounsellor = props => {
  const [country, setCountry] = useState("");
  const [userMessage, setUserMessage] = useState("");
  const [chats, setChats] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  // const [count, setcount] = useState(true);
  // const [micdisable, setmicdisable] = useState(false);
  // const [lang, setlang] = useState("");
  // const [ttext, settext] = useState("");
  // const [islistining, setislistining] = useState(false);
  // const { transcript, resetTranscript } = useSpeechRecognition();

  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  // const { transcript, startRecording, stopRecording } = useWhisper({
  //   apiKey: `${process.env.REACT_APP_OPENAI_API_KEY}`,
  //   removeSilence: true,
  //   streaming: true,
  //   timeSlice: 1_000, // 1 second
  //   whisperConfig: {
  //     language: lang,
  //   },
  // });

  // const getlang = (e) => {
  //   e.preventDefault();
  //   setlang(e.target.value);
  // };

  // const startt = () => {
  //   transcript.text = "";
  //   settext("");
  //   setcount(false);
  //   setislistining(true);
  //   startRecording();
  //   // SpeechRecognition.startListening({ continuous: true , language: `${lang}` });
  // };

  // const runboth = async () => {
  //   setcount(true);
  //   stopRecording();
  //   setislistining(false);
  //   setmicdisable(true);
  //   if (ttext) {
  //     await chat(country,ttext);
  //   }
  //   settext("");
    // if (transcript) {
    //   await chat(country,transcript);
    // }
    // resetTranscript();
  //   setmicdisable(false);
  // };

  // useEffect(() => {
  //   settext(transcript.text);
  // }, [transcript.text, ttext]);

  const chat = async (e,country,userMess) => {
    e.preventDefault();

    if(!userMess.trim()){
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
      const response = await fetch("https://api.careerchoice.pro/career_streaming", {
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
          country: country,
          customer_message: msgg
        })
      });
        
      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      let co = 0;
      msgs.push({ role: "AI Counsellor", content: "" });
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

  const handleClick = () => {
    const uuidV2 = v1();
    props.setSessId(uuidV2.split('-')[0]);
    navigate("/aicounsellor/feedback"); 
  }

  return (
    // currentUser && currentUser._id
    //   ? 
      <main>
        <Logo />
        {/* <NavBar setSessId={props.setSessId} /> */}

        <h1 className="head1">AI Counsellor</h1>
        <Chats chats={chats} />

        <div className={isTyping ? "" : "hide"}>
          <p className="msgg">
            <span>
              <b>AI COUNSELLOR</b>
            </span>
            <span>:</span>
            <i> Typing...</i>
          </p>
        </div>

        {/* <div className={islistining ? "" : "hide"}>
          <p className="msgg">
            <span>
              <b>USER</b>
            </span>
            <span>:</span>
            <i> {ttext ?  ttext : "Listening..."}</i> */}
            {/* <i> {transcript ?  transcript : "Listening..."}</i> */}
          {/* </p>
        </div> */}

        <form className="aicounsellorForm" action="" onSubmit={(e)=>chat(e,country, userMessage)}>
          <input className={chats.length > 0 ? "inp hide" : "inp"} type="text" name="country" value={country} placeholder="Enter country name..." onChange={(e) => setCountry(e.target.value)} />
          <input className="inp" type="text" name="userMessage" value={userMessage} placeholder="Enter your message..." onChange={(e) => setUserMessage(e.target.value)} />
          <div>
            {/* <select onChange={getlang} className="but submit">
              <option value="en" defaultValue>
                English
              </option>
              <option value="hi">Hindi</option>
              <option value="gu">Gujarati</option>
              <option value="mr">Marathi</option>
              <option value="kn">Kannada</option>
              <option value="ta">Tamil</option>
              <option value="ne">Nepali</option>
              <option value="ja">Japanese</option>
              <option value="de">German</option>
              <option value="fr">French</option>
              <option value="zh">Chinese</option>
            </select> */}
            {/* {!micdisable ? (
              <button className="but micImg" onClick={count ? () => startt() : () => runboth()}><img className="micIcon" src={mic} alt="Mic Img" /></button>
            ) : (
              <button className="but micImg disable"><img className="micIcon" src={mic} alt="Mic Img" /></button>
            )} */}

            {/* {!micdisable ? (
              <button className="but submit" onClick={()=>chat(country, userMessage)}>Submit</button>
            ) : (
              <button className="but submit disable">Submit</button>
            )} */}
            <button className="but submit">Submit</button>
            <button className="but submit" onClick={handleClick}>End Conversation & Give Feedback</button>
          </div>
        </form>
        {/* <div className="feedButDiv">
          <button className="but" onClick={handleClick}>End Conversation & Give Feedback</button>
        </div> */}
      </main>
      // : <Login /> 
  );
}

export default AiCounsellor;