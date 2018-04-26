import * as React from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import * as PropTypes from 'prop-types'

export default class PlayerIcon extends React.PureComponent {
  render () {
    return (<View style={styles.iconWrapper}>
      <TouchableOpacity onPress={this.props.onPress}>
        {this.props.icon}
      </TouchableOpacity>
    </View>)
  }
}
PlayerIcon.propTypes = {
  icon: PropTypes.object.isRequired,
  onPress: PropTypes.func.isRequired
}
const styles = StyleSheet.create({
  iconWrapper: {
    padding: 5,
    justifyContent: 'center'
  },
  icon: {
    margin: 15,
    width: 30,
    height: 30,
    tintColor: '#fafafa'
  }
})
