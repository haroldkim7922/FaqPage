import React from "react";
import FaqForm from "./FaqForm";
import { handleChange } from "./utilities";
import { Button } from "reactstrap";
import Collapsible from "react-collapsible";
import {
  getAllFaqs,
  searchFaq,
  getAllFaqCategories,
  deleteFaqCategory,
  deleteFaq,
  getFaqsbyCategory
} from "./server";
import FaqCategoryForm from "./FaqCategoryForm";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

class Faqs extends React.Component {
  state = {
    categoryId: "",
    question: "",
    answer: "",
    displayOrder: "",
    modal: false,
    modalCategory: false,
    faqs: [],
    searchVal: "",
    pageIndex: 0,
    showSearchError: false,
    name: "",
    showDeleteIcons: false,
    faqCategories: [],
    isUpdating: false,
    updateFaqId: "",
    loadingFaqsByCategory: false,
    categoryName: "",
    deleteCategoryError: false,
    categories: []
  };

  handleChange = handleChange.bind(this);

  toggle = () => {
    if (this.state.isUpdating == false) {
      this.setState({});
    }
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
    this.getAllFaqCategories();
  };

  toggleNewFaq = () => {
    this.resetForm();
    this.setState(prevState => ({
      modal: !prevState.modal,
      isUpdating: false
    }));
    this.getAllFaqCategories();
    // getAllFaqCategories()
    //   .then(response => {
    //     this.setState({
    //       categories: response.data.items.pagedItems
    //     });
    //   })
    //   .catch();
  };

  getAllFaqCategories = () => {
    getAllFaqCategories()
      .then(response => {
        this.setState({
          categories: response.data.items.pagedItems
        });
      })
      .catch();
  };

  toggleCategory = () => {
    this.setState(prevState => ({
      modalCategory: !prevState.modalCategory
    }));
  };

  showDeleteIcons = () => {
    this.setState({
      showDeleteIcons: true
    });
  };

  hideDeleteIcons = () => {
    this.setState({
      showDeleteIcons: false
    });
  };

  resetForm = () => {
    this.setState({
      categoryId: "",
      question: "",
      answer: "",
      displayOrder: ""
    });
  };

  resetCategoryForm = () => {
    this.setState({
      name: ""
    });
  };

  resetErrorMessage = () => {
    this.setState({
      deleteCategoryError: false
    });
  };

  loadFaqs = () => {
    getAllFaqs()
      .then(response => {
        this.setState({
          faqs: response.data.items.pagedItems,
          categoryName: ""
        });
      })
      .catch();
  };

  editFaq = faq => {
    const categoryList = this.state.faqCategories.filter(
      category => category.Id == faq.CategoryId
    );
    console.log(categoryList);

    this.setState({
      categoryId: faq.CategoryId,
      question: faq.Question,
      answer: faq.Answer,
      displayOrder: faq.DisplayOrder,
      updateFaqId: faq.Id,
      isUpdating: true
    });
    this.toggle();
  };

  loadFaqCategories = () => {
    getAllFaqCategories()
      .then(response => {
        this.setState({
          faqCategories: response.data.items.pagedItems
        });
      })
      .catch();
  };

  deleteCategory = category => {
    deleteFaqCategory(category.Id)
      .then(() => {
        this.loadFaqCategories();
      })
      .catch(() => {
        this.setState({
          deleteCategoryError: true
        });
      });
    setTimeout(this.resetErrorMessage, 4000);
  };

  deleteFaq = faq => {
    deleteFaq(faq.Id)
      .then(() => {
        this.loadFaqs();
      })
      .catch();
  };

  FaqSearchByCategory = category => {
    getFaqsbyCategory(category.Id)
      .then(response => {
        this.setState({
          faqs: response.data.items.pagedItems,
          loadingFaqsByCategory: true,
          categoryName: category.Name
        });
      })
      .catch();
  };

  handleSearch = event => {
    event.preventDefault();
    var pageIndex = this.state.pageIndex;
    const searchVal = this.state.searchVal;
    var pageSize = 8;

    searchFaq(pageIndex, pageSize, searchVal)
      .then(response => {
        if (response.data.items.pagedItems) {
          this.setState({
            faqs: response.data.items.pagedItems,
            searchVal: ""
          });
        } else {
          this.setState({
            showSearchError: true
          });
        }
      })
      .catch();
  };

  render() {
    const { currentUser } = this.props;
    return (
      <React.Fragment>
        <div className="app-wrapper">
          <div className=" animated slideInUpTiny animation-duration-3">
            <div className="row justify-content-center">
              <div className="col-md-10 col-sm-12 col-12 justify-content-start p-4">
                <h1 className="title mb-0">FAQ</h1>
              </div>
              <div className="col-md-6 col-sm-7 col-12">
                {this.state.loadingFaqsByCategory && (
                  <h2 className="font-weight-semibold">
                    {this.state.categoryName}
                  </h2>
                )}
                {this.state.faqs.map(faq => (
                  <Collapsible
                    key={faq.Id}
                    className="Collapsible"
                    style={{
                      height: "0px",
                      transition: "height 400ms linear",
                      overflow: "hidden"
                    }}
                    trigger={faq.Question}
                  >
                    <p>{faq.Answer}</p>
                    {currentUser.isAdmin && (
                      <React.Fragment>
                        <Button
                          onClick={() => this.editFaq(faq)}
                          color="blue-grey"
                        >
                          Edit
                        </Button>
                        <Button onClick={() => this.deleteFaq(faq)} color="red">
                          Delete
                        </Button>
                      </React.Fragment>
                    )}
                  </Collapsible>
                ))}
                {currentUser.isAdmin && (
                  <Button onClick={this.toggleNewFaq} color="success">
                    Create New FAQ
                  </Button>
                )}
              </div>
              <div className="col-md-4 col-sm-5 col-12 animation slideInRight">
                <div className="sidebar">
                  <div className="card bg-white p-2">
                    <form className="m-0" role="search">
                      <div className="search-bar">
                        <div className="form-group">
                          <input
                            type="search"
                            className="form-control form-control-lg border-0"
                            placeholder="Search..."
                            name="searchVal"
                            value={this.state.searchVal}
                            onChange={this.handleChange}
                          />
                          <button
                            onClick={this.handleSearch}
                            className="search-icon"
                          >
                            <i className="zmdi zmdi-search zmdi-hc-lg" />
                          </button>
                        </div>
                      </div>
                    </form>
                    {this.state.showSearchError && (
                      <p> There are no search results </p>
                    )}
                  </div>
                  <div className="card p-4">
                    <div>
                      <h1
                        className="text-uppercase letter-spacing-base mb-3"
                        style={{ display: "inline-block" }}
                      >
                        Categories
                      </h1>
                      {currentUser.isAdmin && (
                        <Button
                          className="jr-btn jr-flat-btn jr-btn-primary btn btn-default"
                          style={{ display: "inline-block", float: "right" }}
                          onClick={this.showDeleteIcons}
                          color="blue-grey"
                        >
                          <i className="zmdi zmdi-edit zmdi-hc-fw" />

                          <span>Edit</span>
                        </Button>
                      )}
                    </div>
                    <ul className="categories-list list-unstyled">
                      <li>
                        <a onClick={this.loadFaqs} href="javascript:void(0)">
                          All
                        </a>
                        {"  "}
                      </li>

                      {this.state.faqCategories.map(category => (
                        <li key={category.Id}>
                          <a
                            onClick={() => this.FaqSearchByCategory(category)}
                            href="javascript:void(0)"
                          >
                            {category.Name}
                          </a>
                          {"  "}
                          {this.state.showDeleteIcons && (
                            <Button
                              className="jr-fab-btn bg-secondary text-white jr-btn-fab-xs mb-3 btn btn-secondary"
                              onClick={() => this.deleteCategory(category)}
                              style={{
                                margin: "5px",
                                position: "relative",
                                bottom: "1px",
                                top: "5px",
                                padding: "1px",
                                height: "3px",
                                width: "10px",
                                border: "none"
                              }}
                            >
                              <i className="zmdi zmdi-minus zmdi-hc-fw" />
                            </Button>
                          )}
                        </li>
                      ))}

                      {this.state.showDeleteIcons && (
                        <Button
                          style={{ float: "left" }}
                          onClick={this.hideDeleteIcons}
                          color="amber"
                        >
                          Done
                        </Button>
                      )}
                      {this.state.deleteCategoryError && (
                        <h3>
                          Please make sure to delete all questions under this
                          category before deleting the category.
                        </h3>
                      )}
                    </ul>
                  </div>
                  {currentUser.isAdmin && (
                    <div className="offset-4">
                      <Button onClick={this.toggleCategory} color="success">
                        Add New Category
                      </Button>
                    </div>
                  )}
                </div>

                <FaqForm
                  toggle={this.toggle}
                  modal={this.state.modal}
                  categoryId={this.state.categoryId}
                  question={this.state.question}
                  answer={this.state.answer}
                  displayOrder={this.state.displayOrder}
                  handleChange={this.handleChange}
                  resetForm={this.resetForm}
                  loadFaqs={this.loadFaqs}
                  isUpdating={this.state.isUpdating}
                  updateFaqId={this.state.updateFaqId}
                  categories={this.state.categories}
                />
                <FaqCategoryForm
                  name={this.state.name}
                  toggleCategory={this.toggleCategory}
                  modalCategory={this.state.modalCategory}
                  handleChange={this.handleChange}
                  resetCategoryForm={this.resetCategoryForm}
                  loadFaqCategories={this.loadFaqCategories}
                />
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }

  componentDidMount() {
    this.loadFaqs();
    this.loadFaqCategories();
    this.getAllFaqCategories();
  }
}

function mapStateToProps(state) {
  return {
    currentUser: state.currentUser
  };
}
export default withRouter(connect(mapStateToProps)(Faqs));
