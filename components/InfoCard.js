import React, { Component } from 'react'
import { View, Image, ImageBackground } from 'react-native'
import {
    Card,
    CardItem,
    Text,
} from 'native-base'

export default class infoCard extends Component {
    render() {
        return (
            <Card style={{
                width: 200,
                height: 200,
                marginRight: 5,
                marginLeft: 5
            }}>
                <CardItem cardBody>
                    <ImageBackground
                        source={{ uri: 'https://b.zmtcdn.com/data/reviews_photos/70a/103a0989248ab261fcf04eb62ba1e70a_1516342740.jpg?fit=around%7C200%3A200&crop=200%3A200%3B*%2C*%22' }}
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
                            >Sop kucing dengan Baigon</Text>
                        </View>
                    </ImageBackground>
                </CardItem>
            </Card>
        )
    }
}
