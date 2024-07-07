/* eslint react/prop-types: 0 */
// eslint-disable-next-line
/*eslint no-constant-condition: ["error", { "checkLoops": false }]*/
import { useState } from "react";
import DivLeft from "./divLeft";
import Response from "./response";
import SummaryForm from "./summaryForm";
import Login from "../../Sign/login";
import "./transcript.css";

function Transcript({transcripts,userId}) {
  const [query, setQuery] = useState("");
  const [chats, setChats] = useState([]);
  const [summary, setSummary] = useState("");
  const [selectedOption, setSelectedOption] = useState("option1");
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  const chat = async (e, query) => {
    e.preventDefault();

    if (!query){
      return;
    }

    let msgs=[];
    msgs.push("Typing...");
    setChats(msgs);

    try {
      // const response = await fetch("https://api.careerchoice.pro/youtube_query", {
      const response = await fetch("http://localhost:8080/youtube_query", {
        method: "POST",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
          "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token"
        },
        body: JSON.stringify({
          user_id: userId,
          customer_message: query
        })
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      msgs=[];
      msgs.push("");

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

        for (const parsedLine of parsedLines) {
          if (parsedLine === '#%#') {
            msgs[msgs.length-1] += '\n';
            continue;
          }
          msgs[msgs.length-1] += parsedLine;
          setChats(() => {
            return [...msgs];
          });
        }
      }
    }
    catch (err) {
      setChats([]);
      alert("Too many users are using it at this time. Please wait for some time and try again!");
      console.log(err);
    }
  };

  return (
    currentUser && currentUser._id
    ? <div className="main-trans">
      <div className="header">
        <hr className="hr1"/>
        <h1 className="head1-trans">SeAL</h1> 
        <h3 className="head2-trans">SeAL a novel framework designed to leverage the capabilities of advanced language models (LLMs) in handling transcribed speech.</h3>
        <hr className="hr2"/>
      </div>

      <div className="divcom">
        <DivLeft transcripts={transcripts} />

        <div className="divright">
          <select className="dropdown"
            value={selectedOption} 
            onChange={(e) => {setSelectedOption(e.target.value)}}
          >
            <option value="option1">Question and Answer</option>
            <option value="option2">Custom Summary</option>
          </select>

          {
            selectedOption==="option1" 
            ? <form action="" onSubmit={(e) => chat(e, query)}>
              <p className="question">Question:</p>
              <input
                className="inp-trans"
                type="text"
                name="query"
                value={query}
                placeholder="Ask Something about the transcript..."
                onChange={(e) => setQuery(e.target.value)}
              />
              <button className="generate">Generate</button>
            </form>
            : <SummaryForm transcript={transcripts[0]} setSummary={setSummary} />
          }

          <p className="question">Output:</p>
          <Response selectedOption={selectedOption} chats={chats} summary={summary} />

        </div>
      </div>
      {/* <audio src={audioLink} controls/> */}
    </div>
    : <Login />
  );
}

export default Transcript;
