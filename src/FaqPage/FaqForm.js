import React from "react";
import { Button, Modal, Container, ModalHeader, ModalBody } from "reactstrap";
import { postFaq, getAllFaqCategories, updateFaq } from "./server.js";

class FaqForm extends React.Component {
  state = {
    submitSuccess: false,
    submitError: false,
    categories: [],
    updateSuccess: false,
    updateError: false
  };

  handleFaqUpdate = event => {
    event.preventDefault();
    var payload = {
      categoryId: this.props.categoryId,
      question: this.props.question,
      answer: this.props.answer,
      displayOrder: this.props.displayOrder
    };
    updateFaq(payload, this.props.updateFaqId)
      .then(() => {
        this.setState({
          updateSuccess: true,
          updateError: false
        });
        this.props.resetForm();
        this.props.loadFaqs();
      })
      .catch(() => {
        this.setState({
          updateError: true,
          updateSuccess: false
        });
      });
    setTimeout(this.resetMessage, 5000);
  };

  handleFaqSubmit = event => {
    event.preventDefault();
    var payload = {
      categoryId: this.props.categoryId,
      question: this.props.question,
      answer: this.props.answer,
      displayOrder: this.props.displayOrder
    };

    postFaq(payload)
      .then(() => {
        this.setState({
          submitSuccess: true,
          submitError: false
        });
        this.props.resetForm();
        this.props.loadFaqs();
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
        isOpen={this.props.modal}
        toggle={this.props.toggle}
        className={this.props.className}
      >
        <Container>
          <ModalHeader toggle={this.props.toggle}>FAQ Form</ModalHeader>{" "}
          <ModalBody>
            <div className="col-lg-10">
              <form noValidate autoComplete="off">
                <div className="row">
                  <div className="col-md-12 mb-3">
                    <label>Category Id</label>
                    <select
                      className="form-control form-control-md"
                      type="text"
                      value={this.props.categoryId}
                      placeholder="Type Category Id Here"
                      name="categoryId"
                      onChange={this.props.handleChange}
                    >
                      <option>Select a category Id</option>
                      {this.props.categories.map(category => (
                        <option key={category.Id} value={category.Id}>
                          {category.Id}: {category.Name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12 mb-3">
                    <label>Question</label>
                    <input
                      type="textl"
                      name="question"
                      value={this.props.question}
                      className="form-control form-control-md"
                      id="exampleFormControlInput1"
                      placeholder="Type Question Here"
                      onChange={this.props.handleChange}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12 mb-3">
                    <label>Answer</label>
                    <textarea
                      rows="2"
                      name="answer"
                      value={this.props.answer}
                      className="form-control form-control-md"
                      placeholder="Type Answer Here"
                      onChange={this.props.handleChange}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12 mb-3">
                    <label>Display Order</label>
                    <input
                      type="text"
                      name="displayOrder"
                      value={this.props.displayOrder}
                      className="form-control form-control-md"
                      placeholder="Type Display Order Here"
                      onChange={this.props.handleChange}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12 mb-3">
                    {this.props.isUpdating && (
                      <Button
                        type="submit"
                        color="success"
                        className="jr-btn bg-success"
                        onClick={this.handleFaqUpdate}
                      >
                        Update FAQ
                      </Button>
                    )}
                    {this.props.isUpdating == false && (
                      <Button
                        type="submit"
                        color="success"
                        className="jr-btn bg-success"
                        onClick={this.handleFaqSubmit}
                      >
                        Submit FAQ
                      </Button>
                    )}
                  </div>
                  {this.state.submitSuccess && (
                    <h3>Your FAQ has been submitted!</h3>
                  )}
                  {this.state.submitError && (
                    <h3>There was a submission error!</h3>
                  )}
                  {this.state.updateSuccess && (
                    <h3>Your FAQ has been updated!</h3>
                  )}
                  {this.state.updateError && (
                    <h3>There was an update error!</h3>
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

export default FaqForm;
