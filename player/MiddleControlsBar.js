import * as React from 'react'
import { View, StyleSheet } from 'react-native'
import * as PropTypes from 'prop-types'
import PlayerIcon from './PlayerIcon'
import { playerPlay, playerPause, playerRestart, disableFullscreen, enableFullscreen } from './images/index'
export default class MiddleControlsBar extends React.PureComponent {
  constructor (props) {
    super(props)
    this.restartVideo = () => this.props.setPosition(0)
  }
  render () {
    return (<View style={styles.barWrapper}>
      {this.renderPlayIcon()}
      {this.renderToggleFullscreenIcon()}
    </View>)
  }
  renderToggleFullscreenIcon () {
    if (this.props.fullscreen) {
      return (
        <PlayerIcon iconSource={disableFullscreen} onPress={this.props.onToggleFullscreen} />
      )
    } else {
      return (
        <PlayerIcon iconSource={enableFullscreen} onPress={this.props.onToggleFullscreen} />
      )
    }
  }
  renderPlayIcon () {
    if (this.props.hasFinished) {
      return this.props.restartButton && (<PlayerIcon iconSource={playerRestart} onPress={() => {
        this.restartVideo()
        this.props.setPlaying()
      }} />)
    } else {
      return (
        this.props.isPaused ? (<PlayerIcon iconSource={playerPlay} onPress={this.props.setPlaying} />) : (<PlayerIcon iconSource={playerPause} onPress={this.props.setPaused} />)
      )
    }
  }
  renderFullscreenIcon () {

  }
}
MiddleControlsBar.propTypes = {
    // Metadata
  isPaused: PropTypes.bool.isRequired,
  restartButton: PropTypes.bool,
    // Controls
  setPlaying: PropTypes.func.isRequired,
  setPaused: PropTypes.func.isRequired,
  setPosition: PropTypes.func.isRequired // Move video to the given time (in seconds).
}
MiddleControlsBar.defaultProps = {
  restartButton: true
}
const styles = StyleSheet.create({
  barWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    maxWidth: 160,
    minWidth: 80,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    borderRadius: 5
  },
  barItem: {
    margin: 5
  }
})
