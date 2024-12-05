import Login from './Login';
import Signup from './Signup';
import Home from './Home';
import Explore from "./Explore";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Profile from './Profile';

function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
        <Route path="/explore" element={<Explore />} />
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;