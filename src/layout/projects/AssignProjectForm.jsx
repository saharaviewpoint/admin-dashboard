import React, { useEffect, useState } from "react";
import { Container, Image, Form, Button } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import projectform from "./project.module.css";
import "./ProjectsForm.css";
import {
  useGetPMDetailsQuery,
  useGetProjectDetailsQuery,
  useGetSpecificProjectQuery,
  useAddpmDetailsMutation,
} from "../../app/services/auth/authService";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/DashboardLayout";

const AssignProjectForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [projectid, setProject] = useState("");

  const [assignpmDetailsMutation] = useAddpmDetailsMutation();

  const { data: ProjectManager, refetch } = useGetPMDetailsQuery({
    refetchOnMountArgChange: true,
  });

  const ProjectManagerCollection = ProjectManager || [];

  const { data: Projects } = useGetProjectDetailsQuery({
    refetchOnMountOrArgChange: true,
  });

  const ProjectsCollection = Projects || [];

  const filtereddata = ProjectsCollection.filter((item) => item._id === id);

  const filtereddatarevised = filtereddata.find((obj) => {
    return obj._id === id;
  });

  const projectcurrentid = id;

  const { register, control, reset, handleSubmit } = useForm({
    defaultValues: {
      name: filtereddatarevised?.name,
      details: filtereddatarevised?.details,
      size: filtereddatarevised?.size,
      budget: filtereddatarevised?.budget,
      facilities: filtereddatarevised?.facilities,
      building_type: filtereddatarevised?.building_type,
      site_condition: filtereddatarevised?.site_condition,
    },
  });

  useEffect(() => {
    reset();
  }, [filtereddatarevised]);

  const submitForm = async (data) => {
    const useradditionaldetails = {
      requested_by: filtereddatarevised.requested_by.id,
    };

    const completeform = {
      ...useradditionaldetails,
      ...data,
    };

    try {
      await toast.promise(
        assignpmDetailsMutation({
          id: projectcurrentid,
          data: completeform,
        }).unwrap(),
        {
          loading: "Saving Form",
          success: "Project Assigned Successfully",
          error: "Failed to create form",
        }
      );
      // reset();
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.status);
    }
  };

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     refetch();
  //   }, 1000);

  //   return () => clearInterval(interval);
  // }, []);

  const date = new Date(filtereddatarevised?.due);
  const futureDate = date.getDate() + 3;
  date.setDate(futureDate);
  const defaultValue = date.toLocaleDateString("en-CA");

  const [type, setType] = useState(defaultValue);

  function MyBooleanInput({ control, name }) {
    return (
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value, ref } }) => (
          <>
            <div className="radio-item">
              <label className={projectform.label}>
                <input
                  type="radio"
                  className={projectform.radioinput}
                  onBlur={onBlur} // notify when input is touched
                  onChange={() => onChange(true)} // send value to hook form
                  checked={value === true}
                  inputRef={ref}
                />
                <span className={projectform.label1}>Yes</span>
              </label>
            </div>
            <div className="radio-item">
              <label className={projectform.label}>
                <input
                  type="radio"
                  className={projectform.radioinput}
                  onBlur={onBlur} // notify when input is touched
                  onChange={() => onChange(false)} // send value to hook form
                  checked={value === false}
                  inputRef={ref}
                />
                <span className={projectform.label1}>No</span>
              </label>
            </div>
          </>
        )}
      />
    );
  }
  return (
    <Container className={projectform.container}>
      <DashboardLayout name="Projects">
        <div className={projectform.overallcontainer}>
          <p className={projectform.header}>Project Assign Form</p>
          <div className={projectform.secondheader}>
            <p className={projectform.header1}>PROJECT INFORMATION</p>
          </div>
          <form onSubmit={handleSubmit(submitForm)}>
            <div className={projectform.formcontainer}>
              <Form.Group className="mb-3" controlId="formBasicName">
                <div className={projectform.formcontainer1}>
                  <Form.Label className={projectform.form1}>
                    Assigned To
                  </Form.Label>
                  <Form.Select
                    aria-label="Default select example"
                    {...register("assigned_to")}
                  >
                    {ProjectManagerCollection.map((usercollect, index) => (
                      <option key={index} value={usercollect._id}>
                        {usercollect.firstname} {usercollect.lastname}
                      </option>
                    ))}
                  </Form.Select>
                </div>
              </Form.Group>
            </div>
            <div className={projectform.formcontainer1}>
              <Form.Group className="mb-3" controlId="formBasicTitle">
                <Form.Label className={projectform.form1}>
                  Project Title (for referencing project):
                </Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  {...register("name")}
                  placeholder="Type here..."
                  required
                />
              </Form.Group>
            </div>
            <div className={projectform.formcontainer}>
              <Form.Group className="mb-3" controlId="formBasicDue">
                <Form.Label className={projectform.form1}>
                  When do you need this?
                </Form.Label>
                <input
                  type="date"
                  id="due"
                  name="due"
                  value={type}
                  {...register("due")}
                  required
                  onChange={(e) => {
                    setType(e.target.value);
                  }}
                />
              </Form.Group>
            </div>
            <p className={projectform.header2}>PROJECT INFORMATION</p>
            <div className={projectform.formcontainer1}>
              <Form.Group className="mb-3" controlId="formBasicDetails">
                <Form.Label className={projectform.form1}>
                  Please provide detailed informaton about your project:
                </Form.Label>
                <Form.Control
                  type="text"
                  name="details"
                  placeholder="Type here..."
                  required
                  {...register("details")}
                />
              </Form.Group>
            </div>
            <div className={projectform.formcontainer1}>
              <Form.Group className="mb-3" controlId="formBasicSize">
                <Form.Label className={projectform.form1}>
                  Size of Site:
                </Form.Label>
                <Form.Control
                  type="text"
                  required
                  {...register("size")}
                  placeholder="Type here..."
                />
              </Form.Group>
            </div>
            <div className={projectform.formcontainer1}>
              <Form.Group className="mb-3" controlId="formBasicBudget">
                <Form.Label className={projectform.form1}>Budget:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Type here..."
                  required
                  {...register("budget")}
                />
              </Form.Group>
            </div>
            <div className={projectform.formcontainer1}>
              <Form.Group className="mb-3" controlId="buildinglocation">
                <Form.Label className={projectform.form1}>
                  Building Location:
                </Form.Label>
                <Form.Control
                  type="text"
                  required
                  {...register("facilities")}
                  placeholder="Type here..."
                />
              </Form.Group>
            </div>
            <div className={projectform.formcontainer1}>
              <Form.Group className="mb-3" controlId="buildingtype">
                <Form.Label className={projectform.form1}>
                  Building Type:
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Type here..."
                  required
                  {...register("building_type")}
                />
              </Form.Group>
            </div>
            <Form.Label className={projectform.form2}>
              Do You Have A Design?
            </Form.Label>
            <div className={projectform.radiocontainer}>
              {/* <Form> */}
              <MyBooleanInput control={control} name={"design"} />
              {/* </Form> */}
            </div>
            <div className={projectform.formcontainer1}>
              <Form.Group className="mb-3" controlId="formBasicSite">
                <Form.Label className={projectform.form1}>
                  What is Site Condition?
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Type here..."
                  {...register("site_condition")}
                  required
                />
              </Form.Group>
            </div>
            <div className={projectform.formcontainer1}>
              <Form.Group className="mb-3" controlId="buildingfacilities">
                <Form.Label className={projectform.form1}>
                  Facilities surrounding site and on site:
                </Form.Label>
                <Form.Control
                  type="text"
                  {...register("facilities")}
                  required
                  placeholder="Type here..."
                />
              </Form.Group>
            </div>

            <div className={projectform.absoluterightendcontainer}>
              <div className={projectform.flexbuttoncontainer}>
                <Button
                  className={projectform.cancelbutton}
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </Button>
                <Button type="submit" className={projectform.submitbutton}>
                  Submit Form
                </Button>
              </div>
            </div>
          </form>
        </div>
      </DashboardLayout>
      <Toaster
        position="top-left"
        reverseOrder={false}
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
    </Container>
  );
};

export default AssignProjectForm;
