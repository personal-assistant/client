import React, { Component } from 'react';
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
                    <Label>Email</Label>
                    <Input />
                  </Item>
                  <Item floatingLabel last>
                    <Label>Password</Label>
                    <Input />
                  </Item>
                </Form>
                <Container style={{
                  paddingHorizontal: 45
                }}>
                  <Button block primary style={{
                    marginTop: 40,
                  }}>
                    <Text>Login</Text>
                  </Button>
                </Container>
              </Container>
            </Container>
          </Content>
          <Footer>
            <FooterTab>
              <Button full light onPress={() => this.props.navigation.navigate('Register')}>
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
