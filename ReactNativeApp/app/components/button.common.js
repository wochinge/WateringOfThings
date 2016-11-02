export default {
  getInitialState() {
    return {
      pressed: false
    }
  },

  handlePress() {
    this.setState({pressed: !this.state.pressed});
  }
}
