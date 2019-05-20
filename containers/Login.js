import React, { Component } from 'react';
import { Constants } from 'expo'
import { Permissions, Notifications } from 'expo';
import axios from '../serverAPI/backendServer'
import {
  Image,
  KeyboardAvoidingView
} from "react-native";
import {
  Container,
  Content,
  Footer,
  FooterTab,
  Button,
  Text,
  Label,
  Form,
  Input,
  Item,
} from 'native-base';
import { login } from '../store/actions/authActions'
import { connect } from 'react-redux'

class Login extends Component {
  state = {
    email: 'admin@admin.com',
    password: 'admin',
    token: '',
    clicked: false
  }

  componentDidMount() {
    this.getToken()
    this.submitForm()
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
      const { email, password, token } = this.state

      await this.props.login({
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
                flex: 1,
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
                paddingHorizontal: 30,
                backgroundColor: '#a6003c'

              }}>
                <Form
                  style={{
                    backgroundColor: '#a6003c'

                  }}
                >
                  <Item
                    regular
                    style={{
                      backgroundColor: '#f8fbf5',
                      borderRadius: 5
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
                    <Text>Login</Text>
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
                onPress={() => this.props.navigation.navigate('Register')}
                style={{
                  backgroundColor: '#f8fbf5'
                }}
              >
                <Text
                  uppercase={false}>Are you new here? Register</Text>
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
    login: user => dispatch(login(user))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)