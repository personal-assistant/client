import React from "react"
import { GiftedChat, Bubble } from "react-native-gifted-chat"
import {
    StyleSheet,
    View,
    Alert,
    Image,
    Keyboard,
    SafeAreaView,
    KeyboardAvoidingView,
    StatusBar,
    ScrollView,
    TouchableOpacity,
    DatePickerAndroid,
    TimePickerAndroid
} from "react-native"
import { Constants, ImagePicker, Permissions, Notifications, Speech } from 'expo'
import { MaterialIcons } from '@expo/vector-icons';
import { Dialogflow_V2 } from 'react-native-dialogflow'
import { dialogflowConfig } from '../env'
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
import axios from 'axios'
import { Platform } from 'react-native'
import { connect } from 'react-redux'
import FoodContainer from '../components/FoodContainer'
import firebase from '../serverAPI/firebaseConfig'
import * as Progress from 'react-native-progress'
import HSLtoHex from '../helpers/HSLtoHex'
console.disableYellowBox = true
// const baseUrl = Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000'
const baseUrl = 'http://35.247.157.227'
import test from '../assets/test.gif'
import testgif from '../assets/loading.gif'
import {
  eveAngry,
  eveBlushing,
  eveConfused,
  eveDisgusted,
  eveHappy,
  eveNeutral,
  eveSad,
  eveSmile
} from '../assets/emotions'

const BOT_USER = {
    _id: 2,
    name: 'Eve',
}

const BUTTONS = ["Camera", "Album", "Cancel"];
const DESTRUCTIVE_INDEX = 3;
const CANCEL_INDEX = 4;

class Chat extends React.Component {
    state = {
        messages: [],
        showContainer: false,
        apiData: {},
        clicked: '',
        image: null,
        uploading: false,
        relationshipPoint: 0,
        color: {
            h: Math.round(this.props.auth.loggedInUser.user.relationshipPoint * 1.35),
            s: 100,
            l: 39
        },
        chatLoaded: false,
        emotion: 'neutral', //happy, smile, neutral, sad, angry, disgusted, confused, blushing,
        avatarImage: eveNeutral,
        pitch: 1.5,
        rate: 1
    }

    _speak = (text) => {
        Speech.speak(text, {
            language: 'id',
            pitch: this.state.pitch,
            rate: this.state.rate,
        });
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.avatarImage !== prevState.avatarImage) {
          console.log("harus render avatar")
          this.renderAvatar()
        }
    }

    renderAvatar = () => {
      console.log("harusnya rendererr")
        switch (this.state.emotion) {
            case 'angry':
                this.setState({
                    avatarImage: eveAngry
                })
                break;
            case 'blushing':
                this.setState({
                    avatarImage: eveBlushing
                })
                break;
            case 'confused':
                this.setState({
                    avatarImage: eveConfused
                })
                break;
            case 'disgusted':
                this.setState({
                    avatarImage: eveDisgusted
                })
                break;
            case 'happy':
                this.setState({
                    avatarImage: eveHappy
                })
                break;
            case 'neutral':
                this.setState({
                    avatarImage: eveNeutral
                })
            case 'sad':
                this.setState({
                    avatarImage: eveSad
                })
                break;
            case 'smile':
                this.setState({
                    avatarImage: eveSmile
                })
                break;
            break;
            default:
                break;
        }
    }

    componentDidMount = async () => {
        console.log('componet did mount!', new Date())
        let chatHistory = []

        firebase
            .firestore()
            .collection('users')
            .doc(this.props.auth.loggedInUser.user._id)
            .collection('messages')
            .orderBy('createdAt', 'desc')
            .get()
            .then(snapshots => {
                snapshots.forEach(doc => {
                    let newDoc = { ...doc.data(), createdAt: doc.data().createdAt.toDate() }
                    chatHistory.push(newDoc)
                })
                this.setState({
                    messages: chatHistory,
                    chatLoaded: true
                })
            })
            .catch(err => {
                console.log(err)
            })

        let point = (this.props.auth.loggedInUser.user.relationshipPoint / 100).toFixed(2)
        this.setState({
            relationshipPoint: point
        })
        console.log('=====relationshipppppp=====', this.props.auth.loggedInUser.user.relationshipPoint)

        if (Platform.OS === 'android') {
            Expo.Notifications.createChannelAndroidAsync('reminders', {
                name: 'Reminders',
                priority: 'high',
                vibrate: true,
                sound: true
            });
        }

        Dialogflow_V2.setConfiguration(
            dialogflowConfig.client_email,
            dialogflowConfig.private_key,
            "id",
            dialogflowConfig.project_id
        )

        let result = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        if (result.status === 'granted') {
            console.log('Notification permissions granted.')
        }
    }

    handleGoogleResponse(result) {
        let { relationshipPoint, color } = this.state
        let text = result.queryResult.fulfillmentMessages[0].text.text[0]
        let code
        let point

        if (result.queryResult.fulfillmentMessages[1]) {
            code = result.queryResult.fulfillmentMessages[1].payload.code
            point = result.queryResult.fulfillmentMessages[1].payload.point
            emotion = result.queryResult.fulfillmentMessages[1].payload.emotion

            if (code === 'reminder') {
                this.handleDatePicker()
            } else {
                axios
                    .post(baseUrl + '/action', {
                        code,
                        relationshipPoint: point
                    }, {
                            headers: {
                                authorization: this.props.auth.loggedInUser.token
                            }
                        })
                    .then(({ data }) => {
                        console.log('==ini data===', data)
                        if (data.code === 'food' || data.code === 'movie') {
                            this.setState({
                                apiData: data
                            }, () => {
                                this.containerOpen()
                            })
                        }
                        let point = (data.relationshipPoint / 100).toFixed(2)
                        this.setState({
                            relationshipPoint: point,
                            color: {
                                ...color,
                                h: Math.round(data.relationshipPoint * 1.35)
                            },
                            emotion
                        }, () => {
                          this.renderAvatar()
                          this.sendBotResponse(text)
                        })
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
        }
        // this.sendBotResponse(text)
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
        this._speak(text)
        firebase
            .firestore()
            .collection('users')
            .doc(this.props.auth.loggedInUser.user._id)
            .collection('messages')
            .add(msg)
    }

    onSend(messages = [], sendImage) {
        if (sendImage) {
            messages[0].image = sendImage
        }

        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages)
        }))
        console.log('==ini message====', messages)

        let message = messages[0].text
        Dialogflow_V2.requestQuery(
            message,
            result => this.handleGoogleResponse(result),
            error => console.log(error)
        )

        firebase
            .firestore()
            .collection('users')
            .doc(this.props.auth.loggedInUser.user._id)
            .collection('messages')
            .add(messages[0])

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

    containerOpen = () => {
        let { apiData } = this.state
        console.log('ni api data nyaaaa', apiData)
        if (apiData.data) {
            console.log('opening container...')
            Keyboard.dismiss()
            this.setState({ showContainer: !this.state.showContainer })
        }
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
                            if (buttonIndex === 0) {
                                this.openCamera()
                            } else if (buttonIndex === 1) {
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

    openCamera = async () => {
        console.log('open camera !!')
        const {
            status: cameraPerm
        } = await Permissions.askAsync(Permissions.CAMERA);

        const {
            status: cameraRollPerm
        } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

        // only if user allows permission to camera AND camera roll
        if (cameraPerm === 'granted' && cameraRollPerm === 'granted') {
            let pickerResult = await ImagePicker.launchCameraAsync({
                // allowsEditing: true,
                // aspect: [4, 3],
                quality: 0.3
            });

            this._handleImagePicked(pickerResult);
        }
    }

    openAlbum = async () => {
        console.log('open album !!')
        const {
            status: cameraRollPerm
        } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

        if (cameraRollPerm === 'granted') {
            let pickerResult = await ImagePicker.launchImageLibraryAsync({
                // allowsEditing: true,
                // aspect: [4, 3],
                quality: 0.3
            });

            this._handleImagePicked(pickerResult);
        }
    }

    _handleImagePicked = async pickerResult => {

        let uploadResponse, uploadResult;
        console.log('====ini auth====', this.props)
        try {
            this.setState({
                uploading: true
            });

            if (!pickerResult.cancelled) {
                console.log('==token====', this.props.auth.loggedInUser.token)
                uploadResponse = await uploadImageAsync(pickerResult.uri, this.props.auth.loggedInUser.token)
                uploadResult = await uploadResponse.json();
                console.log('===upload result====', uploadResult)
                this.setState({
                    image: uploadResult.imageUrl
                }, () => {
                    this.onSend([{
                        "_id": Math.random(),
                        "createdAt": new Date(),
                        "user": {
                          "_id": 1,
                        }
                    }], uploadResult.imageUrl)
                })
            }
        } catch (e) {
            console.log({ uploadResponse });
            console.log({ uploadResult });
            console.log({ e });
            alert('Upload failed, sorry :(');
        } finally {
            this.setState({
                uploading: false
            });
        }
    }

    async handleDatePicker() {
        try {
        let {action, year, month, day} = await DatePickerAndroid.open({
            date: new Date(),
            minDate: new Date()
        });

        if (action !== DatePickerAndroid.dismissedAction) {
            let {action, hour, minute} = await TimePickerAndroid.open({
                hour: 14,
                minute: 0,
                is24Hour: true
            });
            if (action !== TimePickerAndroid.dismissedAction) {
                this.scheduleNotification(new Date(year, month, day, hour, minute))
            } else {
                this.sendBotResponse('ngga jadi ya, yaudah deh')
            }
        } else {
            this.sendBotResponse('ngga jadi ya, yaudah deh')
        }
        } catch ({code, message}) {
        console.warn('Cannot open date picker', message);
        }
    }

    scheduleNotification = async (userInput) => {
        const alarm = new Date(userInput).getTime()
        const timeNow = new Date().getTime()

        const timer = alarm - timeNow
        let notificationId = await Notifications.scheduleLocalNotificationAsync(
          {
            title: "Reminder",
            body: "Wow, I can show up even when app is closed",
            android: {
                channelId: 'reminders',
                color: '#FF0000'
            }
          },
          {
            // repeat: "minute",
            time: new Date().getTime() + timer
          }
        );
        setTimeout(() => {
            this.sendBotResponse('Kamu punya reminder!')
        }, timer);
        console.log(notificationId);
    };

    getColor = () => {
        return this.HSLToHex()
    }



    render() {
        const { showContainer, apiData, relationshipPoint, color, chatLoaded, avatarImage } = this.state

        if (!chatLoaded) {
            return (
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Image
                  source={require('../assets/loading.gif')}
                  style={{
                    width: 144,
                    height: 95
                  }}
                />
                <Text style={{marginTop: 10, fontSize: 30}}>Loading...</Text>
                </View>
            )
        }

        return (
            <Root>
                <KeyboardAvoidingView
                    behavior="padding"
                    enabled
                    resetScrollToCoords={{ x: 0, y: 0 }}
                    scrollEnabled={false}
                    style={{
                        flex: 1,
                    }}>
                    <Header
                        style={{
                            height: 100,
                            marginTop: StatusBar.currentHeight,
                            backgroundColor: 'white'
                        }}
                    >
                        <View style={{
                            flex: 1,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <View style={{
                                flex: 3,
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: 'white'
                            }}>

                                <Image
                                    source={avatarImage}
                                    style={{
                                        width: 100,
                                        height: 100
                                    }}
                                />

                            </View>
                            <View style={{
                                flex: 9,
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: 'white'
                            }}>
                                <View style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>

                                    <MaterialIcons
                                        name="favorite"
                                        size={25}
                                        color="#f00058"
                                        style={{
                                            marginRight: 6
                                        }}
                                    />

                                    <Progress.Bar
                                        progress={Number(relationshipPoint)}
                                        animated={true}
                                        width={180}
                                        height={10}
                                        color={HSLtoHex(color.h, color.s, color.l)}
                                        unfilledColor='#d4d4d4'
                                        borderColor='white'
                                    />

                                </View>

                            </View>
                        </View>
                    </Header>
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
                            <FoodContainer apiData={apiData} />
                        ) : null
                    }
                </KeyboardAvoidingView>
            </Root>
        )
    }
}

async function uploadImageAsync(uri, token) {
    let uriParts = uri.split('.');
    let fileType = uriParts[uriParts.length - 1]

    let formData = new FormData();
    formData.append('photo', {
        uri,
        name: `photo.${fileType}`,
        type: `image/${fileType}`,
    });
    formData.append('code', 'photo')

    let options = {
        method: 'POST',
        body: formData,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
            authorization: token
        },
    };

    return fetch('http://35.247.157.227/action', options)
}


const mapStateToProps = state => {
    return {
        auth: state.auth
    }
}

export default connect(mapStateToProps, null)(Chat)