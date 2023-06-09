import React, { useState, useRef } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { Container, Image, Form, Button } from "react-bootstrap";
import taskapproval from "./task.module.css";
import "./taskapproval.css";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetTaskDetailsQuery,
  useUseUpdateTaskApprovalMutation,
  useGetApprovalRequestQuery,
  useGetAllApprovalsQuery,
} from "../../app/services/auth/authService";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";

const TaskApprovalDashboard = () => {
  const { data: AdminTasks } = useGetTaskDetailsQuery({
    refetchOnMountOrArgChange: true,
  });

  const { data: approvalRequest } = useGetAllApprovalsQuery({
    refetchOnMountOrArgChange: true,
  });

  const approvalRequestCollection = approvalRequest || [];
  // const updatedTask = React.useRef(new Array());
  const [updatedTask, setUpdatedTask] = useState();
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: specificTask } = useGetApprovalRequestQuery(id);
  const specifictaskcollection = specificTask || [];
  const [updateTaskMutation] = useUseUpdateTaskApprovalMutation();
  const TaskCollection = AdminTasks || [];

  const { register, control, reset, handleSubmit } = useForm();

  const taskapprovalid = id;

  const submitForm = async (data) => {
    const completeform = {
      ...updatedTask,
      ...data,
    };

    try {
      await toast.promise(
        updateTaskMutation({ data: completeform, id: taskapprovalid }).unwrap(),
        {
          loading: "Saving Form",
          success: "File Uploaded Successfully",
          error: "Failed to create form",
        }
      );
      navigate("/task");
    } catch (error) {
      toast.error(error.status);
    }
  };

  return (
    <Container className={taskapproval.container}>
      <DashboardLayout name="Tasks">
        <div className={taskapproval.overallcontainer}>
          <p className={taskapproval.taskapprovaltitle}>Approval Request</p>
          <div className={taskapproval.secondtitlecontainer}>
            <p className={taskapproval.secondtitle}>Approval Information</p>
          </div>
          {TaskCollection.map((task, index) =>
            id === task.approval_id ? (
              <div key={index}>
                <Descritption title="Approval requested on:">
                  <p className={taskapproval.descriptioncontent}>
                    {new Date(task.date).toLocaleDateString()}
                  </p>
                </Descritption>
                <Descritption title="Task:">
                  <p className={taskapproval.descriptioncontent}>{task.name}</p>
                </Descritption>
                <Descritption title="Project:">
                  <p className={taskapproval.descriptioncontent}>
                    {task.project.name}
                  </p>
                </Descritption>
                <Descritption title="Requested by:">
                  <div className={taskapproval.yellowbackground}>
                    <div className={taskapproval.absolutecenter}>
                      {task?.assigned_to?.firstname &&
                      task?.assigned_to.lastname ? (
                        <>
                          <p className={taskapproval.avatar}>
                            <span className={taskapproval.label}>
                              {task?.assigned_to?.firstname?.charAt(0)}
                            </span>
                            <span className={taskapproval.label}>
                              {task?.assigned_to?.lastname?.charAt(0)}
                            </span>
                          </p>
                          <span className={taskapproval.label1}>
                            {task?.assigned_to?.firstname}{" "}
                            {task?.assigned_to?.lastname}
                          </span>
                        </>
                      ) : (
                        <div className={taskapproval.absolutecenter}>
                          <p className={taskapproval.unassigned}>Unassigned</p>
                        </div>
                      )}
                    </div>
                  </div>
                </Descritption>
                <Descritption title="Started:">
                  <p className={taskapproval.descriptioncontent}>
                    {" "}
                    {new Date(task.date).toLocaleDateString()}
                  </p>
                </Descritption>
                <Descritption title="Due date:">
                  <p className={taskapproval.descriptioncontent}>
                    {" "}
                    {new Date(task.due).toLocaleDateString()}
                  </p>
                </Descritption>
                <form onSubmit={handleSubmit(submitForm)}>
                  <div className={taskapproval.secondtitlecontainer}>
                    <p className={taskapproval.secondtitle}>Response</p>
                  </div>
                  <Descritption title="Status">
                    <Form.Check
                      defaultChecked
                      type="radio"
                      {...register("status")}
                      required
                      name="status"
                      value="Approved"
                      id="custom-switch"
                      label="Approved"
                    />
                    <Form.Check
                      {...register("status")}
                      type="radio"
                      name="status"
                      value="Declined"
                      id="custom-switch2"
                      label="Declined"
                    />
                  </Descritption>
                  <DescritptionTextArea title="Comments:">
                    <Form.Control
                      as="textarea"
                      className={taskapproval.textarea}
                      rows={3}
                      {...register("comments")}
                      placeholder="Type here"
                    />
                  </DescritptionTextArea>
                  <Toaster
                    position="top-left"
                    gutter={8}
                    containerClassName=""
                    containerStyle={{}}
                    toastOptions={{
                      // Define default options
                      className: "",
                      duration: 5000,
                      style: {
                        background: "#363636",
                        color: "#fff",
                        fontFamily: "Inter, sans-serif",
                      },

                      // Default options for specific types
                      success: {
                        duration: 3000,
                        theme: {
                          primary: "green",
                          secondary: "black",
                        },
                      },
                    }}
                  />
                  <div className={taskapproval.absoluterightendcontainer}>
                    <div className={taskapproval.flexbuttoncontainer}>
                      <Button
                        className={taskapproval.cancelbutton}
                        onClick={() => navigate(-1)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className={taskapproval.sharebutton}
                        onClick={() => setUpdatedTask(task)}
                      >
                        Submit Form
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            ) : null
          )}
        </div>
      </DashboardLayout>
    </Container>
  );
};

export default TaskApprovalDashboard;

const Descritption = (props) => {
  return (
    <div className={taskapproval.descriptioncontainer}>
      <div className={taskapproval.absolutecenter}>
        <p className={taskapproval.descriptiontitle}>{props.title}</p>
      </div>
      {props.children}
    </div>
  );
};

const DescritptionTextArea = (props) => {
  return (
    <div className={taskapproval.descriptioncontainer}>
      <p className={taskapproval.descriptiontitle}>{props.title}</p>
      {props.children}
    </div>
  );
};
