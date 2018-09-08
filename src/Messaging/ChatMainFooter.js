import React from "react";

class ChatMainFooter extends React.Component {
  state = {
    isTyping: false
  };

  sendTyping = () => {
    this.lastUpdateTime = Date.now();
    if (!this.state.isTyping) {
      this.setState({ isTyping: true });
      this.props.sendTyping(true);
      this.startCheckingTyping();
    }
  };

  componentWillUnmount() {
    this.stopCheckingTyping();
  }

  /*
  startCheckingTyping
  start an interval that checks if user is typing
  */
  startCheckingTyping = () => {
    //console.log("Typing");
    this.typingInterval = setInterval(() => {
      if (Date.now() - this.lastUpdateTime > 4000) {
        this.setState({ isTyping: false });
        this.stopCheckingTyping();
      }
    }, 400);
  };

  /*
  stopCheckingTyping
  start the interval from checking if the user is typing
  */

  stopCheckingTyping = () => {
    //console.log("Stop Typing");
    if (this.typingInterval) {
      clearInterval(this.typingInterval);
      this.props.sendTyping(false);
    }
  };

  render() {
    const { message, handleTextChange, sendMessage, sendMessageOnEnter } = this.props;
    return (
      <div className="chat-main-footer" style={{ position: "relative", bottom: "0px" }}>
        <div className="d-flex flex-row align-items-center" style={{ maxHeight: "51px" }}>
          <div className="col">
            <div className="form-group">
              <textarea
                id="required"
                className="border-0 form-control chat-textarea"
                placeholder="Type and hit enter to send message"
                value={message}
                onChange={handleTextChange}
                onKeyPress={sendMessageOnEnter}
                onKeyUp={e => {
                  e.keyCode !== 13 && this.sendTyping();
                }}
              />
            </div>
          </div>
          <div className="chat-sent">
            <span className="icon-btn" onClick={sendMessage}>
              <i className="zmdi  zmdi-mail-send" />
            </span>
          </div>
        </div>
      </div>
    );
  }
}

export default ChatMainFooter;
