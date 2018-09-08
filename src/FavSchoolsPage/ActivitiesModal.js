import React from "react";
import { Button, Modal, Container, ModalHeader, ModalBody, Input } from "reactstrap";

class ActivitiesModal extends React.Component {
  state = {
    submitSuccess: false,
    submitError: false
  };

  render() {
    return (
      <Modal isOpen={this.props.modal} toggle={this.props.toggleActivity} className={this.props.className}>
        <Container>
          <ModalHeader toggle={this.props.toggleActivity}>Activity Log</ModalHeader>{" "}
          <ModalBody>
            <div className="col-lg-12 col-sm-6 col-12">
              <div className="jr-card">
                <div className="jr-card-header d-flex">
                  {this.props.showActivitiesError == false ? (
                    <div className="mr-auto">
                      <div>
                        <h3 className="card-heading" style={{ display: "inline-block" }}>
                          Recent Activities
                        </h3>
                        {this.props.logEditMode ? (
                          <Button
                            className="jr-btn jr-flat-btn jr-btn-primary btn btn-default"
                            style={{
                              display: "inline-block",
                              position: "relative",
                              left: "420px",
                              paddingTop: "6px",
                              paddingBottom: "6px",
                              paddingLeft: "12px",
                              paddingRight: "12px"
                            }}
                            onClick={this.props.handleActivityEditList}
                            color="blue-grey"
                          >
                            <span>Done</span>
                          </Button>
                        ) : (
                          <Button
                            className="jr-btn jr-flat-btn jr-btn-primary btn btn-default"
                            style={{
                              display: "inline-block",
                              position: "relative",
                              left: "220%",
                              paddingTop: "6px",
                              paddingBottom: "6px",
                              paddingLeft: "12px",
                              paddingRight: "12px"
                            }}
                            onClick={this.props.handleActivityEditList}
                            color="blue-grey"
                          >
                            <i className="zmdi zmdi-edit zmdi-hc-fw" />
                            <span>Edit</span>
                          </Button>
                        )}
                      </div>
                      <div>
                        <p className="sub-heading">Last activity was 2 days ago</p>
                      </div>
                    </div>
                  ) : (
                    <div className="mr-auto">
                      <h2
                        className="card-heading"
                        style={{
                          position: "relative",
                          left: "40%",
                          top: "40%"
                        }}
                      >
                        There are no recent activities to display
                      </h2>
                    </div>
                  )}
                </div>
                {this.props.activitiesArray &&
                  this.props.activitiesArray.map(activity => (
                    <React.Fragment key={activity.Id}>
                      <div className="media social-list-line">
                        <div className="bg-white icon-btn user-avatar size-40 z-index-20 align-item-self mr-3">
                          {activity.Initiator == "Me" ? (
                            <img className="rounded-circle avatar size-40" src={this.props.userProfilePic} />
                          ) : (
                            <img className="rounded-circle avatar size-40" src={this.props.currentSchoolLogo} />
                          )}
                        </div>
                        <div className="media-body">
                          <h4 className="mb-1">{activity.Notes}</h4>
                          <p className="meta-date">{activity.DateContacted.substring(0, 10)}</p>
                          {this.props.logEditMode && (
                            <React.Fragment>
                              <Button
                                className="jr-btn jr-flat-btn jr-btn-primary btn btn-default"
                                style={{
                                  display: "inline-block",
                                  position: "relative",
                                  left: "385px",
                                  top: "-25px",
                                  paddingTop: "6px",
                                  paddingBottom: "6px",
                                  paddingLeft: "12px",
                                  paddingRight: "12px"
                                }}
                                onClick={() => {
                                  this.props.handleActivityUpdateList(
                                    activity.Notes,
                                    activity.DateContacted,
                                    activity.Initiator,
                                    activity.Id
                                  );
                                }}
                                color="blue-grey"
                              >
                                <span>Edit</span>
                              </Button>
                              <a
                                className="font-weight-bold"
                                style={{
                                  display: "inline-block",
                                  color: "black",
                                  position: "relative",
                                  left: "380px",
                                  top: "-21px"
                                }}
                                href="javascript:void(0)"
                                onClick={() => {
                                  this.props.handleDeleteActivity(activity.Id);
                                }}
                              >
                                X
                              </a>
                            </React.Fragment>
                          )}
                        </div>
                      </div>
                    </React.Fragment>
                  ))}
              </div>

              <div>
                {this.props.createMode && (
                  <React.Fragment>
                    <div className="row">
                      <div className="col-md-12 mb-3">
                        <label>Event Details</label>
                        <input
                          type="text"
                          name="details"
                          value={this.props.details}
                          className="form-control form-control-md"
                          onChange={this.props.handleChange}
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-12 mb-3">
                        <label>Date</label>
                        <Input
                          name="date"
                          type="date"
                          placeholder="date placeholder"
                          value={this.props.date}
                          onChange={this.props.handleChange}
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-12 mb-3">
                        <label>Responsible Party</label>
                        <select
                          className="form-control form-control-md"
                          type="text"
                          value={this.props.responsible}
                          name="responsible"
                          onChange={this.props.handleChange}
                        >
                          <option>Select</option>
                          <option>Me</option>
                          <option>{this.props.activityName}</option>
                        </select>
                      </div>
                    </div>
                  </React.Fragment>
                )}
                <div>
                  <Button
                    className="jr-btn jr-flat-btn jr-btn-primary btn btn-default"
                    style={{ float: "right" }}
                    onClick={() => {
                      this.props.resetActivityForm();
                      this.props.handleCreateMode();
                      if (this.props.buttonName === "Create") {
                        this.props.submitNewActivity();
                      }
                      if (this.props.buttonName === "Save") {
                        this.props.updateActivity();
                      }
                    }}
                    color="blue-grey"
                  >
                    <span>{this.props.buttonName}</span>
                  </Button>
                  {this.props.createMode && (
                    <Button
                      className="jr-btn jr-flat-btn jr-btn-primary btn btn-default"
                      style={{ float: "right" }}
                      onClick={() => {
                        this.props.resetActivityForm();
                        this.props.handleCreateMode();
                        this.props.resetCreateButton();
                      }}
                      color="blue-grey"
                    >
                      <span>Cancel</span>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </ModalBody>
        </Container>
      </Modal>
    );
  }
}

export default ActivitiesModal;
