/* SETUP */

import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const url = "./images/projectImages/";






/* ITEMS */

const Item = (props) => {
  const expand = () => props.expand(props.item);
  if (props.item.type === "skill") {
    return (<button className="skillButton" onClick={expand}>{props.item.id}</button>);
  } else if (props.item.type === "training") {
    return <SmallCard item={props.item} expand={expand} />
  } else {
    return (<Card item={props.item} expand={expand} />);
  }
}

const Card = (props) => {

  let skills = "";

  if (props.item.skills.length > 0) {
    skills = props.item.skills.slice(0,3).join(', ');
    if (props.item.skills.length > 3) skills += ",...";
  }

  let headline = props.item.type === "education"
  ? props.item.degree
  : props.item.type === "work"
  ? props.item.position
  : props.item.title;

  if (props.item.subject) headline += ` - ${props.item.subject}`;
  

  return (
  <div className="card" id={props.item.id} onClick={props.expand}>
    <div className="cardTop">
      <h3>{headline}</h3>
      {props.item.employer && <h3>{props.item.employerShort || props.item.employer}</h3>}
      {props.item.name && <h3>{props.item.cardName || props.item.name}</h3>}
    </div>
    <img src={url + props.item.image} alt={props.item.alt} />
    <div className="cardHover">
      {props.item.description && <p>{props.item.description}</p>}
    </div>
    <div className="cardBottom">
      <h4>{props.item.dates || skills}</h4>
    </div>
  </div>);
}

const SmallCard = (props) => {
  let skills = props.item.skills.slice(0,2).join(', ');
  if (props.item.skills.length > 2) skills += ",...";

  return (
    <div className="smallCard" onClick={props.expand}>
      <img src={url + props.item.image} alt={props.item.alt} />
      <div className="smallCardText">
        <h3>{props.item.title}</h3>
        <h3>{props.item.issuer}</h3>
        <h4>{skills}</h4>
      </div>
    </div>
  )
}







/* SECTIONS */

const MainSection = (props) => {
  const [show, toggleShow] = useState(false);

  const expand = (item) => props.expand(props.type, item);

  let title = [<h2 key={props.title}>{props.title}</h2>];
  if (props.subtitle) title.push(<h3 key={props.subtitle}>{props.subtitle}</h3>);

  let items = props.items.filter(item => item.featured)
  .sort((a,b) => {
    if (props.order) return props.order.indexOf(a.id) - props.order.indexOf(b.id);
    if (a.sortDate) return b.sortDate - a.sortDate;
    return 0;
  });

  if (show) {
    items = items.concat(props.items.filter(item => !item.featured)
    .sort((a,b) => {
      if (a.sortDate) return b.sortDate - a.sortDate;
      return 0;
    }));
  }

  return (
    <div className="mainSection" id={props.type}>
      {title}
      <div className={props.type}>
        {items.map(item => {
          return(<Item key={item.id} item={item} expand={expand} />);
        })}
      </div>
      <button className="moreButton" onClick={() => toggleShow(!show)}>{show ? "Less -" : "More +"}</button>
    </div>
  );
}






/* POPUP */

const PopUpSkill = (props) => {
  let popUpImage = url + "placeholder.jpg",
  popUpAlt = "Placeholder Image";

  let projects= props.item.items.filter(x => x.type === "project");

  if (projects.length > 0) {
    const randoProject = Math.floor(Math.random() * projects.length);
    popUpImage = url + projects[randoProject].image;
    popUpAlt = projects[randoProject].alt;
  }

  projects = projects.map(x => {
    let resp;
    let repoLocation = x.gitType || "Github";
    if (x.projectLink) {
      if (x.gitLink) {
        resp = <li><h5>{x.title}</h5>
        <ul>
          <li>{x.description}</li>
          <li>View Project: <a href={x.projectLink}>{x.projectLink}</a></li>
          <li>{repoLocation}: <a href={x.gitLink}>{x.gitLink}</a></li>
          </ul></li>;
      } else {
        resp = <li><h5>{x.title}</h5>
        <ul>
          <li>{x.description}</li>
          <li>View Project: <a href={x.projectLink}>{x.projectLink}</a></li>
          </ul></li>;
      }
    } else {
      resp = <li><h5>{x.title}</h5>
        <ul>
          <li>{x.description}</li>
          <li>{repoLocation}: <a href={x.gitLink}>{x.gitLink}</a></li>
          </ul></li>;
    }
    return resp;
  });

  let work= props.item.items.filter(x => x.type === "work");

    if ((popUpImage === url + "placeholder.jpg") && (work.length > 0)) {
      const randoWork = Math.floor(Math.random() * work.length);
      popUpImage = url + work[randoWork].image;
      popUpAlt = work[randoWork].alt;
    }

    work = work.map(job => {
      return (
        <li>{`${job.position}, ${job.employer} (${job.dates})`}</li>
      );
    });

    let education= props.item.items.filter(x => x.type === "education");

    if ((popUpImage === url + "placeholder.jpg") && (education.length > 0)) {
      const randoEdu = Math.floor(Math.random() * education.length);
      popUpImage = url + education[randoEdu].image;
      popUpAlt = education[randoEdu].alt;
    }

    education = education.map(school => {
      return (
        <li>{`${school.name}, ${school.degree} (${school.dates})`}</li>
      );
    });

    let training= props.item.items.filter(x => x.type === "training");

    if ((popUpImage === url + "placeholder.jpg") && (training.length > 0)) {
      const randoTrain = Math.floor(Math.random() * training.length);
      popUpImage = url + training[randoTrain].image;
      popUpAlt = training[randoTrain].alt;
    }

    training = training.map(course => {
      let assignments = [];
      if (course.assignments) {
        assignments = course.assignments.filter(assignment => assignment.skills.includes(props.item.id))
        .map(assignment => {
          let repoLocation = assignment.gitType || "Github";
          if (assignment.assignmentLink) {
            if (assignment.gitLink) {
              return (
                <li><a href={assignment.assignmentLink}>{assignment.title}</a> (<a href={assignment.gitLink}>{repoLocation}</a>)</li>
              );
            } else {
              return (
                <li><a href={assignment.assignmentLink}>{assignment.title}</a></li>
              );
            }
          } else {
            if (assignment.gitLink) {
              return (
                <li><a href={assignment.assignmentLink}>{assignment.title}</a> (<a href={assignment.gitLink}>{repoLocation}</a>)</li>
              );
            } else {
              return (<li>{assignment.title}</li>);
            }
          }
        });
      }
      if (assignments.length > 0) {
        return (
          <li><h5>{course.title}</h5> ({course.issuer}; {course.date})
          <br />
          {course.link && <a href={course.link}>Certificate</a>}
          <br />
          Relevant Assignments:
          <ul>{assignments}</ul>
          </li>
        );
      } else {
        return (
          <li><h5>{course.title}</h5> ({course.issuer}; {course.date})
          <br />
          {course.link && <a href={course.link}>Certificate</a>}</li>
        );
      }
    });

    return (
      <div id="theDivInsidePopUp">
        <div id="bar">
        <button onClick={props.close}>X</button>
        </div>
        <div id="popUpMain">
          <div id="popUpImage">
            <img src={popUpImage} alt={popUpAlt} />
          </div>
          <div id="popUpContent">
            <h3>{props.item.id}</h3>
            <div id="popUpDetails">
              {props.item.blurb && <p>{props.item.blurb}</p>}
              {projects.length > 0 && <h4>Projects</h4>}
              <ul>{projects}</ul>
              {work.length > 0 && <h4>Jobs</h4>}
              <ul>{work}</ul>
              {education.length > 0 && <h4>Education</h4>}
              <ul>{education}</ul>
              {training.length > 0 && <h4>Training and Certificates</h4>}
              <ul>{training}</ul>
            </div>
          </div>
        </div>
      </div>
    );

}

const PopUpOther = (props) => {
  let heading = props.item.position || props.item.title || props.item.degree;
  if (props.item.subject) heading += ` - ${props.item.subject}`;

  let subheading = props.item.name || props.item.employer || props.item.issuer;

  let dates = props.item.dates || props.item.date;

  let skills = props.item.skills.join(', ');

  let details = [];

  if (props.item.details) {
    details = props.item.details.map(detail => (<p>{detail}</p>));
  }

  let assignments = [];

  if (props.item.assignments) {
    assignments = props.item.assignments
    .map(assignment => {
      let repoLocation = assignment.gitType || "Github";
      if (assignment.assignmentLink) {
        if (assignment.gitLink) {
          return (
            <li><a href={assignment.assignmentLink}>{assignment.title}</a> (<a href={assignment.gitLink}>{repoLocation}</a>)</li>
          );
        } else {
          return (
            <li><a href={assignment.assignmentLink}>{assignment.title}</a></li>
          );
        }
      } else {
        if (assignment.gitLink) {
          return (
            <li><a href={assignment.assignmentLink}>{assignment.title}</a> (<a href={assignment.gitLink}>{repoLocation}</a>)</li>
          );
        } else {
          return (<li>{assignment.title}</li>);
        }
      }
    });
  }


  return (
    <div id="theDivInsidePopUp">
      <div id="bar">
      <button onClick={props.close}>X</button>
      </div>
      <div id="popUpMain">
        <div id="popUpImage">
          <img src={url + props.item.image} alt={props.item.alt} />
        </div>
        <div id="popUpContent">
          <h3>{heading}</h3>
          <h4>{subheading}</h4>
          {props.item.location && <h4>{props.item.location}</h4>}
          <h4>{dates}</h4>
          {props.item.link && <a href={props.item.link}>Certificate</a>}
          <div id="popUpDetails">
            {props.item.description && <p>{props.item.description}</p>}
            {details}
            {skills.length > 0 && <p><strong>Skills</strong>: {skills}</p>}
            {props.item.assignments && <h4>Assignments</h4>}
            <ul>{assignments}</ul>
            {props.item.projectLink && <p><a href={props.item.projectLink}>View live project</a></p>}
            {props.item.gitLink && <p><a href={props.item.gitLink}>Code on Github</a></p>}
          </div>
        </div>
      </div>
    </div>
  );
}

const PopUp = (props) => {

  if (props.item.type === "skill") {
    return (<PopUpSkill item={props.item} close={props.close} />);
  } else {
    return (<PopUpOther item={props.item} close={props.close} />);
  }


}







/* WHOLE THING */


const OnlineResume = (props) => {

  const [displayed, toggleDisplayed] = useState(false),
  [currentItem, changeItem] = useState({id: "", skills: []}),
  [showMenu, toggleMenu] = useState(false),
  [burgerHit, yesBurgerHit] = useState(false);

  const expand = (type,item) => {
    if (burgerHit) toggleMenu(false);
    changeItem(item);
    toggleDisplayed(true);
  }

  const contract = () => {
    toggleDisplayed(false);
  }

  let featured = props.data.featured;
  let blurbs = props.data.blurbs;
  let items = props.data.experiences.map(item => {
    item["featured"] = featured[item.type].includes(item.id);
    return item;
  });
  let project = items.filter(item => item.type === "project");
  let education = items.filter(item => item.type === "education");
  let work = items.filter(item => item.type === "work");
  let training = items.filter(item => item.type === "training");
  let skill = items.reduce((acc,item) => {
    const newSkills = item.skills.filter(skill => !acc.includes(skill));
    return acc.concat(newSkills);
  }, [])
  .map(skill => {
    return {
      "id": skill,
      "type": "skill",
      "featured": featured.skill.includes(skill),
      "items": items.filter(item => item.skills.includes(skill))
    }
  })
  .map(skill => {
    if (blurbs[skill.id]) skill["blurb"] = blurbs[skill.id];
    return skill;
  });

  return (
    <div id="content">
      <nav id="navbar">
        <div id="leftNav">
          <div id="contactLinks">
            <a href="mailto:#" alt="Email"><i className="fa fa-at"></i></a>
            <a href="#" alt="Github"><i className="fa fa-github"></i></a>
            <a href="#" alt="Linkedin"><i className="fa fa-linkedin"></i></a>
          </div>
          <div id="hamburger">
            <button onClick={() => {
              toggleDisplayed(false);
              toggleMenu(!showMenu);
              yesBurgerHit(true);
              }}><i className="fa fa-bars"></i></button>
          </div>
        </div>
        
        <div id="resumeLinks" style={showMenu ? {display: "flex"} : {display: "none"}} onClick={() => {
          if (burgerHit) toggleMenu(false);
          toggleDisplayed(false);
        }}>
          <a href="#skill">Skills</a>
          <a href="#education">Education</a>
          <a href="#work">Work</a>
          <a href="#project">Projects</a>
          <a href="#training">Certificates</a>
          <a href="#">Resume</a>
        </div>
      </nav>
      <div id="top">
        <div id="glamourShot">
          <img src="./images/placeholder.jpg" alt="Your Face" />
        </div>
        <div id="title">
          <h1>Your Name</h1>
          <h2>Some Thing | About | You</h2>
        </div>
      </div>
      <MainSection items={skill} order={featured.skill} title="Skills" subtitle="Click on a skill to see relevant experience" type="skill" expand={expand} />
      <MainSection items={project} title="Projects" type="project" expand={expand} />
      <MainSection items={education} title="Education" type="education" expand={expand} />
      <MainSection items={work} title="Work History" type="work" expand={expand} />
      <MainSection items={training} title="Certificates and Training" subtitle="Click on an item for more details" type="training" expand={expand} />
      <div className="mainSection" id="contactFooter">
        <h2>Contact</h2>
        <div id="contact">
          <a href="mailto:#" alt="Email"><i className="fa fa-at"></i> Email</a>
          <a href="#" alt="Github"><i className="fa fa-github"></i> Github</a>
          <a href="#" alt="Linkedin"><i className="fa fa-linkedin"></i> LinkedIn</a>
        </div>
      </div>
      <div id="goodbye">
            <p>Thanks for visiting!</p>
      </div>
      <div id="popUp" style={displayed ? {display: "flex"} : {display: "none"}}>
        <PopUp item={currentItem} close={contract} />
      </div>
    </div>
  );
}








/* GET RESUME DATA AND RENDER */

fetch('./resumeItems.json')
.then(response => response.json())
.then(data => {
  ReactDOM.render(<OnlineResume data={data} />, document.getElementById("root"));
});

