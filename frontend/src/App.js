import Home from "./components/Home/home.js";
import Login from "./components/Sign/login.jsx";
import Register from "./components/Sign/register.jsx";
import AiCounsellor from "./components/AiCounsellor/AiCounsellor/aicounsellor.jsx";
import Feedback from "./components/AiCounsellor/Feedback/feedback.jsx";
// import Playground from "./components/Video Analysis/Playground/playground.jsx";
// import Transcript from "./components/Video Analysis/Transcript/transcript.jsx";
import Search from "./components/Search/search.js";
import Mentor from "./components/Mentor/mentor.js";
import Failure from "./components/UI/Failure/failure.js";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { v1 } from 'uuid';

const App = () => {
  // const [transcripts,setTranscripts] =useState([]);
  // const [userId,setUserId] = useState("");

  const uuidV1 = v1();
  const [sessId,setSessId] = useState(uuidV1.split('-')[0]);

  return <div>
      <Router>
        <Routes>
          <Route exact path="/" element={<Home />}  />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/aicounsellor" element={<AiCounsellor sessId={sessId} setSessId={setSessId} />} />
          <Route path="/aicounsellor/feedback" element={<Feedback />} />
          <Route path="/aimentor" element={<Mentor sessId={sessId} setSessId={setSessId}/>} />
          {/* <Route path="/playground" element={<Playground setTranscripts={setTranscripts} setUserId={setUserId} setSessId={setSessId}/>} />
          <Route path="/playground/transcript" element={<Transcript transcripts={transcripts} userId={userId}/>} /> */}
          <Route path="/search" element={<Search sessId={sessId} setSessId={setSessId} />} />
          <Route path="/*" element={<Failure />} />
        </Routes>
      </Router>
    </div>
}

export default App;
