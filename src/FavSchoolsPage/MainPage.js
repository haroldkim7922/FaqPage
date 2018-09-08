import React from "react";
//import { SortableElement, SortableHandle } from "react-sortable-hoc";
import Card from "./Card";
const update = require("immutability-helper");
import { DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import Tags from "./Tags";
import ActivitiesModal from "./ActivitiesModal";
import { Button } from "reactstrap";
import SweetAlert from "react-bootstrap-sweetalert";
import { handleChange } from "../FaqPage/utilities";
import {
  getAthleteSchoolsById,
  getAthleteTagsById,
  postAthleteTags,
  deleteAthleteTags,
  postAthleteSchoolTags,
  updateAthleteSchool,
  deleteAthleteSchool,
  getActivitiesById,
  postActivity,
  deleteActivity,
  updateActivity
} from "./server";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

class MainPage extends React.Component {
  state = {
    schools: [],
    tags: [],
    modal: false,
    alert: null,
    message: "",
    listEditMode: false,
    deleteAlert: null,
    deleteSchoolId: 0,
    activityName: "",
    activityLogo: "",
    details: "",
    responsible: "",
    date: "",
    activitiesArray: [],
    userProfilePic: "http://demo.g-axon.com/jumbo-react-flat/assets/images/userAvatar/domnic-harris.jpg",
    currentSchoolLogo: "",
    showActivitiesError: false,
    currentIdForActivityLog: 0,
    createMode: false,
    buttonName: "Add New",
    currentSchoolLogoForActivityLog: "",
    logEditMode: false,
    currentIdForUpdate: 0
  };

  handleDelete = this.handleDelete.bind(this);
  handleAddition = this.handleAddition.bind(this);

  handleChange = handleChange.bind(this);

  handleDeleteActivity = id => {
    deleteActivity(id)
      .then(() => {
        const { currentIdForActivityLog, currentSchoolLogoForActivityLog } = this.state;
        this.handleLogData(currentIdForActivityLog, currentSchoolLogoForActivityLog);
      })
      .catch(() => {
        console.log("There was an error removing your activity");
      });
  };

  handleActivityEditList = () => {
    this.setState(prevState => ({
      logEditMode: !prevState.logEditMode
    }));
  };

  resetActivityEditButton = () => {
    this.setState({
      editButton: "Edit"
    });
  };

  handleCreateMode = () => {
    this.setState(prevState => ({
      createMode: !prevState.createMode,
      buttonName: "Create"
    }));
  };

  resetCreateButton = () => {
    this.setState({
      buttonName: "Add New"
    });
  };

  submitNewActivity = () => {
    var payload = {
      athleteSchoolId: this.state.currentIdForActivityLog,
      dateContacted: this.state.date,
      notes: this.state.details,
      contactPersonName: 3,
      contactPersonId: 3,
      initiator: this.state.responsible
    };
    postActivity(payload)
      .then(() => {
        this.setState(
          {
            buttonName: "Add New",
            createMode: false
          },
          () => {
            const { currentIdForActivityLog, currentSchoolLogoForActivityLog } = this.state;
            this.handleLogData(currentIdForActivityLog, currentSchoolLogoForActivityLog);
          }
        );
      })
      .catch(() => {
        console.log("There was an error adding your activity");
      });
  };

  handleActivityUpdateList = (details, date, responsible, id) => {
    this.setState({
      details: details,
      date: date.substring(0, 10),
      responsible: responsible,
      createMode: true,
      buttonName: "Save",
      currentIdForUpdate: id
    });
  };

  updateActivity = () => {
    const id = this.state.currentIdForUpdate;
    var payload = {
      athleteSchoolId: this.state.currentIdForActivityLog,
      dateContacted: this.state.date,
      notes: this.state.details,
      contactPersonName: 3,
      contactPersonId: 3,
      initiator: this.state.responsible
    };
    updateActivity(payload, id)
      .then(() => {
        const { currentIdForActivityLog, currentSchoolLogoForActivityLog } = this.state;
        this.handleLogData(currentIdForActivityLog, currentSchoolLogoForActivityLog);
        this.setState({
          buttonName: "Add New",
          createMode: false,
          logEditMode: false
        });
      })
      .catch(() => {
        console.log("Error updating activity");
      });
  };

  resetActivityForm = () => {
    this.setState({
      details: "",
      responsible: "",
      date: ""
    });
  };

  sendRankOrder = () => {
    const { schools } = this.state;

    for (let i = 0; i < schools.length; i++) {
      var id = schools[i].Id;
      var payload = {
        rank: i + 1,
        notes: schools[i].Notes
      };
      updateAthleteSchool(payload, id).then(() => {
        console.log("new rank has been pushed to sql");
      });
    }
  };

  handleLogData = (Id, logo) => {
    this.setState({
      currentIdForActivityLog: Id,
      currentSchoolLogoForActivityLog: logo
    });
    getActivitiesById(Id)
      .then(response => {
        if (response.data.items.activities) {
          this.setState({
            activitiesArray: response.data.items.activities,
            currentSchoolLogo: logo,
            showActivitiesError: false,
            logEditMode: false,
            createMode: false,
            buttonName: "Add New"
          });
        } else {
          this.setState({
            activitiesArray: [],
            showActivitiesError: true
          });
        }
      })
      .catch(() => {
        console.log("There was an error retrieving the activities");
      });
  };

  hideDeleteAlert = () => {
    this.setState({
      deleteAlert: null
    });
  };

  showDeleteAlert = () => {
    const getAlert = () => (
      <SweetAlert
        warning
        showCancel
        confirmBtnText="Yes, remove from my list!"
        confirmBtnBsStyle="danger"
        cancelBtnBsStyle="default"
        title={this.state.message}
        onConfirm={this.deleteSchool}
        onCancel={this.hideDeleteAlert}
      />
    );
    this.setState({ deleteAlert: getAlert() });
  };

  showAlert = () => {
    const getAlert = () => (
      <SweetAlert
        warning
        confirmBtnText="Okay, got it!"
        confirmBtnBsStyle="danger"
        cancelBtnBsStyle="default"
        title={this.state.message}
        onConfirm={this.hideAlert}
      />
    );
    this.setState({ alert: getAlert() });
  };

  hideAlert = () => {
    this.setState({
      alert: null
    });
  };

  handleNewChange = (index, name, value) => {
    const schools = this.state.schools.map((school, i) => {
      if (i === index) {
        return {
          ...school,
          [name]: value
        };
      } else {
        return school;
      }
    });
    this.setState({
      schools
    });
  };

  handleTagsChange = (index, value, id) => {
    const tagArray = this.state.schools[index].tags.filter(tag => tag.name == value);
    console.log(tagArray);

    if (tagArray[0]) {
      this.setState(
        {
          message: "This tag is already on this school"
        },
        () => {
          this.showAlert();
        }
      );
    } else {
      const schools = this.state.schools.map((school, i) => {
        if (i === index) {
          return {
            ...school,
            tags: [
              ...school.tags,
              {
                athleteSchoolId: id,
                name: value
              }
            ]
          };
        } else {
          return school;
        }
      });
      this.setState({
        schools
      });
      var payload = {
        athleteSchoolId: id,
        tag: value
      };
      postAthleteSchoolTags(payload).then(() => {
        console.log("tag has been added to AthleteSchoolTags table");
      });
    }
  };

  handleRemoveTag = (schoolId, tagName) => {
    const schools = this.state.schools.map((school, i) => {
      if (school.Id === schoolId) {
        return {
          ...school,
          tags: school.tags.filter(tag => tag.name != tagName)
        };
      } else {
        return school;
      }
    });
    this.setState({
      schools
    });
  };

  moveCard = (dragIndex, hoverIndex) => {
    const { schools } = this.state;
    const dragCard = schools[dragIndex];

    this.setState(
      update(this.state, {
        schools: {
          $splice: [[dragIndex, 1], [hoverIndex, 0, dragCard]]
        }
      }),
      () => {
        this.sendRankOrder();
      }
    );
  };

  handleDelete(i) {
    const { tags, schools } = this.state;
    var tagName = tags[i].text;
    var canRemove = false;
    for (let a = 0; a < schools.length; a++) {
      for (let b = 0; b < schools[a].tags.length; b++) {
        if (schools[a].tags[b].name == tagName) {
          this.setState(
            {
              message: "This tag is still being used in one of your schools"
            },
            () => {
              this.showAlert();
            }
          );
          console.log("This tag is still being used in one of your schools");
          return;
        } else {
          canRemove = true;
        }
      }
    }
    if (canRemove == true) {
      this.setState({
        tags: tags.filter((tag, index) => index !== i)
      });
      var id = Number(tags[i].id);
      deleteAthleteTags(id).then(() => {
        console.log("tag has been deleted from database");
      });
    }
  }

  handleAddition(tag) {
    const { currentUser } = this.props;
    this.setState(state => ({ tags: [...state.tags, tag] }), () => console.log(this.state.tags));
    var payload = {
      tagName: tag.text,
      athleteUserId: currentUser.id
    };
    postAthleteTags(payload).then(() => {
      console.log("tag has been added to database");
    });
    this.loadAthleteTagsBySchool();
  }

  handleDeleteSchool = id => {
    this.setState({
      message: "Remove school from list?",
      deleteSchoolId: id
    });
  };

  deleteSchool = () => {
    const id = this.state.deleteSchoolId;
    deleteAthleteSchool(id).then(() => {
      console.log("This school has been removed from the list");
      this.loadSchoolsByAthlete();
    });
    this.setState({
      deleteAlert: null
    });
  };

  toggleActivity = () => {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  };

  handleActivityLogData = (name, logo) => {
    this.setState({
      activityName: name,
      activityLogo: logo
    });
  };

  loadAthleteTagsBySchool = () => {
    const athleteUserId = this.props.currentUser.id;
    getAthleteTagsById(athleteUserId).then(response => {
      if (response.data.items != "") {
        this.setState({
          tags: response.data.items.tags
        });
      }
    });
  };

  loadSchoolsByAthlete = () => {
    const athleteUserId = this.props.currentUser.id;
    getAthleteSchoolsById(athleteUserId).then(response => {
      this.setState({
        schools: response.data.items.schools
      });
    });
  };

  handleEditList = () => {
    this.setState(prevState => ({
      listEditMode: !prevState.listEditMode
    }));
  };

  render() {
    return (
      <React.Fragment>
        <div className="app-header" />
        <div className="app-main-content">
          <div className="animated slideInUpTiny animation-duration-3">
            <div className="col-12">
              <div className="jr-card">
                <div
                  className="jr-card-header-color d-flex align-items-center"
                  style={{
                    marginRight: "-27px",
                    marginLeft: "-27px",
                    paddingTop: "30px",
                    paddingBottom: "30px",
                    backgroundColor: "rgb(11, 82, 119)"
                  }}
                >
                  <h1 className="mb-0 text-white">
                    <span>Prospective Schools</span>
                  </h1>
                  {this.state.listEditMode ? (
                    <Button
                      className="jr-btn jr-flat-btn jr-btn-primary btn btn-default"
                      style={{
                        display: "inline-block",
                        left: "83%",
                        color: "#ffffff"
                      }}
                      onClick={this.handleEditList}
                      color="blue-grey"
                    >
                      <span>Done</span>
                    </Button>
                  ) : (
                    <Button
                      className="jr-btn jr-flat-btn jr-btn-primary btn btn-default"
                      style={{
                        display: "inline-block",
                        left: "83%",
                        color: "#ffffff"
                      }}
                      onClick={this.handleEditList}
                      color="blue-grey"
                    >
                      <i className="zmdi zmdi-edit zmdi-hc-fw" />
                      <span>Edit</span>
                    </Button>
                  )}
                </div>
                <div className="jr-card-body">
                  <div className="table-responsive-material">
                    <div className="contact-item-hk ripple no-gutters align-items-center py-2 px-3 py-sm-4 px-sm-6">
                      <div className="col-2 text-truncate px-1 d-none d-lg-flex">
                        <h3>School Name</h3>
                      </div>
                      <div className="col text-truncate px-1 d-none d-lg-flex" style={{ left: "3%" }}>
                        <h3>Division</h3>
                      </div>
                      <div className="col text-truncate px-1 d-none d-lg-flex">
                        <h3>Notes</h3>
                      </div>
                      <div className="col px-1 d-none d-lg-flex" style={{ left: "3%" }}>
                        <h3>Tags</h3>
                      </div>
                      <div className="col text-truncate px-1 d-none d-lg-flex">
                        <h3>Activity Log</h3>
                      </div>
                    </div>
                  </div>
                  <div className="row mb-3">
                    {this.state.schools &&
                      this.state.schools.map((school, i) => (
                        <Card
                          key={school.Id}
                          index={i}
                          id={school.Id}
                          name={school.Name}
                          rank={school.Rank}
                          //division={school.division}
                          notes={school.Notes}
                          tags={this.state.tags}
                          schoolTags={school.tags}
                          //activityLog={school.activityLog}
                          moveCard={this.moveCard}
                          logo={school.Logo}
                          handleNewChange={this.handleNewChange}
                          handleTagsChange={this.handleTagsChange}
                          handleRemoveTag={this.handleRemoveTag}
                          toggleActivity={this.toggleActivity}
                          loadSchoolsByAthlete={this.loadSchoolsByAthlete}
                          listEditMode={this.state.listEditMode}
                          handleDeleteSchool={this.handleDeleteSchool}
                          showDeleteAlert={this.showDeleteAlert}
                          handleActivityLogData={this.handleActivityLogData}
                          handleLogData={this.handleLogData}
                        />
                      ))}
                  </div>
                </div>

                <Tags tags={this.state.tags} handleDelete={this.handleDelete} handleAddition={this.handleAddition} />
              </div>
            </div>
          </div>
          {this.state.alert}
          {this.state.deleteAlert}
        </div>
        <ActivitiesModal
          modal={this.state.modal}
          toggleActivity={this.toggleActivity}
          activityLogo={this.state.activityLogo}
          activityName={this.state.activityName}
          date={this.state.date}
          details={this.state.details}
          responsible={this.state.responsible}
          handleChange={this.handleChange}
          activitiesArray={this.state.activitiesArray}
          userProfilePic={this.state.userProfilePic}
          currentSchoolLogo={this.state.currentSchoolLogo}
          showActivitiesError={this.state.showActivitiesError}
          resetActivityForm={this.resetActivityForm}
          createMode={this.state.createMode}
          handleCreateMode={this.handleCreateMode}
          buttonName={this.state.buttonName}
          submitNewActivity={this.submitNewActivity}
          handleActivityEditList={this.handleActivityEditList}
          logEditMode={this.state.logEditMode}
          handleDeleteActivity={this.handleDeleteActivity}
          handleActivityUpdateList={this.handleActivityUpdateList}
          updateActivity={this.updateActivity}
          resetCreateButton={this.resetCreateButton}
        />
      </React.Fragment>
    );
  }

  componentDidMount() {
    this.loadSchoolsByAthlete();
    this.loadAthleteTagsBySchool();
  }
}
function mapStateToProps(state) {
  return {
    currentUser: state.currentUser
  };
}
export default withRouter(connect(mapStateToProps)(DragDropContext(HTML5Backend)(MainPage)));
