import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Start from "./pages/Start";
import UserLogin from "./pages/UserLogin";
import CaptainLogin from "./pages/CaptainLogin";
import UserSignup from "./pages/UserSignup";
import CaptainSignup from "./pages/CaptainSignup";
import CaptainHome from "./pages/CaptainHome";
import CaptainProtectWrapper from "./components/CaptainProtectWrapper";
import UserProtectWrapper from "./components/UserProtectWrapper";
function App() {

  return (
      <div>
        <Routes>
          <Route path="/" element={<Start />} />
          <Route
            path="/home"
            element={
              <UserProtectWrapper>
                <Home />
              </UserProtectWrapper>
            }
          />
          <Route path="/login" element={<UserLogin/>} />
          <Route path="/signup" element={<UserSignup/>} />
          <Route path="/captain-login" element={<CaptainLogin />} />
          <Route path="/captain-signup" element={<CaptainSignup/>}/>
          <Route
            path="/captain-home"
            element={
              <CaptainProtectWrapper>
                <CaptainHome />
              </CaptainProtectWrapper>
            }
          />
        </Routes>
      </div>
  );
}

export default App;
