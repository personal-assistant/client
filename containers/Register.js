import React, { Component } from 'react';
import axios from '../serverAPI/backendServer'
import { Permissions, Notifications } from 'expo';
import { Constants } from 'expo'
import {
  StyleSheet,
  View,
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


export default class AnatomyExample extends Component {
  state = {
    name: '',
    email: '',
    password: ''
  }

  submitForm = async () => {
    console.log('masok pak ekooooooo')
    try {

      const { name, email, password } = this.state
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
      console.log('masok 2')
      await axios.post('/users/register', {
        name,
        email,
        password,
        expoNotificationToken: token
      })
      console.log('register success')
      this.props.navigation.navigate('Login')
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
        }}>
        <Container style={{ backgroundColor: "white" }}>
          <Content>
            <Container>
              <Container style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                height: 40,
              }}>
                <Thumbnail square large source={{ uri: 'https://upload.wikimedia.org/wikipedia/en/thumb/9/99/Eve_Channel_Logo.PNG/250px-Eve_Channel_Logo.PNG' }} />
              </Container>
              <Container style={{
                paddingHorizontal: 30,
              }}>
                <Form>
                  <Item floatingLabel>
                    <Label>Name</Label>
                    <Input
                      onChangeText={(text) => {
                        this.setState({
                          name: text
                        })
                      }} />
                  </Item>
                  <Item floatingLabel>
                    <Label>Email</Label>
                    <Input
                      onChangeText={(text) => {
                        this.setState({
                          email: text
                        })
                      }}
                    />
                  </Item>
                  <Item floatingLabel last>
                    <Label>Password</Label>
                    <Input
                      onChangeText={(text) => {
                        this.setState({
                          password: text
                        })
                      }}
                    />
                  </Item>
                </Form>
                <Container style={{
                  paddingHorizontal: 45
                }}>
                  <Button
                    block
                    success
                    rounded
                    style={{
                      marginTop: 40,
                    }}
                    onPress={() => { this.submitForm() }}
                  >
                    <Text>submit</Text>
                  </Button>
                </Container>
              </Container>
            </Container>
          </Content>
          <Footer>
            <FooterTab>
              <Button full light onPress={() => this.props.navigation.navigate('Login')}>
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
