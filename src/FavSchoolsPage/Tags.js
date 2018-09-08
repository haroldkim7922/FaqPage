import React from "react";
import "./Tags.css";

const ReactTags = require("react-tag-input").WithOutContext;

const KeyCodes = {
  comma: 188,
  enter: 13
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

class Tags extends React.Component {
  render() {
    return (
      <React.Fragment>
        <ReactTags
          delimiters={delimiters}
          tags={this.props.tags}
          handleDelete={this.props.handleDelete}
          handleAddition={this.props.handleAddition}
        />
      </React.Fragment>
    );
  }
}

export default Tags;
