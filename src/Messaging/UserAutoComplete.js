import React from "react";
import Downshift from "downshift";

const UserAutocomplete = ({ items, onChange }) => (
  <Downshift
    onChange={selectedItem => {
      onChange(selectedItem);
    }}
    itemToString={user => (user ? user.name : "")}
  >
    {({ getInputProps, getItemProps, isOpen, inputValue, highlightedIndex, selectedItem }) => (
      <div className="search-wrapper">
        <div className="search-bar right-side-icon bg-transparent ">
          <div className="form-group">
            <input className="form-control border-0" {...getInputProps({ placeholder: "Search or start new chat" })} />
            <button className="search-icon">
              <i className="zmdi zmdi-search zmdi-hc-lg" />
            </button>
            {isOpen ? (
              <div style={{ border: "1px solid #ccc", backgroundColor: "white" }}>
                {items
                  .filter(item => !inputValue || item.name.toLowerCase().includes(inputValue.toLowerCase()))
                  .slice(0, 15)
                  .map((user, index) => (
                    <div
                      {...getItemProps({ item: user })}
                      key={user.userId}
                      style={{
                        backgroundColor: highlightedIndex === index ? "#c4e3c4" : "white",
                        fontWeight: selectedItem === user.name ? "bold" : "normal",
                        marginTop: "3%",
                        marginBottom: "1%"
                      }}
                    >
                      <div className="chat-user-row row">
                        <div className="chat-avatar col-xl-2 col-3">
                          <div className="chat-avatar-mode">
                            <img
                              src={user.avatar}
                              className="rounded-circle size-30"
                              alt={user.name}
                              style={{ margin: "1%" }}
                            />
                          </div>
                        </div>
                        <div className="chat-info col-xl-8 col-6">
                          <span> </span>
                          <span className="name h4"> {user.name}</span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    )}
  </Downshift>
);

export default UserAutocomplete;
