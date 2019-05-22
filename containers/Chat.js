import React from "react"
import { GiftedChat, Bubble } from "react-native-gifted-chat"
import {
    StyleSheet,
    View,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    StatusBar,
    TouchableOpacity,
    DatePickerAndroid,
    TimePickerAndroid
} from "react-native"
import { Constants, ImagePicker, Permissions, Notifications, Speech } from 'expo'
import { MaterialIcons } from '@expo/vector-icons';
import { Dialogflow_V2 } from 'react-native-dialogflow'
import { dialogflowConfig } from '../env'
import {
    Header,
    ActionSheet,
    Root,
    Text,
} from 'native-base'
import axios from 'axios'
import { Platform, AsyncStorage } from 'react-native'
import { connect } from 'react-redux'
import {logout} from '../store/actions/authActions'
import FoodContainer from '../components/FoodContainer'
import firebase from '../serverAPI/firebaseConfig'
import * as Progress from 'react-native-progress'
import HSLtoHex from '../helpers/HSLtoHex'
console.disableYellowBox = true
// const baseUrl = Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000'
const baseUrl = 'http://35.247.157.227'
import {
    eveAngry,
    eveBlushing,
    eveConfused,
    eveDisgusted,
    eveHappy,
    eveNeutral,
    eveSad,
    eveSmile,
    eveLaughing
} from '../assets/emotions'
import profilePicture from '../assets/profile_picture.jpg'

const BOT_USER = {
    _id: 2,
    name: 'Eve',
    avatar: profilePicture
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
        pitch: 1.3,
        rate: 1,
        reminderReady: false
    }

    _speak = (text) => {
        Speech.speak(text, {
            language: 'id',
            pitch: this.state.pitch,
            rate: this.state.rate,
        });
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.avatarImage !== prevState.avatarImage || this.state.relationshipPoint !== prevState.relationshipPoint || this.state.emotion !== prevState.emotion) {
            // console.log("harus render avatar")
            this.renderAvatar()
        }
    }

    renderAvatar = () => {
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
                break;
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
            case 'laughing':
                this.setState({
                    avatarImage: eveLaughing
                })
                break;
            default:
                break;
        }
    }

    componentWillMount() {
        Dialogflow_V2.setConfiguration(
            dialogflowConfig.client_email,
            dialogflowConfig.private_key,
            "id",
            dialogflowConfig.project_id
        )
    }


    componentDidMount = async () => {
        if (Platform.OS === 'android') {
            Expo.Notifications.createChannelAndroidAsync('reminders', {
                name: 'Reminders',
                priority: 'high',
                vibrate: true,
                sound: true
            });
        }

        let result = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        if (result.status === 'granted') {
            console.log('Notification permissions granted.')
        }
        let point = (this.props.auth.loggedInUser.user.relationshipPoint / 100).toFixed(2)
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
                if (chatHistory.length === 0) {
                    let message = 'first_interaction'
                    Dialogflow_V2.requestQuery(
                        message,
                        result => this.handleGoogleResponse(result),
                        error => console.log(error)
                    )
                    this.setState({
                        chatLoaded: true,
                        relationshipPoint: point
                    })
                } else {
                    this.setState({
                        messages: chatHistory,
                        chatLoaded: true,
                        relationshipPoint: point
                    })
                }
            })
            .catch(err => {
                console.log(err)
            })
    }

    handleGoogleResponse = (result) => {
        let { relationshipPoint, color } = this.state
        let text = result.queryResult.fulfillmentMessages[0].text.text[0]
        let code
        let point

        if (result.queryResult.fulfillmentMessages[1]) {
            code = result.queryResult.fulfillmentMessages[1].payload.code
            point = result.queryResult.fulfillmentMessages[1].payload.point
            emotion = result.queryResult.fulfillmentMessages[1].payload.emotion
            console.log(emotion, "<== emotiion")
            this.setState({
                emotion
            })
            if (code === 'reminder') {
                this.setState({
                    reminderReady: true
                })
            } else if(code === 'logout'){
                AsyncStorage.removeItem('token')
                .then(()=>{
                    this.props.logout()
                    this.props.navigation.navigate("Auth")

                })
                .catch(err=>{
                    console.log(err.message)
                    console.log("masuk error remove item AsyncStorae");
                    
                })
                
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
                        let point = (data.relationshipPoint / 100).toFixed(2)
                        this.setState({
                            relationshipPoint: point,
                            color: {
                                ...color,
                                h: Math.round(data.relationshipPoint * 1.35)
                            },
                        }, () => {
                            // this.renderAvatar()
                            if (data.code === 'food' || data.code === 'movie') {
                                this.setState({
                                    apiData: data
                                }, () => {
                                    this.containerOpen()
                                })
                            }
                        })
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
        }
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
        // this._speak(text)
        firebase
            .firestore()
            .collection('users')
            .doc(this.props.auth.loggedInUser.user._id)
            .collection('messages')
            .add(msg)
    }

    onSend = (messages = [], sendImage) => {
        if (sendImage) {
            messages[0].image = sendImage
        }

        if (this.state.reminderReady) {
            this.handleDatePicker(messages[0].text)
        }

        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages)
        }))

        let message = messages[0].text

        if (!this.state.reminderReady) {
            Dialogflow_V2.requestQuery(
                message,
                result => this.handleGoogleResponse(result),
                error => console.log(error)
            )
        } else {
            this.sendBotResponse('iya nanti aku ingetin')
            this.setState({
                reminderReady: false
            })
        }

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
        if (apiData.data) {
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
        const {
            status: cameraPerm
        } = await Permissions.askAsync(Permissions.CAMERA);

        const {
            status: cameraRollPerm
        } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

        if (cameraPerm === 'granted' && cameraRollPerm === 'granted') {
            let pickerResult = await ImagePicker.launchCameraAsync({
                quality: 0.3
            });

            this._handleImagePicked(pickerResult);
        }
    }

    openAlbum = async () => {
        const {
            status: cameraRollPerm
        } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

        if (cameraRollPerm === 'granted') {
            let pickerResult = await ImagePicker.launchImageLibraryAsync({
                quality: 0.3
            });

            this._handleImagePicked(pickerResult);
        }
    }

    _handleImagePicked = async pickerResult => {

        let uploadResponse, uploadResult;
        try {
            this.setState({
                uploading: true
            });

            if (!pickerResult.cancelled) {
                uploadResponse = await uploadImageAsync(pickerResult.uri, this.props.auth.loggedInUser.token)
                uploadResult = await uploadResponse.json();
                this.setState({
                    image: uploadResult.imageUrl
                }, () => {
                    let payloadChat = ''
                    if (uploadResult.data.includes('Flower')) {
                        payloadChat = 'Flower'
                    } else if (uploadResult.data.includes('Nature')) {
                        payloadChat = 'Nature'
                    }

                    this.onSend([{
                        "_id": Math.random(),
                        "createdAt": new Date(),
                        "text": payloadChat,
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

    async handleDatePicker(message) {
        try {
            let { action, year, month, day } = await DatePickerAndroid.open({
                date: new Date(),
                minDate: new Date()
            });

            if (action !== DatePickerAndroid.dismissedAction) {
                let { action, hour, minute } = await TimePickerAndroid.open({
                    hour: 14,
                    minute: 0,
                    is24Hour: true
                });
                if (action !== TimePickerAndroid.dismissedAction) {
                    this.scheduleNotification(new Date(year, month, day, hour, minute), message)
                } else {
                    this.sendBotResponse('ngga jadi ya, yaudah deh')
                }
            } else {
                this.sendBotResponse('ngga jadi ya, yaudah deh')
            }
        } catch ({ code, message }) {
            console.warn('Cannot open date picker', message);
        }
    }

    scheduleNotification = async (userInput, msg) => {
        const alarm = new Date(userInput).getTime()
        const timeNow = new Date().getTime()

        const timer = alarm - timeNow
        let notificationId = await Notifications.scheduleLocalNotificationAsync(
            {
                title: "Reminder",
                body: msg,
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
            this.sendBotResponse('Kamu punya reminder: ' + msg)
        }, timer);
    };

    getColor = () => {
        return this.HSLToHex()
    }



    render() {
        const { showContainer, apiData, relationshipPoint, color, chatLoaded, avatarImage, emotion } = this.state

        if (!chatLoaded) {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Image
                        source={require('../assets/loading.gif')}
                        style={{
                            width: 144,
                            height: 95
                        }}
                    />
                    <Text style={{ marginTop: 10, fontSize: 30 }}>Loading...</Text>
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
                                    flex: 3,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: -45
                                }}>
                                    {
                                        emotion === "angry" ? (
                                            <Text style={styles.emotionHeader}>Mad</Text>
                                        ) : emotion === "blushing" ? (
                                            <Text style={styles.emotionHeader}>Blushing</Text>
                                        ) : emotion === "confused" ? (
                                            <Text style={styles.emotionHeader}>Confused</Text>
                                        ) : emotion === "disgusted" ? (
                                            <Text style={styles.emotionHeader}>Disgusted</Text>
                                        ) : emotion === "happy" ? (
                                            <Text style={styles.emotionHeader}>Happy</Text>
                                        ) : emotion === "laughing" ? (
                                            <Text style={styles.emotionHeader}>Laughing</Text>
                                        ) : emotion === "neutral" ? (
                                            <Text style={styles.emotionHeader}>Neutral</Text>
                                        ) : emotion === "sad" ? (
                                            <Text style={styles.emotionHeader}>Sad</Text>
                                        ) : emotion === "smile" ? (
                                            <Text style={styles.emotionHeader}>Smiling</Text>
                                        ) : null
                                    }
                                </View>

                                <View style={{
                                    flex: 3,
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
                        showUserAvatar={true}
                        renderActions={this.renderActions}
                        onSend={messages => this.onSend(messages)}
                        user={{
                            _id: 1
                        }}
                    />
                    {
                        showContainer ? (
                            <FoodContainer
                                apiData={apiData}
                                navigation={this.props.navigation}
                            />
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

const mapDispatchToProps = dispatch => {
    return {
      logout: () => dispatch(logout())
    }
  }

export default connect(mapStateToProps, mapDispatchToProps)(Chat)

const styles = StyleSheet.create({
    emotionHeader: {
        fontSize: 23
    }
});
