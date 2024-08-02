import { Link } from "react-router-dom";
import homeImage from "./../../assets/images/home.gif";
import "./Home.css"; // Importieren der CSS-Datei für die Stildefinitionen

const Home = () => {
  const homeContent = {
    title: "Efficient Exam Creation and Evaluation",
    mainText:
      "You can now save resources by creating an effective test and get an automatic assessment that will save you a lot of time.",
    registrationLinkText: "Get Started",
  };

  return (
    <div style={{ marginTop: "12%" }}>
      <div className="firstContainerHo">
        <div className="image-containerHo">
          <img className="home-imgHo" src={homeImage} alt="Home Start image" />
        </div>
        <div className="text-containerHo">
          <div className="title1Ho">{homeContent.title}</div>
          <div className="paragraph1Ho">{homeContent.mainText}</div>
          <div className="d-flexHo">
            <Link to="/creation-test">
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
