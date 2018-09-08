import * as React from "react";
import { findDOMNode } from "react-dom";
import { DragSource, DropTarget } from "react-dnd";
import flow from "lodash/flow";
import { Button } from "reactstrap";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap";
import { deleteAthleteSchoolTags, updateAthleteSchool } from "./server";

const cardSource = {
  beginDrag(props) {
    return {
      id: props.id,
      index: props.index
    };
  }
};

const cardTarget = {
  hover(props, monitor, component) {
    if (!component) {
      return null;
    }
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    // Determine rectangle on screen
    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

    // Determine mouse position
    const clientOffset = monitor.getClientOffset();

    // Get pixels to the top
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    // Only perform the move when the mouse has crossed half of the items height
    // When dragging downwards, only move when the cursor is below 50%
    // When dragging upwards, only move when the cursor is above 50%
    // Dragging downwards
    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return;
    }

    // Dragging upwards
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return;
    }

    // Time to actually perform the action
    props.moveCard(dragIndex, hoverIndex);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex;
  }
};

const colors = ["success", "primary", "secondary", "danger", "purple", "orange", "teal", "lime", "blue-grey"];

class Card extends React.Component {
  state = {
    notesVal: "",
    buttonVal: "See More",
    buttonClicked: false,
    editMode: false,
    labelMenu: false
  };

  handleColorChange = name => {
    const index = this.props.tags
      .map(function(e) {
        return e.text;
      })
      .indexOf(name);

    return colors[index - colors.length * Math.floor(index / colors.length)];
  };

  handleLabelToggle = () => {
    this.setState(prevState => ({ labelMenu: !prevState.labelMenu }));
  };

  handleInsertTags = () => {};

  getShortNotes = () => {
    this.setState({
      notesVal: this.props.notes.slice(0, 30) + " ... "
    });
  };

  getFullNotes = () => {
    if (!this.state.buttonClicked) {
      this.setState({
        notesVal: this.props.notes,
        buttonVal: "Close",
        buttonClicked: true
      });
    } else {
      this.setState({
        notesVal: this.props.notes.slice(0, 30) + "...",
        buttonVal: "See More",
        buttonClicked: false
      });
    }
  };

  changeEditMode = () => {
    this.setState(prevState => ({
      editMode: !prevState.editMode
    }));
  };

  getNotes = () => {
    if (this.props.notes.length > 50) {
      this.getShortNotes();
    }
  };

  deleteAthleteTag = (id, tag) => {
    deleteAthleteSchoolTags(id, tag).then(() => {
      console.log("tag has been removed from AthleteSchoolTags table");
    });
  };

  updateNotesData = notes => {
    const id = 5;
    var payload = {
      notes: notes
    };
    updateAthleteSchool(payload, id).then(() => {
      console.log("notes has been updated in database");
    });
  };

  render() {
    const {
      id,
      index,
      schoolTags,
      name,
      division,
      tags,
      notes,
      logo,
      isDragging,
      connectDragSource,
      connectDropTarget
    } = this.props;
    const opacity = isDragging ? 0 : 1;

    return (
      connectDragSource &&
      connectDropTarget &&
      connectDragSource(
        connectDropTarget(
          <div className="col-12" style={{ cursor: "move", opacity }}>
            {
              <div className="contact-item-hk ripple no-gutters align-items-center py-2 px-3 py-sm-4 px-sm-6">
                <img src={logo} className="user-avatar rounded-circle mr-3" />

                <div className="col-2">
                  {name}
                  <i style={{ color: "red" }} className="zmdi zmdi-fire zmdi-hc-fw" />
                </div>
                <div className="col-1  text-truncate px-1 d-none d-lg-flex">NA</div>
                {this.state.editMode ? (
                  <div className="col-2 px-1 d-none d-lg-flex">
                    <textarea
                      className="form-control"
                      rows="3"
                      value={notes}
                      onChange={e => this.props.handleNewChange(index, "Notes", e.target.value)}
                    />
                  </div>
                ) : notes.length > 50 ? (
                  <div className="col-2 px-1 d-none d-lg-flex">
                    {this.state.notesVal}
                    <a onClick={this.getFullNotes} href="javascript:void(0)">
                      {this.state.buttonVal}
                    </a>
                  </div>
                ) : (
                  <div className="col-2 px-1 d-none d-lg-flex">{notes}</div>
                )}
                <div className="col-1 text-truncate px-1 d-none d-lg-flex">
                  {!this.state.editMode && (
                    <Button
                      className="jr-btn jr-flat-btn jr-btn-primary btn btn-default"
                      style={{ display: "inline-block", float: "right" }}
                      onClick={this.changeEditMode}
                      color="blue-grey"
                    >
                      <i className="zmdi zmdi-edit zmdi-hc-fw" />
                      <span>Edit</span>
                    </Button>
                  )}

                  {this.state.editMode && (
                    <a
                      className="font-weight-bold"
                      style={{
                        display: "inline-block",
                        color: "black",
                        position: "relative",
                        left: "30%"
                      }}
                      href="javascript:void(0)"
                      onClick={() => {
                        this.changeEditMode();
                        this.getNotes();
                        this.updateNotesData(notes);
                      }}
                    >
                      {" "}
                      X
                    </a>
                  )}
                </div>
                <div className="col-2 offset-1">
                  <div className="row">
                    <Dropdown isOpen={this.state.labelMenu} toggle={this.handleLabelToggle.bind(this)}>
                      <DropdownToggle tag="span">
                        <span className="icon-btn">
                          <i className="zmdi zmdi-label-alt zmdi-hc-lg" />
                        </span>
                      </DropdownToggle>

                      <DropdownMenu>
                        {tags &&
                          tags.map(tag => (
                            <DropdownItem
                              key={tag.id}
                              onClick={e => {
                                this.props.handleTagsChange(index, e.target.value, id);
                              }}
                              value={tag.text}
                            >
                              {tag.text}
                            </DropdownItem>
                          ))}
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                  <div className="row">
                    <div style={{ display: "flex", flexWrap: "wrap" }}>
                      {schoolTags.map(tag => (
                        <div
                          key={tag.name}
                          className={`badge text-uppercase text-white bg-${this.handleColorChange(tag.name)}`}
                          style={{ height: "20px" }}
                        >
                          {tag.name}
                          <a
                            className="font-weight-bold"
                            style={{ color: "black" }}
                            href="javascript:void(0)"
                            onClick={() => {
                              this.props.handleRemoveTag(id, tag.name);
                              this.deleteAthleteTag(tag.athleteSchoolId, tag.name);
                            }}
                          >
                            {" "}
                            X
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="col text-truncate px-1 d-none d-lg-flex">
                  <a
                    onClick={() => {
                      this.props.toggleActivity();
                      this.props.handleActivityLogData(name, logo);
                      this.props.handleLogData(id, logo);
                    }}
                    href="javascript:void(0)"
                  >
                    See Past Activity
                  </a>

                  {this.props.listEditMode && (
                    <a
                      className="font-weight-bold"
                      style={{
                        display: "inline-block",
                        color: "black",
                        position: "relative",
                        left: "70%"
                      }}
                      href="javascript:void(0)"
                      onClick={() => {
                        this.props.handleDeleteSchool(id);
                        this.props.showDeleteAlert();
                      }}
                    >
                      X
                    </a>
                  )}
                </div>
              </div>
            }
          </div>
        )
      )
    );
  }

  componentWillMount() {
    if (this.props.notes.length > 50) {
      this.getShortNotes();
    }
  }
}

export default flow(
  DragSource("card", cardSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  })),
  DropTarget("card", cardTarget, connect => ({
    connectDropTarget: connect.dropTarget()
  }))
)(Card);
