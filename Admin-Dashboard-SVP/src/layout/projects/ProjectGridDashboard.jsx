import React, { useState, useMemo } from "react";
import { Container, Image, Button } from "react-bootstrap";
import project from "./project.module.css";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import Header from "../../components/project/Header";
import TableHeaderNav from "../../components/project/TableHeaderNav";
// import TableDisplay from "../../../components/User/Project/TableDisplay";
import ProjectGridContainer from "../../components/project/ProjectGridContainer";
import { ButtonProject } from "../../components/dashboard/DashboardContents";
import { ProjectsCollection } from "../../../data/projects";

const ProjectGridDashboard = () => {
  const [filter, setFilter] = useState(null);

  const data = useMemo(() => {
    if (!filter) return ProjectsCollection;
    const filteredData = ProjectsCollection.filter(
      (item) => item.activestatus === filter
    );
    return filteredData;
  }, [filter]);

  const filteredInProgressData = ProjectsCollection.filter(
    (item) => item.activestatus === "In Progress"
  );

  const filteredUpcomingData = ProjectsCollection.filter(
    (item) => item.activestatus === "Upcoming"
  );

  const filteredCompleteData = ProjectsCollection.filter(
    (item) => item.activestatus === "Complete"
  );
  return (
    <Container className={project.container}>
      <DashboardLayout name="Projects">
        <div className={project.overallcontainer}>
          <ButtonProject />
          <Header name="My Projects" />
          {/* <div className={project.absolutecenter}> */}
          <div className={project.leftcontainer}>
            <div className={project.flexwrap}>
              <NavCategories
                name="All Projects"
                filter={filter}
                filter1={null}
                total={`(${ProjectsCollection.length})`}
                onClick={() => setFilter(null)}
              />

              <NavCategories
                name="Upcoming"
                filter={filter}
                filter1="Upcoming"
                total={`(${filteredUpcomingData.length})`}
                onClick={() => setFilter("Upcoming")}
              />
              <NavCategories
                name="In Progress"
                filter1="In Progress"
                filter={filter}
                total={`(${filteredInProgressData.length})`}
                onClick={() => setFilter("In Progress")}
              />
              <NavCategories
                name="Completed"
                filter={filter}
                filter1="Complete"
                total={`(${filteredCompleteData.length})`}
                onClick={() => setFilter("Complete")}
              />
            </div>
            <TableHeaderNav />
          </div>
          {/* </div> */}
          <div className={project.wrap}>
            {data.map((projectcollect, index) => (
              <ProjectGridContainer
                key={index}
                text={projectcollect.name}
                date={projectcollect.date}
                status={projectcollect.status}
                priority={projectcollect.priority}
              >
              </ProjectGridContainer>
            ))}
          </div>
        </div>
      </DashboardLayout>
    </Container>
  );
};

export default ProjectGridDashboard;

const ImageIcon = (props) => {
  return <Image src={`${props.imagelink}`} alt="priority" />;
};

const NavCategories = (props) => {
  const active = props.filter === props.filter1;
  return (
    <Button
      className={
        active ? project.tablenavcontaineractive : project.tablenavcontainer
      }
      onClick={props.onClick}
    >
      {/* <p className={project.tablenavtext}> */}
      {props.name}
      <span>{props.total}</span>
      <span className={project.disappear}>{props.filter}</span>
      <span className={project.disappear}>{props.filter1}</span>
      {/* </p> */}
    </Button>
  );
};
