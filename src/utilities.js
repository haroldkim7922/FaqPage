export function handleChange(e) {
  const key = e.target.name;
  const val = e.target.value;
  this.setState({
    [key]: val
  });
}
