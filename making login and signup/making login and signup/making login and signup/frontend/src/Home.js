import React, { useEffect } from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId"); // Get the userId from local storage

  const handleLogout = () => {
    // Remove userId from local storage
    localStorage.removeItem("userId");
    // alert("You have been logged out.");

    // Redirect to login page
    navigate("/");
  };

  useEffect(() => {
    if (!userId) {
      navigate("/"); // Redirect to login page if user is not logged in
    }
  }, [userId, navigate]);

  return (
    <>
      <div className="header">
        <a href="#default" className="logo">
          RAAS
        </a>
        <div className="header-right">
          {/* <a href={`/Profile`}>
            <button className="btns">Profile</button>
          </a> */}
          <a href={`/explore`}>
            <button className="btns">Explore</button>
          </a>
          <a
            onClick={(e) => {
              handleLogout(); // Call the logout function
            }}
            href="/"
          >
            <button className="btns">Logout</button>
          </a>
          <a href="http://localhost:3005">
            <button className="btns">Chatbot</button>
          </a>
        </div>
      </div>

      <section className="name">
        <center>
          <strong>
            <h1>RAAS</h1>
            <p>Your one-stop personal management website</p>
          </strong>
        </center>
      </section>

      <section className="container">
        <a href={`http://localhost:3001/userId=${userId}`}>
          <button className="btns">Mood Tracker</button>
        </a>
        <a href={`http://localhost:3010/?userId=${userId}`}>
          <button className="btns">Health and Fitness</button>
        </a>
        <a href={`http://localhost:5002/?userId=${userId}`}>
          <button className="btns">Recipes</button>
        </a>
        <a href={`http://localhost:5001/?userId=${userId}`}>
          <button className="btns">Manage Grocery</button>
        </a>
        <a href={`http://localhost:3002`}>
          <button>Manage Finances</button>
        </a>
        <a href={`http://localhost:3030`}>
          <button className="btns">Book Suggestions</button>
        </a>
        <a href="http://localhost:3040">
          <button className="btns">Quotes</button>
        </a>
        <a href={`http://localhost:3020/?userId=${userId}`}>
          <button className="btns">Notes</button>
        </a>
        <a href="http://127.0.0.1:5500/Remainder%20DB/reminder/homepage.html">
          <button className="btns">Manage Schedule</button>
        </a>
      </section>
      <footer>
        <div className="footer">
          <center><p>&copy; RAAS</p></center>
        </div>
      </footer>
    </>
  );
};

export default Home;
