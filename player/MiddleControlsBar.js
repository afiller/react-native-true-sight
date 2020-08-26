import * as React from 'react'
import { View, StyleSheet } from 'react-native'
import * as PropTypes from 'prop-types'
import PlayerIcon from './PlayerIcon'
import {Icon} from 'react-native-elements'

export default class MiddleControlsBar extends React.PureComponent {
  constructor (props) {
    super(props)
    this.restartVideo = () => this.props.setPosition(0)
  }
  render () {
    if (this.props.isAudio) {
      return (<View accessibilityLabel={'MiddleButtons'} style={styles.barWrapper}>
      <View accessibilityLabel={'PlayVideoButton'}>{this.renderPlayIcon()}</View>
    </View>)
    } else {
      return (<View accessibilityLabel={'MiddleButtons'} style={styles.barWrapper}>
      <View accessibilityLabel={'PlayVideoButton'}>{this.renderPlayIcon()}</View>
      <View accessibilityLabel={'FullScreenButton'}>{this.renderToggleFullscreenIcon()}</View>
    </View>)
    }
  }
  renderToggleFullscreenIcon () {
    if (this.props.inFullscreen) {
      return (
        <PlayerIcon icon={<Icon name='fullscreen-exit' color={this.props.iconColor} size={this.props.iconSize} />} onPress={this.props.onToggleFullscreen} />
      )
    } else {
      return (
        <PlayerIcon icon={<Icon name='fullscreen' color={this.props.iconColor} size={this.props.iconSize} />} onPress={this.props.onToggleFullscreen} />
      )
    }
  }
  renderPlayIcon () {
    if (this.props.hasFinished) {
      return this.props.restartButton && (<PlayerIcon icon={<Icon name='replay' color={this.props.iconColor} size={this.props.iconSize} />} onPress={() => {
        this.restartVideo()
        this.props.setPlaying()
      }} />)
    } else {
      return (
        this.props.isPaused ? (<PlayerIcon icon={<Icon name='play-arrow' color={this.props.iconColor} size={this.props.iconSize} />} onPress={this.props.setPlaying} />) : (<PlayerIcon icon={<Icon name='pause' color={this.props.iconColor} size={this.props.iconSize} />} onPress={this.props.setPaused} />)
      )
    }
  }
}
MiddleControlsBar.propTypes = {
  // Metadata
  isPaused: PropTypes.bool.isRequired,
  inFullscreen: PropTypes.bool,
  restartButton: PropTypes.bool,
  // Style
  iconSize: PropTypes.number,
  iconColor: PropTypes.string,
  // Controls
  setPlaying: PropTypes.func.isRequired,
  setPaused: PropTypes.func.isRequired,
  setPosition: PropTypes.func.isRequired // Move video to the given time (in seconds).
}
MiddleControlsBar.defaultProps = {
  restartButton: true,
  inFullscreen: false,
  iconSize: 50,
  iconColor: '#fafafa'
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
