import React from "react";
import { connect } from "react-redux";
import ChatUserItem from "./ChatUserItem";
import UserAutoComplete from "./UserAutoComplete";
import { withRouter } from "react-router-dom";

class SideBar extends React.Component {
  state = {
    multiple: false,
    recipientId: ""
  };

  getId = id => {
    this.setState({ recipientId: id });
  };

  render() {
    const {
      currentUser,
      userSearch,
      changeRecipient,
      currentChats,
      updateChatId,
      activeChatId,
      activeUsers,
      handleResetUnseenMessages,
      messageContacts,
      resetDrawer
    } = this.props;

    return (
      <div className="chat-sidenav-main">
        <div className="chat-sidenav-header" style={{ backgroundColor: "rgb(93, 177, 93)" }}>
          <div className="chat-user-hd">
            <div className="chat-avatar mr-3">
              <div className="chat-avatar-mode">
                <img id="user-avatar-button" src={currentUser.avatarUrl} className="rounded-circle size-50" />
                <span className="chat-mode" />
                {/* can insert "online" here to make it green */}
              </div>
            </div>
            <div className="module-user-info d-flex flex-column justify-content-center">
              <div className="module-title">
                <h4 className="mb-0" style={{ color: "white" }}>
                  {currentUser.firstName} {currentUser.lastName}
                </h4>
              </div>
              <div className="module-user-detail">
                <a href="javascript:void(0)" style={{ color: "white" }}>
                  {currentUser.email}
                </a>
              </div>
            </div>
          </div>
          <div className="search-wrapper">
            <div className="search-bar right-side-icon bg-transparent ">
              <div className="form-group">
                <UserAutoComplete items={messageContacts} onChange={changeRecipient} />
                <button className="search-icon">
                  <i className="zmdi zmdi-search zmdi-hc-lg" />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="chat-sidenav-content">
          <ul className="nav-fill nav nav-tabs" style={{ borderBottom: "2px solid #dee2e6" }}>
            <li className="nav-item nav-item">
              <a aria-selected="true" data-toggle="tab" role="tab" className="active nav-link">
                CHATS
              </a>
            </li>
          </ul>
          <div className="tab-content">
            <div className="tab-pane active">
              <div
                className="chat-sidenav-scroll scrollbar"
                style={{
                  position: "relative",
                  overflow: "hidden",
                  width: "100%",
                  height: "calc(100vh - 328px)",
                  borderBottomLeftRadius: "20px"
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "0px",
                    left: "0px",
                    right: "0px",
                    bottom: "0px",
                    overflow: "scroll",
                    marginRight: "-17px",
                    marginBottom: "-17px"
                  }}
                >
                  <div className="chat-user">
                    {currentChats[0] &&
                      currentChats.map(chatUserItem => (
                        <ChatUserItem
                          key={chatUserItem.name}
                          name={chatUserItem.name}
                          snippet={chatUserItem.snippet}
                          avatar={chatUserItem.avatar}
                          lastMessageTime={chatUserItem.lastMessageTime}
                          unseenMessages={chatUserItem.unseenMessages}
                          id={chatUserItem["id"]}
                          updateChatId={updateChatId}
                          activeChatId={activeChatId}
                          activeUsers={activeUsers}
                          handleResetUnseenMessages={handleResetUnseenMessages}
                          resetDrawer={resetDrawer}
                        />
                      ))}
                  </div>
                </div>
                <div className="track-horizontal" style={{ display: "none", opacity: "0" }}>
                  <div
                    style={{
                      position: "relative",
                      display: "block",
                      height: "100%",
                      cursor: "pointer",
                      borderRadius: "inherit",
                      backgroundColor: "rgba(0, 0, 0, 0.2)",
                      width: "0px"
                    }}
                  />
                </div>
                <div
                  style={{
                    position: "absolute",
                    width: "6px",
                    transition: "opacity 200ms",
                    opacity: "0",
                    right: "2px",
                    bottom: "2px",
                    top: "2px",
                    borderRadius: "3px"
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      display: "block",
                      width: "100%",
                      cursor: "pointer",
                      borderRadius: "inherit",
                      backgroundColor: "rgba(0, 0, 0, 0.2)",
                      height: "238px",
                      transform: "translateY(0px)"
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { currentUser: state.currentUser };
}

export default withRouter(connect(mapStateToProps)(SideBar));
