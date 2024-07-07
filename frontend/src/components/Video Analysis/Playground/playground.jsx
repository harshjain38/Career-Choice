/* eslint react/prop-types: 0 */
// eslint-disable-next-line
/*eslint no-constant-condition: ["error", { "checkLoops": false }]*/
import { useState } from "react";
import InputForm from "./inputForm";
import Logo from "../../UI/Logo/logo";
import Login from "../../Sign/login";
import NavBar from "../../UI/NavBar/navbar";
import "./playground.css";

function Playground({setTranscripts,setUserId,setSessId}) {
  const [load, setLoad] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  return (
    currentUser && currentUser._id
    ? <div className="main-play">
      <Logo />
      <NavBar setSessId={setSessId} />

      {
        load
        ? <div className="load">
            <Logo />
            <div className="load-content">
              <img width="70" height="70" src="https://img.icons8.com/external-others-inmotus-design/67/000000/external-S-alphabet-others-inmotus-design-14.png" alt="external-S-alphabet-others-inmotus-design-14"/>
              <h2 className="load-head">First, we're transcribing your audio file.</h2>
              <h2 className="load-para">This can take a few minutes. Audio files several hours long may take some time.</h2>
            </div>
          </div>
        : ""
      }

      <h1 className="head1-play">INTRODUCING</h1>
      <h1 className="head2-play">SeAL</h1>
      <p className="head3-play">We present SeAL a novel framework designed to leverage the capabilities of advanced language models (LLMs) in handling transcribed speech. By simply using a single line of code, SeAL enables efficient processing of large audio transcripts encompassing few hundred thousand tokens, at one go. This streamlined approach facilitates tasks such as summarization and question answering with speed and effectiveness.</p>

      <InputForm setTranscripts={setTranscripts} setUserId={setUserId} setLoad={setLoad} />
    </div>
    : <Login />
  );
}

export default Playground;
