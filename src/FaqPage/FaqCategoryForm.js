import React from "react";
import { Button, Modal, Container, ModalHeader, ModalBody } from "reactstrap";
import { postFaqCategory } from "./server.js";

class FaqCategoryForm extends React.Component {
  state = {
    submitSuccess: false,
    submitError: false
  };

  handleFaqCategorySubmit = event => {
    event.preventDefault();
    var payload = {
      name: this.props.name
    };

    postFaqCategory(payload)
      .then(() => {
        this.setState({
          submitSuccess: true,
          submitError: false
        });
        this.props.resetCategoryForm();
        this.props.loadFaqCategories();
      })
      .catch(() => {
        this.setState({
          submitError: true,
          submitSuccess: false
        });
      });
    setTimeout(this.resetMessage, 5000);
  };

  resetMessage = () => {
    this.setState({
      submitError: false,
      submitSuccess: false
    });
  };

  render() {
    return (
      <Modal
        isOpen={this.props.modalCategory}
        toggle={this.props.toggleCategory}
        className={this.props.className}
      >
        <Container>
          <ModalHeader toggle={this.props.toggleCategory}>
            FAQ Category Form
          </ModalHeader>{" "}
          <ModalBody>
            <div className="col-lg-10">
              <form noValidate autoComplete="off">
                <div className="row">
                  <div className="col-md-12 mb-3">
                    <label>Category Name</label>
                    <input
                      className="form-control form-control-md"
                      type="text"
                      value={this.props.name}
                      placeholder="Type Category Name Here"
                      name="name"
                      onChange={this.props.handleChange}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12 mb-3">
                    <Button
                      type="submit"
                      color="success"
                      className="jr-btn bg-success"
                      onClick={this.handleFaqCategorySubmit}
                    >
                      Submit FAQ Category
                    </Button>
                  </div>
                  {this.state.submitSuccess && (
                    <h3>Your FAQ Category has been submitted!</h3>
                  )}
                  {this.state.submitError && (
                    <h3>There was a submission error!</h3>
                  )}
                </div>
              </form>
            </div>
          </ModalBody>
        </Container>
      </Modal>
    );
  }
}

export default FaqCategoryForm;
