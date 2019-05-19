import React, { Component } from 'react';
import axios from '../serverAPI/backendServer'
import { Permissions, Notifications } from 'expo';
import { Constants } from 'expo'
import {
  StyleSheet,
  View,
  Image,
  KeyboardAvoidingView
} from "react-native";
import {
  Container,
  Header,
  Title,
  Content,
  Footer,
  FooterTab,
  Button,
  Left,
  Right,
  Body,
  Icon,
  Text,
  Label,
  Form,
  Input,
  Item,
  Thumbnail
} from 'native-base';
import { register } from '../store/actions/authActions'
import { connect } from 'react-redux'

class Register extends Component {
  state = {
    name: '',
    email: '',
    password: '',
    token: '',
  }

  componentDidMount() {
    this.getToken()
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.auth.loggedInUser !== null) {
      this.props.navigation.navigate('Chat')
    }
  }

  getToken = async () => {
    try {
      const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
      )
      let finalStatus = existingStatus

      if (existingStatus !== 'granted') {
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status
      }

      if (finalStatus !== 'granted') {
        return
      }

      let token = await Notifications.getExpoPushTokenAsync()
      this.setState({
        token
      })
    } catch (err) {
      console.log(err)
    }
  }

  submitForm = async () => {
    try {
      const { name, email, password, token } = this.state

      await this.props.register({
        name,
        email,
        password,
        expoNotificationToken: token
      })

    } catch (err) {
      console.log(err)
    }
  }

  render() {
    return (
      <KeyboardAvoidingView
        behavior="padding"
        enabled
        resetScrollToCoords={{ x: 0, y: 0 }}
        scrollEnabled={false}
        style={{
          flex: 1,
          paddingTop: Constants.statusBarHeight,
        }}
      >
        <Container style={{ backgroundColor: "white" }}>
          <Content>
            <Container>
              <Container style={{
                flex: 5,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#a6003c'
              }}>
                <Image
                  source={require('../assets/eveLogo.png')}
                  style={{
                    width: 144,
                    height: 87
                  }}

                />
              </Container>
              <Container style={{
                flex: 7,
                paddingHorizontal: 30,
                backgroundColor: '#a6003c'

              }}>
                <Form
                  style={{
                    backgroundColor: '#a6003c',
                  }}
                >
                  <Item
                    regular
                    style={{
                      backgroundColor: '#f8fbf5',
                      borderRadius: 5
                    }}>
                    <Input
                      placeholder="Name"
                      onSubmitEditing={() => { this.emailInput._root.focus() }}
                      returnKeyType={"next"}
                      onChangeText={(text) => {
                        this.setState({
                          name: text
                        })
                      }}
                    />
                  </Item>
                  <Item
                    regular
                    style={{
                      backgroundColor: '#f8fbf5',
                      borderRadius: 5,
                      marginTop: 10
                    }}>
                    <Input
                      placeholder="E-mail"
                      returnKeyType={"next"}
                      ref={c => this.emailInput = c}
                      onSubmitEditing={() => this._passwordInput._root.focus()}
                      onChangeText={(text) => {
                        this.setState({
                          email: text
                        })
                      }}
                    />
                  </Item>
                  <Item
                    regular
                    style={{
                      backgroundColor: '#f8fbf5',
                      borderRadius: 5,
                      marginTop: 10
                    }}>
                    <Input
                      secureTextEntry={true}
                      placeholder="Password"
                      ref={c => this._passwordInput = c}
                      onChangeText={(text) => {
                        this.setState({
                          password: text
                        })
                      }}
                    />
                  </Item>
                </Form>
                <Container style={{
                  paddingHorizontal: 45,
                  backgroundColor: '#a6003c'

                }}>
                  <Button
                    block
                    style={{
                      marginTop: 40,
                      borderRadius: 5,
                      backgroundColor: '#00a66a'
                    }}
                    onPress={() => { this.submitForm() }}
                  >
                    <Text>Submit</Text>
                  </Button>
                </Container>
              </Container>
            </Container>
          </Content>
          <Footer>
            <FooterTab>
              <Button
                full
                light
                onPress={() => this.props.navigation.navigate('Login')}
                style={{
                  backgroundColor: '#f8fbf5'
                }}
              >
                <Text
                  uppercase={false}>Been here before? Login</Text>
              </Button>
            </FooterTab>
          </Footer>
        </Container>
      </KeyboardAvoidingView>
    )
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth
  }
}

const mapDispatchToProps = dispatch => {
  return {
    register: newUser => dispatch(register(newUser))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Register)