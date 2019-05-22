import React, { Component } from 'react'
import { Image, StyleSheet, View, AsyncStorage } from 'react-native'
import { connect } from 'react-redux'
import { setUser } from '../store/actions/authActions'
import axios from 'axios'

export class Splash extends Component {

  componentDidMount(){

    AsyncStorage.getItem('token')
    .then(result=>{
      return axios({
        method:'get',
        url: "http://35.247.157.227/users/user",
        headers: {
          authorization : result
        }
      })
    })
    .then(({data})=>{
      this.props.setUser(data)
      this.props.navigation.navigate("App")
    })
    .catch(err=>{
      console.log("masukk auth")
      this.props.navigation.navigate("Auth")
    })
  }
  render() {
    return (
      <View style={styles.container}>
        <Image
          source={require('../assets/eveLogo.png')}
          style={{
            width: 144,
            height: 87
          }}
        />
      </View>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setUser: user => dispatch(setUser(user))
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#a6003c"
  }
})

export default connect(null, mapDispatchToProps)(Splash)
