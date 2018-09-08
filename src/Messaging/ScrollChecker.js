import React from "react";
import "intersection-observer";

class InfiniteScroll extends React.Component {
  callback = entries => {
    let isIntersecting = false;

    for (const entry of entries) {
      if (entry.isIntersecting) {
        isIntersecting = true;
        break;
      }
    }

    if (isIntersecting) {
      this.props.onVisible();
    } else {
      this.props.notVisible();
    }
  };

  ref = React.createRef();

  componentDidMount() {
    this.observer = new IntersectionObserver(this.callback, {
      rootMargin: "50px"
    });

    this.observer.observe(this.ref.current);
  }

  componentWillUnmount() {
    this.observer.unobserve(this.ref.current);
  }

  render() {
    return <div ref={this.ref} />;
  }
}

export default InfiniteScroll;
