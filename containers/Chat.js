import React from "react";
import { GiftedChat } from "react-native-gifted-chat";
import {
    StyleSheet,
    View,
    Alert,
    KeyboardAvoidingView
} from "react-native";
import { Constants } from 'expo'


export default class Chat extends React.Component {
    state = {
        messages: []
    };

    componentWillMount() {
        this.setState({
            messages: [
                {
                    _id: 1,
                    text: "Hello developer",
                    createdAt: new Date(),
                    user: {
                        _id: 2,
                        name: "React Native",
                    }
                }
            ]
        });
    }

    onSend(messages = []) {
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages)
        }));
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
                <GiftedChat
                    messages={this.state.messages}
                    onSend={messages => this.onSend(messages)}
                    user={{
                        _id: 1
                    }}
                />

            </KeyboardAvoidingView>
        );
    }
}