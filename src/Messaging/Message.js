import React from "react";
import "./message.css";
import io from "socket.io-client";
import { connect } from "react-redux";
import SideBar from "./SideBar";
import ChatMainHeader from "./ChatMainHeader";
import ChatMainContent from "./ChatMainContent";
import ChatMainFooter from "./ChatMainFooter";
import IfLoginStatus from "../CustomComponents/IfLoginStatus";
import { handleChange } from "../FaqPage/utilities";
import { getUserById } from "../../services/registerLogin.service";
import InfiniteScroll from "./ScrollChecker";
import { getMessagesByUserId, postMessage, getConvosByUserId, getContacts } from "../../services/message.service";
import moment from "moment";
import { withRouter } from "react-router-dom";
import SweetAlert from "react-bootstrap-sweetalert";
import Drawer from "rc-drawer";

class Message extends React.Component {
  state = {
    socket: null,
    user: null,
    username: this.props.currentUser.firstName,
    message: "",
    messages: [],
    time: "",
    activeUsers: {},
    recipient: [],
    recipientAvatar: "",
    recipientName: "",
    recipientUserId: "",
    recipientSocketId: null,
    userSearch: [],
    currentChats: [],
    activeChatId: "",
    scrolledToBottom: false,
    showMessages: false,
    messageKey: "",
    pageHasLoaded: false,
    isTyping: false,
    messagesToShow: false,
    contactsArray: [],
    messageContacts: [],
    alert: false,
    drawerState: false
  };

  registerRef = React.createRef();

  componentDidMount() {
    this.initSocket();
    this.handleGetConvos();
    this.handleGetContacts();
    if (this.props.location.state) {
      this.setState({ activeChatId: this.props.location.state["id"] }, () =>
        console.log("Harold disappears", this.props.location.state)
      );
    }
  }

  initSocket = () => {
    const socket = io.connect();

    socket.on("connect", () => {
      console.log("Connected");
    });

    this.setState({ socket }, () => {
      this.setUser();
    });

    // socket.on("Notification", message => {
    //   console.log(message);
    // });

    socket.on("RECEIVE_MESSAGE", data => {
      //console.log(data);
      const { messages, activeChatId } = this.state;
      if (data.senderUserId == this.props.currentUser.id) {
        this.setState({ activeChatId: data.recipientUserId, isTyping: false }, () => {
          if (activeChatId == data.recipientUserId) {
            const addMessage = (arr, value) => arr.concat(value);
            const updatedMessages = addMessage(messages, {
              author: data.sender,
              message: data.message,
              avatar: data.senderAvatar,
              time: data.time,
              messageKey: data.messageKey
            });
            this.setState({ messages: updatedMessages });
          }
        });
      } else {
        this.addMessage(data);
      }
    });

    socket.on("USER_IS_TYPING", data => {
      if (data.senderUserId === this.state.activeChatId) {
        this.setState({ isTyping: data.isTyping });
      }
    });

    socket.on("USER_CONNECTED", connectedUsers => {
      this.updateUsers(connectedUsers);
      this.reformatUsersArray(connectedUsers);
    });

    socket.on("USER_DISCONNECTED", connectedUsers => {
      this.updateUsers(connectedUsers);
      this.reformatUsersArray(connectedUsers);
    });
  };

  setUser = user => {
    this.setState({ user });
  };

  logout = () => {
    const { socket } = this.state;
    socket.emit("LOGOUT");
    this.setState({ user: null });
  };

  // Sending/Receiving Messages

  addMessage = data => {
    const { messages, currentChats, activeChatId } = this.state;
    const { currentUser } = this.props;
    const addChat = (arr, value) => arr.concat(value);
    const result = currentChats.filter(chat => chat["id"] == data.senderUserId);
    if (result.length > 0) {
      const updatedChats = currentChats.map(chat => {
        if (activeChatId === data.senderUserId) {
          const updatedMessages = addChat(messages, {
            author: data.sender,
            message: data.message,
            avatar: data.senderAvatar,
            time: data.time,
            messageKey: data.messageKey
          });
          this.setState({ messages: updatedMessages });
          return {
            ...chat
          };
        } else if (chat.id == data.senderUserId) {
          return {
            ...chat,
            unseenMessages: chat.unseenMessages + 1,
            snippet: data.message
          };
        } else {
          return chat;
        }
      });
      this.setState({ currentChats: updatedChats });
    } else {
      const newChats = addChat(currentChats, {
        name: data.sender,
        snippet: data.message,
        avatar: data.senderAvatar,
        unseenMessages: 1,
        id: data.senderUserId
      });

      if (currentChats.length == 0) {
        const updatedMessages = addChat(messages, {
          author: data.sender,
          message: data.message,
          avatar: data.senderAvatar,
          time: data.time,
          messageKey: data.messageKey
        });
        this.setState(
          {
            messages: updatedMessages,
            recipientName: data.sender,
            recipientAvatar: data.senderAvatar,
            recipientUserId: data.senderUserId,
            activeChatId: data.senderUserId
          },
          () => {
            this.getRecipientSocketId();
          }
        );
      }

      this.setState({
        currentChats: newChats
      });
    }
  };

  handleTextChange = e => {
    this.setState({
      message: e.target.value
    });
  };

  sendTyping = isTyping => {
    const { socket, recipientSocketId } = this.state;
    const { currentUser } = this.props;
    if (recipientSocketId) {
      socket.emit("TYPING", { recipientSocketId: recipientSocketId, isTyping: isTyping, senderUserId: currentUser.id });
    }
  };

  sendMessage = e => {
    const { socket, recipientName, recipientSocketId, username, message, recipientUserId, activeUsers } = this.state;
    const { currentUser } = this.props;

    e.preventDefault();
    if (message != "" && message != " ") {
      this.setState({
        message: ""
      });

      const payload = {
        recipientUserId,
        message
      };

      if (activeUsers[recipientUserId]) {
        payload.hasBeenRead = 1;
      } else {
        payload.hasBeenRead = 0;
      }

      postMessage(payload)
        .then(response => {
          const newTime = moment(response.data.items.dateCreated).format("h:mm:ss a");

          socket.emit("SEND_MESSAGE", {
            sender: username,
            senderUserId: currentUser.id,
            message: message,
            time: newTime,
            messageKey: response.data.items.id,
            recipientName: recipientName,
            recipientSocketId: recipientSocketId,
            senderAvatar: currentUser.avatarUrl,
            recipientUserId: recipientUserId
          });

          if (response.data.items.recentMessageCount > 12) {
            this.showAlert();
          }
        })
        .catch(() => {
          console.log("There was an error sending your message to the DB");
        });
    }
  };

  sendMessageOnEnter = e => {
    const { socket, recipientName, recipientSocketId, username, message, recipientUserId, activeUsers } = this.state;
    const { currentUser } = this.props;
    if (e.key === "Enter") {
      e.preventDefault();
      if (message != "" && message != " ") {
        this.setState({
          message: ""
        });

        const payload = {
          recipientUserId,
          message
        };

        if (activeUsers[recipientUserId]) {
          payload.hasBeenRead = 1;
        } else {
          payload.hasBeenRead = 0;
        }

        postMessage(payload)
          .then(response => {
            const newTime = moment(response.data.items.dateCreated).format("h:mm:ss a");

            socket.emit("SEND_MESSAGE", {
              sender: username,
              senderUserId: currentUser.id,
              message: message,
              time: newTime,
              messageKey: response.data.items.id,
              recipientName: recipientName,
              recipientSocketId: recipientSocketId,
              senderAvatar: currentUser.avatarUrl,
              recipientUserId: recipientUserId
            });

            if (response.data.items.recentMessageCount > 12) {
              this.showAlert();
            }
          })
          .catch(() => {
            console.log("There was an error sending your message to the DB");
          });
      }
    }
  };

  handleSwitchConvos = () => {
    const { currentUser } = this.props;
    const { recipientSocketId, activeChatId, currentChats } = this.state;

    getMessagesByUserId(this.state.activeChatId).then(response => {
      const chatArray = response.data.items.chatHistory;
      const newArray = [];
      var user = {};
      if (chatArray[0].SenderUserId == currentUser.id) {
        getUserById(chatArray[0].RecipientUserId).then(res => {
          user = res.data.item;
          for (let i = 0; i < chatArray.length; i++) {
            const newTime = moment(chatArray[i].DateCreated).format("h:mm:ss a");
            if (chatArray[i].SenderUserId == currentUser.id) {
              newArray.push({
                author: currentUser.firstName,
                message: chatArray[i].Message,
                avatar: currentUser.avatarUrl,
                time: newTime,
                messageKey: chatArray[i].Id
              });
            } else {
              newArray.push({
                author: user.firstName,
                message: chatArray[i].Message,
                avatar: user.avatarUrl,
                time: newTime,
                messageKey: chatArray[i].Id
              });
            }
            if (newArray.length == chatArray.length) {
              this.setState({
                messages: newArray,
                scrolledToBottom: true,
                message: ""
              });
            }
          }
        });
      } else {
        getUserById(chatArray[0].SenderUserId).then(res => {
          user = res.data.item;
          for (let i = 0; i < chatArray.length; i++) {
            const newTime = moment(chatArray[i].DateCreated).format("h:mm:ss a");
            if (chatArray[i].SenderUserId == currentUser.id) {
              newArray.push({
                author: currentUser.firstName,
                message: chatArray[i].Message,
                avatar: currentUser.avatarUrl,
                time: newTime,
                messageKey: chatArray[i].Id
              });
            } else {
              newArray.push({
                author: user.firstName,
                message: chatArray[i].Message,
                avatar: user.avatarUrl,
                time: newTime,
                messageKey: chatArray[i].Id
              });
            }
            if (newArray.length == chatArray.length) {
              this.setState({
                messages: newArray,
                scrolledToBottom: true,
                message: ""
              });
            }
          }
        });
      }
    });
    if (!recipientSocketId) {
      this.setState({ recipientUserId: activeChatId }, () => {
        this.getRecipientSocketId();
      });
    }
  };

  handleGetConvos = () => {
    const newArray = [];
    getConvosByUserId().then(response => {
      const chatArray = response.data.items.convoHistory;
      if (response.data.items.convoHistory.length > 0) {
        for (let i = 0; i < chatArray.length; i++) {
          newArray.push({
            name: chatArray[i].FirstName + " " + chatArray[i].LastName,
            snippet: "",
            avatar: chatArray[i].AvatarUrl,
            unseenMessages: 0,
            id: chatArray[i].SenderUserId
          });
          if (newArray.length == chatArray.length) {
            this.setState({ currentChats: newArray }, () => {
              if (this.state.activeChatId == "") {
                this.setState({ activeChatId: this.state.currentChats[0].id });
              }
            });
          }
        }
      } else {
        this.setState({ messagesToShow: true });
      }
    });
  };

  // Handle All Recipient/Active Users Info

  updateUsers = connectedUsers => {
    this.setState({ activeUsers: connectedUsers }, () => console.log("active users list is", this.state.activeUsers));
  };

  reformatUsersArray = connectedUsers => {
    const newArray = [];
    const users = Object.entries(connectedUsers);
    for (let i = 0; i < users.length; i++) {
      newArray.push({ name: users[i][1]["name"], userId: users[i][0] });
    }
    //console.log("This is the new array ", newArray);
    this.setState({ userSearch: newArray });
  };

  changeRecipient = user => {
    this.setState({ recipient: user, message: "" }, () => {
      //console.log("new recipient list: ", this.state.recipient);
      this.getUserInfo(user.userId);
    });
    const { currentChats } = this.state;
    const result = currentChats.filter(chat => chat["id"] == user.userId);
    if (result.length > 0) {
      this.setState({ activeChatId: user.userId });
    }
  };

  getUserInfo = id => {
    getUserById(id)
      .then(response => {
        const user = response.data.item;
        this.setState(
          {
            recipientAvatar: user.avatarUrl,
            recipientUserId: user.id,
            recipientName: user.firstName + " " + user.lastName
          },
          () => {
            this.getRecipientSocketId();
            const { currentChats } = this.state;
            const result = currentChats.filter(chat => chat["id"] == id);
            if (result.length == 0) {
              this.updateCurrentChats(id);
            }
          }
        );
      })
      .catch(() => console.log("There was an error retrieving recipient info from the server"));
  };

  getRecipientSocketId = () => {
    const { recipientUserId, activeUsers } = this.state;
    if (activeUsers[recipientUserId]) {
      this.setState({ recipientSocketId: activeUsers[recipientUserId]["socketId"] });
    } else {
      this.setState({ recipientSocketId: "" });
    }
  };

  updateCurrentChats = id => {
    const { currentChats } = this.state;
    const result = currentChats.filter(chat => chat["id"] == id);
    if (result.length == 0) {
      const { currentChats, recipientName, recipientAvatar, recipientUserId } = this.state;
      const addChat = (arr, value) => arr.concat(value);
      const updatedChats = addChat(currentChats, {
        name: recipientName,
        snippet: "",
        avatar: recipientAvatar,
        unseenMessages: 0,
        id: recipientUserId
      });
      this.setState({ currentChats: updatedChats, activeChatId: recipientUserId });
    }
  };

  handleResetUnseenMessages = () => {
    const { currentChats, activeChatId } = this.state;
    const updatedChat = currentChats.map(chat => {
      if (activeChatId === chat.id) {
        return {
          ...chat,
          unseenMessages: 0,
          snippet: ""
        };
      } else {
        return chat;
      }
    });
    this.setState({ currentChats: updatedChat });
  };

  handleGetContacts = () => {
    const newContactsList = [];
    const id = this.props.currentUser.id;
    getContacts(id)
      .then(response => {
        if (response.data.items.contacts) {
          this.setState({ contactsArray: response.data.items.contacts }, () => {
            //console.log("Here are the userids you can message", this.state.contactsArray);
            for (let i = 0; i < this.state.contactsArray.length; i++) {
              getUserById(this.state.contactsArray[i]["UserId"]).then(res => {
                const user = res.data.item;
                newContactsList.push({
                  name: user.firstName + " " + user.lastName,
                  userId: user.id,
                  avatar: user.avatarUrl
                });
              });
            }
            this.setState({ messageContacts: newContactsList });
          });
        } else {
          console.log("You need followers");
        }
      })
      .catch(() => {
        console.log("There was an error getting your contacts");
      });
  };

  //Misc

  showAlert = () => {
    this.setState({
      alert: true
    });
  };

  hideAlert = () => {
    setTimeout(
      this.setState({
        alert: false
      }),
      2000
    );
  };

  acceptScrollerRef = el => {
    //console.log("got the ref!", el);

    this.el = el;
  };

  acceptScroll = element => {
    this.element = element;
  };

  scrollToBottom = () => {
    if (this.el) {
      if (this.state.scrolledToBottom) {
        this.el.scrollIntoView(false);
      } else {
        if (this.state.messages.length > 3) {
          this.setState({ showMessages: true });
        }
      }
    }
  };

  forceScrollToBottom = () => {
    this.el.scrollIntoView({ behavior: "smooth" });
    this.setState({ showMessages: false });
  };

  handleChange = handleChange.bind(this);

  handleScrolledToBottom = () => {
    this.setState(
      { scrolledToBottom: true }
      // , () => console.log("scrolled to bottom: ", this.state.scrolledToBottom)
    );
  };

  handleScrollChecker = () => {
    this.setState(
      { scrolledToBottom: false }
      // , () => console.log("scrolled to bottom: ", this.state.scrolledToBottom)
    );
  };
  updateChatId = data => {
    this.setState({ activeChatId: data }, () => {
      //console.log("The selected chat Id is", this.state.activeChatId);
      this.getUserInfo(data);
    });
  };

  handleDrawerState = () => {
    this.setState({
      drawerState: true
    });
  };

  resetDrawer = () => {
    this.setState({
      drawerState: false
    });
  };

  onChatToggleDrawer = () => {
    this.setState({
      drawerState: false
    });
  };

  showSideNav = () => {
    return (
      <SideBar
        recipient={this.state.recipient}
        handleChange={this.handleChange}
        activeUsers={this.state.activeUsers}
        userSearch={this.state.userSearch}
        changeRecipient={this.changeRecipient}
        currentChats={this.state.currentChats}
        updateChatId={this.updateChatId}
        activeChatId={this.state.activeChatId}
        recipientSocketId={this.state.recipientSocketId}
        handleResetUnseenMessages={this.handleResetUnseenMessages}
        messageContacts={this.state.messageContacts}
        resetDrawer={this.resetDrawer}
      />
    );
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.state.messages !== prevState.messages) {
      this.scrollToBottom();
      if (this.state.isTyping == true) {
        this.setState({ isTyping: false });
      }
    }

    if (this.state.scrolledToBottom !== prevState.scrolledToBottom && this.state.showMessages == true) {
      this.setState({ showMessages: false });
    }

    if (this.state.scrolledToBottom === true && this.state.isTyping !== prevState.isTyping) {
      this.scrollToBottom();
    }

    if (this.state.activeChatId !== prevState.activeChatId) {
      this.setState(
        {
          messages: [],
          recipientUserId: this.state.activeChatId
        },
        () => {
          this.getUserInfo(this.state.activeChatId);
          this.handleSwitchConvos();
        }
      );
    }

    if (this.state.currentChats !== prevState.currentChats && this.state.pageHasLoaded === false) {
      this.setState({ pageHasLoaded: true });
    }

    if (this.state.activeUsers !== prevState.activeUsers && this.state.activeChatId === this.state.recipientUserId) {
      this.getRecipientSocketId();
    }
  }

  render() {
    const { currentUser } = this.props;
    const {
      activeChatId,
      messages,
      recipientAvatar,
      recipientName,
      recipientUserId,
      currentChats,
      activeUsers,
      userSearch,
      recipient,
      showMessages,
      recipientSocketId,
      pageHasLoaded,
      isTyping,
      messagesToShow,
      messageContacts,
      drawerState
    } = this.state;
    return (
      <React.Fragment>
        <div className="app-main-content">
          <div className="app-wrapper app-wrapper-module">
            <div className="row justify-content-center">
              <div className="col-xs-6 col-md-10 col-lg-7" style={{ paddingTop: "30px", paddingBottom: "30px" }}>
                <div className="app-module chat-module animated slideInUpTiny animation-duration-3">
                  <div className="chat-module-box">
                    <div className="d-block d-xl-none">
                      <Drawer
                        touch={true}
                        transitions={true}
                        enableDragHandle={true}
                        open={drawerState}
                        onOpenChange={this.onChatToggleDrawer}
                        sidebar={this.showSideNav()}
                      />
                    </div>

                    <div className="chat-sidenav d-none d-xl-flex">
                      <SideBar
                        recipient={recipient}
                        handleChange={this.handleChange}
                        activeUsers={activeUsers}
                        userSearch={userSearch}
                        changeRecipient={this.changeRecipient}
                        currentChats={currentChats}
                        updateChatId={this.updateChatId}
                        activeChatId={activeChatId}
                        recipientSocketId={recipientSocketId}
                        handleResetUnseenMessages={this.handleResetUnseenMessages}
                        messageContacts={messageContacts}
                        resetDrawer={this.resetDrawer}
                      />
                    </div>

                    <div className="chat-box">
                      <div className="chat-main" style={{ height: "100%" }}>
                        <div className="chat-main-header">
                          <span className="icon-btn d-block d-xl-none chat-btn" onClick={this.handleDrawerState}>
                            <i className="zmdi zmdi-comment-text" />
                          </span>
                          {pageHasLoaded && (
                            <ChatMainHeader
                              recipientAvatar={recipientAvatar}
                              recipientName={recipientName}
                              recipientUserId={recipientUserId}
                              recipientSocketId={recipientSocketId}
                              messagesToShow={messagesToShow}
                              activeUsers={activeUsers}
                              activeChatId={activeChatId}
                            />
                          )}
                        </div>
                        <div
                          className="chat-list-scroll scrollbar customClass"
                          style={{
                            position: "relative",
                            width: "100%"
                          }}
                        >
                          <div
                            style={{
                              position: "absolute",
                              top: "0px",
                              left: "0px",
                              right: "0px",
                              bottom: "0px",
                              overflowY: "scroll"
                            }}
                            ref={this.acceptScroll}
                          >
                            <div className="chat-main-content">
                              {messages.map(message => (
                                <ChatMainContent
                                  key={message.messageKey}
                                  message={message.message}
                                  author={message.author}
                                  currentUser={currentUser}
                                  time={message.time}
                                  senderAvatar={message.avatar}
                                  scrollToBottom={this.scrollToBottom}
                                />
                              ))}
                              {isTyping && (
                                <div className="d-flex flex-nowrap chat-item">
                                  <img className="rounded-circle avatar size-40 align-self-end" src={recipientAvatar} />

                                  <div className="message">
                                    <div className="typing-indicator" style={{ marginLeft: "16px" }}>
                                      <span />
                                      <span />
                                      <span />
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                            <InfiniteScroll
                              onVisible={this.handleScrolledToBottom}
                              notVisible={this.handleScrollChecker}
                            />
                            {/* scrolling does not work accurately in Microsoft Edge */}
                            <div key="scroller" style={{ float: "left", clear: "both" }} ref={this.acceptScrollerRef} />
                          </div>
                          <div className="track-horizontal" style={{ display: "none" }}>
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
                                height: "133px",
                                transform: "translateY(0px)"
                              }}
                            />
                          </div>
                        </div>
                        {showMessages && (
                          <div className="row" style={{ margin: "0 auto", justifyContent: "center" }}>
                            <button
                              className="col-md-4 d-flex align-items-center badge badge-pill text-white boxShadow"
                              style={{
                                position: "absolute",
                                zIndex: "5",
                                opacity: "0.7",
                                justifyContent: "center",
                                backgroundColor: "#0648a5",
                                fontSize: "100%",
                                paddingTop: "1%",
                                paddingBottom: "1%",
                                bottom: "90px"
                              }}
                              onClick={this.forceScrollToBottom}
                            >
                              <i className="zmdi zmdi-long-arrow-down zmdi-hc-fw" />
                              New Messages
                            </button>
                          </div>
                        )}
                        {recipientName && (
                          <ChatMainFooter
                            sendMessage={this.sendMessage}
                            sendMessageOnEnter={this.sendMessageOnEnter}
                            message={this.state.message}
                            handleTextChange={this.handleTextChange}
                            sendTyping={this.sendTyping}
                          />
                        )}
                        {this.state.alert && (
                          <SweetAlert
                            warning
                            confirmBtnText="Okay"
                            confirmBtnBsStyle="danger"
                            cancelBtnBsStyle="default"
                            title="Please Refrain From Spamming!"
                            onConfirm={this.hideAlert}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return { currentUser: state.currentUser };
}

function requiresUser(Component) {
  return props => (
    <IfLoginStatus loggedIn={true}>
      <Component {...props} />
    </IfLoginStatus>
  );
}

export default requiresUser(withRouter(connect(mapStateToProps)(Message)));
