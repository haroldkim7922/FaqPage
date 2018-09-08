import React from "react";

class ChatUserItem extends React.Component {
  state = {
    status: "away"
  };

  componentDidMount() {
    if (this.props.activeUsers[this.props.id]) {
      this.setState({ status: "online" });
    } else {
      this.setState({ status: "away" });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.activeChatId === this.props.id) {
      if (prevProps.unseenMessages !== 0) {
        this.props.handleResetUnseenMessages();
      }
    }

    if (prevProps.activeUsers !== this.props.activeUsers) {
      if (this.props.activeUsers[this.props.id]) {
        this.setState({ status: "online" });
      } else {
        this.setState({ status: "away" });
      }
    }
  }

  render() {
    const { status } = this.state;
    const {
      name,
      avatar,
      lastMessageSent,
      snippet,
      updateChatId,
      id,
      activeChatId,
      unseenMessages,
      resetDrawer
    } = this.props;
    let div;
    if (activeChatId == id) {
      div = "active";
    } else {
      div = "";
    }

    return (
      <React.Fragment>
        <div
          className={`chat-user-item ${div}`}
          onClick={() => {
            updateChatId(id);
            resetDrawer();
          }}
        >
          <div className="chat-user-row row">
            <div className="chat-avatar col-xl-2 col-3">
              <div className="chat-avatar-mode">
                <img src={avatar} className="rounded-circle size-40" alt={name} />
                <span className={`chat-mode small ${status}`} />
              </div>
            </div>
            <div className="chat-info col-xl-8 col-6">
              <span className="name h4">{name}</span>
              <div className="chat-info-des">{snippet}</div>
              <div className="last-message-time">{lastMessageSent}</div>
            </div>
            <div className="chat-date col-xl-2 col-3">
              {unseenMessages > 0 ? (
                <div className="bg-primary rounded-circle badge text-white">{unseenMessages}</div>
              ) : (
                <div />
              )}
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default ChatUserItem;
