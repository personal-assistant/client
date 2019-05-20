import React, { Component } from 'react'
import {
    View,
    Image,
    ImageBackground,
    TouchableOpacity,
    Linking
} from 'react-native'
import {
    Card,
    CardItem,
    Text,
} from 'native-base'
import { WebBrowser } from 'expo'

export default class infoCard extends Component {

    render() {
        const { title, image, link } = this.props
        return (
            <TouchableOpacity onPress={() => WebBrowser.openBrowserAsync(link)}>
                <Card style={{
                    width: 200,
                    height: 200,
                    marginRight: 5,
                    marginLeft: 5
                }}>
                    <CardItem cardBody>
                        <ImageBackground
                            source={{ uri: image }}
                            style={{
                                height: 200,
                                width: null,
                                flex: 1
                            }}
                        >
                            <View style={{
                                position: 'absolute',
                                bottom: 0,
                                width: "100%",
                                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                            }}>
                                <Text
                                    style={{
                                        color: 'white',
                                        paddingVertical: 5,
                                        paddingHorizontal: 10
                                    }}
                                    numberOfLines={2}
                                >{title}</Text>
                            </View>
                        </ImageBackground>
                    </CardItem>
                </Card>
            </TouchableOpacity>
        )
    }
}