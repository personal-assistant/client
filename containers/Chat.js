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
import { Constants, ImagePicker, Permissions, Notifications } from 'expo'
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
import axios from 'axios'

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
        clicked: '',
        image: null,
        uploading: false
    }

    async componentDidMount() {
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
        let text = result.queryResult.fulfillmentMessages[0].text.text[0]
        let code
        if (result.queryResult.fulfillmentMessages[1]) {
            code = result.queryResult.fulfillmentMessages[1].payload.code
            axios
                .post('http://10.0.2.2:3000/action', {code})
                .then(({data}) => {
                    console.log(data)
                })
                .catch(err => {
                    console.log(err)
                })
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
              allowsEditing: true,
              aspect: [4, 3],
            });
      
            this._handleImagePicked(pickerResult);
          }
    }

    openAlbum = async () => {
        console.log('open album !!')
        const {
            status: cameraRollPerm
          } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      
          // only if user allows permission to camera roll
          if (cameraRollPerm === 'granted') {
            let pickerResult = await ImagePicker.launchImageLibraryAsync({
              allowsEditing: true,
              aspect: [4, 3],
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
            uploadResponse = await uploadImageAsync(pickerResult.uri);
            uploadResult = await uploadResponse.json();
    
            this.setState({
              image: uploadResult.imagePath
            });
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
      };

      
    

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

async function uploadImageAsync(uri) {
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
      },
    };
  
    return fetch('http://10.0.2.2:3000/action', options)
}