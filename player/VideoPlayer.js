import * as React from 'react'
import { Animated, StyleSheet, View, TouchableWithoutFeedback } from 'react-native'
import Video from 'react-native-video'
import * as PropTypes from 'prop-types'
import DefaultLoader from './Loader'
import DefaultMiddleControlsBar from './MiddleControlsBar'
import DefaultBottomControlsBar from './BottomControlsBar'
const noop = () => { }
export default class VideoPlayer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      isLoading: true,
      showControls: false,
      isPaused: !props.autoStart,
      currentTime: props.initialPosition,
      totalTime: 0 // In seconds.
    }
    this.controlsFadeValue = new Animated.Value(1)
    this.onLoad = this.onLoad.bind(this)
    this.onProgress = this.onProgress.bind(this)
    this.onEnd = this.onEnd.bind(this)
    this.toggleControls = () => {
      this.setState(({ showControls }) => ({
        showControls: !showControls
      }))
    }
    this.setPosition = position => {
      this.player.seek(position)
      this.setState({ currentTime: position })
    }
    this.setNotLoading = () => this.setState({ isLoading: false })
    this.setPlaying = () => this.setState({ isPaused: false })
    this.setPaused = () => this.setState({ isPaused: true })
    this.getPaused = () => this.state.isPaused
    this.getCurrentTime = () => this.state.currentTime

    this.forcePause = false
  }
  componentDidMount () {
    this.toggleControls()
  }
  componentWillUnmount () {
    clearTimeout(this.controlsHider)
  }
  componentWillUpdate (nextProps, nextState) {
        // Fade in/out on controls.
    if (nextState.showControls !== this.state.showControls) {
      Animated.timing(this.controlsFadeValue, {
        toValue: nextState.showControls ? 1 : 0,
        duration: 250,
        useNativeDriver: true
      }).start()
    }
  }
  componentDidUpdate (prevProps, prevState) {
    const controlsDisplayed = prevState.showControls !== this.state.showControls &&
            this.state.showControls === true
        // Defined whether of not trigger controls auto-hide.
    switch (true) {
      case controlsDisplayed: // Control are displayed now
      case prevState.isPaused !== this.state.isPaused:// Player is not paused now
                // This reset dismiss on action.
        clearTimeout(this.controlsHider)
        this.controlsHider = this.createControlHider()
        return
    }
  }
    /**
     * Register a timeout that will hide controls.
     *
     * @param {number} delay In ms
     *
     * @returns {number} Reference to the timeout
     */
  createControlHider (delay = 3000) {
    return setTimeout(() => {
      if (!this.state.showControls) {
        return
      }
      this.setState({
        showControls: false
      })
    }, delay)
  }
  onLoad (meta) {
    // If there was an initial Position set, jump to that position
    if (this.props.initialPosition !== 0) {
      this.setPosition(this.props.initialPosition)
    }
    this.setNotLoading()
    this.setState({ totalTime: Math.floor(meta.duration) })
  }
  onProgress (meta) {
    const currentTime = Math.floor(meta.currentTime)
    // Set player to loading if its above the temp. playable duration
    let isLoading = ((currentTime >= meta.playableDuration && currentTime < this.state.totalTime))
    if (currentTime !== this.state.currentTime) {
      this.setState({
        currentTime,
        isLoading
      })
    }
    this.props.onProgress(Object.assign(meta, { maximumDuration: this.state.totalTime }))
  }
  onEnd () {
    // Pause video and reset
    this.setState({
      isPaused: true,
      currentTime: this.state.totalTime,
      isLoading: false
    }, this.props.onEnd())
  }

  renderControls () {
    const { middleControlsBar, middleControlsBarProps, bottomControlsBarProps, bottomControlsBar} = this.props
    const { currentTime, totalTime, isLoading, showControls, isPaused } = this.state
    const MiddleControlsBar = middleControlsBar || DefaultMiddleControlsBar
    const BottomControlsBar = bottomControlsBar || DefaultBottomControlsBar

    // Those are the default passed.
    const baseControlsBarProps = {
      currentTime,
      totalTime,
      isPaused,
      setPlaying: this.setPlaying,
      setPaused: this.setPaused,
      setPosition: this.setPosition
    }
    if (!isLoading) {
      return (
        <Animated.View style={[styles.controls, { opacity: this.controlsFadeValue }]} pointerEvents={showControls ? undefined : 'none'}>
          <View style={styles.middleControlsBar}>
            <MiddleControlsBar {...middleControlsBarProps} {...baseControlsBarProps} hasFinished={(this.state.isPaused && (this.state.currentTime === this.state.totalTime) && (this.state.currentTime !== 0))} />
          </View>
          <View style={styles.bottomControlsBar}>
            <BottomControlsBar {...bottomControlsBarProps} {...baseControlsBarProps} />
          </View>
        </Animated.View>
      )
    }
  }

  render () {
    const { loader, source, onError } = this.props
    const { currentTime, totalTime, isLoading, isPaused } = this.state
    const Loader = loader || DefaultLoader
    return (<TouchableWithoutFeedback onPress={this.toggleControls}>
      <View style={styles.wrapper}>
        <View style={styles.loaderWrapper} pointerEvents='none'>
          {isLoading ? <Loader /> : null}
        </View>
        {this.renderControls()}
        <Video
          ref={(ref) => {
            this.player = ref
          }}
          repeat={false}
          source={{ uri: source }} style={styles.backgroundVideo}
          resizeMode='contain'
          paused={isPaused || this.forcePause}
          onError={onError}
          onLoad={this.onLoad}
          onProgress={this.onProgress}
          onEnd={this.onEnd}
        />
      </View>
    </TouchableWithoutFeedback>)
  }
}
VideoPlayer.propTypes = {
    // Metadata
  initialPosition: PropTypes.number,
  source: PropTypes.string.isRequired,
  autoStart: PropTypes.bool,
    // Customisable components
  loader: PropTypes.node,
    // Bar displayed on the middle of the screen.
  middleControlsBar: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  middleControlsBarProps: PropTypes.object,
    // Bar displayed on the bottom of the screen.
  bottomControlsBar: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  bottomControlsBarProps: PropTypes.object,
    // Hooks
  onError: PropTypes.func,
  onProgress: PropTypes.func,
  onEnd: PropTypes.func
}
VideoPlayer.defaultProps = {
  initialPosition: 0,
  autoStart: true,
  onError: noop,
  onProgress: noop,
  onEnd: noop
}
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center'
  },
  controls: Object.assign({}, StyleSheet.absoluteFillObject, { zIndex: 5 }),
  loaderWrapper: Object.assign({}, StyleSheet.absoluteFillObject, { zIndex: 9, justifyContent: 'center', alignItems: 'center' }),
  middleControlsBar: Object.assign({}, StyleSheet.absoluteFillObject, { zIndex: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }),
  backgroundVideo: {
    flex: 1
  },
  bottomControlsBar: {
    zIndex: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0
  }
})
