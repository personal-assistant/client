import React from "react"
import { GiftedChat, Bubble } from "react-native-gifted-chat"
import {
    StyleSheet,
    View,
    Alert,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    ScrollView,
    TouchableOpacity
} from "react-native"
import { Constants } from 'expo'
import { Dialogflow_V2 } from 'react-native-dialogflow'
import { dialogflowConfig } from '../env'
import InfoCard from '../components/InfoCard'
import {
    Container,
    Header,
    Title,
    Content,
    Footer,
    FooterTab,
    Button,
    ActionSheet,
    Root,
    Left,
    Right,
    Body,
    Icon,
    Text,
    Card,
    CardItem,
    Label,
    Form,
    Input,
    Item,
    Thumbnail
} from 'native-base'

const BOT_USER = {
    _id: 2,
    name: 'Eve',
}

const BUTTONS = ["Camera", "Album", "Cancel"];
const DESTRUCTIVE_INDEX = 3;
const CANCEL_INDEX = 4;

export default class Chat extends React.Component {
    state = {
        messages: [
            {
                _id: 1,
                text: `halo! ada yang bisa kubantu?`,
                createdAt: new Date(),
                user: BOT_USER
            }
        ],
        showContainer: false,
        datas: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        clicked: ''
    }

    async componentDidMount() {
        Dialogflow_V2.setConfiguration(
            dialogflowConfig.client_email,
            dialogflowConfig.private_key,
            "id",
            dialogflowConfig.project_id
        )
    }

    handleGoogleResponse(result) {
        let text = result.queryResult.fulfillmentMessages[0].text.text[0]
        this.sendBotResponse(text)
    }

    sendBotResponse(text) {
        let msg = {
            _id: this.state.messages.length + 1,
            text,
            createdAt: new Date(),
            user: BOT_USER
        }

        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, [msg])
        }))
    }

    onSend(messages = []) {
        if (messages[0].text.includes('makan')) {
            this.containerHandler()
        }

        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages)
        }))

        let message = messages[0].text
        Dialogflow_V2.requestQuery(
            message,
            result => this.handleGoogleResponse(result),
            error => console.log(error)
        )
    }

    renderBubble = (props) => {
        return (
            <Bubble
                {...props}
                textStyle={{
                    right: {
                        color: 'white'
                    }
                }}
                wrapperStyle={{
                    right: {
                        backgroundColor: '#d6004f'
                    }
                }}
            />
        )
    }

    containerHandler = () => {
        Keyboard.dismiss()
        this.setState({ showContainer: !this.state.showContainer })
    }

    containerClose = () => {
        this.setState({ showContainer: false })
    }

    renderActions = () => {
        return (
            <View style={{
                marginBottom: 8,
                marginLeft: 10
            }}>
                <TouchableOpacity onPress={() =>
                    ActionSheet.show(
                        {
                            options: BUTTONS,
                            cancelButtonIndex: CANCEL_INDEX,
                            destructiveButtonIndex: DESTRUCTIVE_INDEX,
                        },
                        buttonIndex => {
                            if(buttonIndex === 0) {
                                this.openCamera()
                            } else if(buttonIndex === 1) {
                                this.openAlbum()
                            }
                        }
                    )
                }
                >
                    <Text style={{
                        fontSize: 24,
                        color: '#439dfd'
                    }}>+</Text>
                </TouchableOpacity>
            </View>
        )
    }

    openCamera = () => {
        console.log('open camera !!')
    }

    openAlbum = () => {
        console.log('open album !!')
    }

    render() {
        const { showContainer, datas } = this.state
        return (
            <Root>
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
                        isAnimated={true}
                        textInputProps={{
                            onFocus: this.containerClose,
                            autoFocus: true
                        }}
                        renderBubble={this.renderBubble}
                        renderActions={this.renderActions}
                        onSend={messages => this.onSend(messages)}
                        user={{
                            _id: 1
                        }}
                    />
                    {
                        showContainer ? (
                            <View style={{
                                height: 250,
                            }}>
                                <ScrollView
                                    contentContainerStyle={{
                                        alignItems: 'center',
                                    }}
                                    horizontal={true}
                                >
                                    {
                                        datas.map((e, index) => {
                                            return <InfoCard key={index} />
                                        })
                                    }

                                </ScrollView>
                            </View>
                        ) : null
                    }
                </KeyboardAvoidingView>
            </Root>
        )
    }
}