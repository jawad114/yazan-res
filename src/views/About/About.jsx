import "./About.css";
import aboutImage from "./../../assets/images/about.png";

const aboutContent = {
  title: "About Us",
  mainText: "Welcome to our website to create a multiple choice test",
  paragraphs: [
    "Our platform helps the teacher create a test easily without complications.",
    "The main goal of our platform is to help create a test that contains questions and the accompanying options underneath.",
    "Thus, we avoid wasting resources and traditional methods in creating a multiple-choice test in which the questions are separate from the answers.",
    "Our platform will help evaluate the answered test automatically without the need for manual checking, thus saving another additional effort to evaluate the test manually.",
  ],
};

const renderParagraphs = () => {
  return aboutContent.paragraphs.map((text, index) => (
    <p key={index}>{text}</p>
  ));
};

const About = () => {
  return (
    <div className="containerAb">
      <div className="boxAb">
        <h4 className="titleAb">{aboutContent.title}</h4>
        <div className="grid-containerAb">
          <img src={aboutImage} alt="About" className="imgAb" />
          <div className="text-sectionAb">
            <h5 className="main-textAb">{aboutContent.mainText}</h5>
            {renderParagraphs()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
