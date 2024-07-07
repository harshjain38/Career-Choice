import React, { useEffect, useRef, useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import Logo from "../UI/Logo/logo";
import NavBar from "../UI/NavBar/navbar";
import Login from "../Sign/login";
import "./search.css";

function Search(props) {
  const [message, setmessage] = useState("");
  const [chats, setChats] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [link, setlink] = useState([]);
  let linkkk = [];
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  const msgref = useRef(null);

  useEffect(() => {
    msgref.current?.scrollIntoView();
  }, [chats, isTyping]);

  const getmessage = (e) => {
    setmessage(e.target.value);
  };

  const onsubmit = async (e) => {
    e.preventDefault();

    while (link.length > 0) {
      link.pop();
    }

    if (message.trim().length > 0) {
      setIsTyping(true);
      const msgg = message.trim();
      setmessage("");
      setIsTyping(true);

      let msgs = chats;
      msgs.push({ role: "USER", content: msgg });
      setChats(msgs);

      const url = "https://api.careerchoice.pro/search_streaming";

      const options = {
        method: "POST",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
          "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token"
        },
        body: JSON.stringify({
          user_id: props.sessId,
          customer_message: msgg,
          stream: true,
        }),
      };

      try {
        const response = await fetch(url, options);
        setIsTyping(false);

        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");

        msgs.push({ role: "AI", content: "" });
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            break;
          }

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          let parsedLines = [];
          lines.forEach((line) => {
            parsedLines.push(line);
          });
          setIsTyping(false);

          for (const parsedLine of parsedLines) {
            let str = parsedLine;
            if (str.indexOf("data:") >= 0) {
              msgs[msgs.length - 1].content += str.substring(
                0,
                str.indexOf("data:")
              );
              for (let j = 0; j < 6; j++) {
                const linkk = str
                  .substring(
                    str.indexOf(`${j}: '`),
                    str.indexOf(`', ${j + 1}:`)
                  )
                  .replace(`${j}: '`, "");
                linkkk.push(linkk);
                setlink((prevLinks) => [...prevLinks, linkk]);
              }
              return "";
            }
            if (str) {
              msgs[msgs.length - 1].content += str;
              setChats(() => {
                return [...msgs];
              });
            } 
            else {
              msgs[msgs.length - 1].content += "\n";
              setChats(() => {
                return [...msgs];
              });
            }
          }
        }
      } 
      catch(err) {
        setIsTyping(false);
        alert("Too many users are using it at this time. Please wait for some time and try again!");
        console.log(err);
      }
    }
  };

  return (
    currentUser && currentUser._id
    ? <div className="search">
      <Logo />
      <NavBar setSessId={props.setSessId} />
      <h1 className="heading">Search</h1>

      <div className="boxes">
        <div className="chat box">
          <div className="chatbox">
            {chats && chats.length
              ? chats.map((chat, index) => {
                  const texts = chat.content.split("\n");
                  return (
                    <div key={index}>
                      <div key={index} className="msg">
                        <span>
                          <b>{chat.role.toUpperCase()}</b>
                        </span>
                        <span> : </span>
                        {texts.map((item, index) => {
                          if ( item && index === texts.length - 2 && !texts[index + 1]){
                            return (
                              <span key={index}>
                                <span>{item}</span>
                              </span>
                            );
                          } 
                          else if (item) {
                            if (index !== texts.length - 1) {
                              return (
                                <span key={index}>
                                  <span>{item}</span>
                                  <br /><br />
                                </span>
                              );
                            } 
                            else {
                              return (
                                <span key={index}>
                                  <span>{item}</span>
                                </span>
                              );
                            }
                          }
                          return "";
                        })}
                      </div>
                      <div ref={msgref}></div>
                    </div>
                  );
                })
              : ""}
            {isTyping ? (
              <div className={`msg recived`} ref={msgref}>
                AI : Typing...
              </div>
            ) : (
              ""
            )}
          </div>

          <footer className="buttom">
            <form className="formSearch"
              action=""
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <input
                type="text"
                className="inp"
                onChange={getmessage}
                value={message}
                placeholder="Ask me anything..."
              />
               <div className="send">
                  <button onClick={onsubmit}>
                    <SendIcon className="send" />
                  </button>
                </div>
            </form>
          </footer>
        </div>

        {link.length >= 0 ? (
          <div className={`links box ${link.length<=0?"hidelinkbox":""}`}>
            <h3 className="h3">Related Links</h3>

            {link.map((l, i, k, j) => {
              return link ? (
                <div className="link" key={i}>
                  <a
                    href={l}
                    key={j}
                    className="a"
                    rel="noreferrer"
                    target="_blank"
                  >
                    {l}
                  </a>
                  {i < 6 ? <hr key={k} className="hr" /> : ""}
                </div>
              ) : "";
            })}
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
    : <Login />
  );
}

export default Search;