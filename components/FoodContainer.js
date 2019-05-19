import React, { Component } from 'react'
import {
    Text,
    View,
    ScrollView
} from 'react-native'
import InfoCard from './InfoCard'

export default class FoodContainer extends Component {

    render() {
        let { apiData } = this.props
        return (
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
                        apiData.data.map((e, index) => {
                            let image = apiData.code === 'food' ? (e.thumb) : (`https://image.tmdb.org/t/p/w400${e.poster_path}`)
                            let title = apiData.code === 'food' ? (e.name) : (e.title)
                            let link = apiData.code ==='food' ? (e.url) : null
                            return (
                                <InfoCard
                                    key={e.id}
                                    image={image}
                                    title={title}
                                    link={link}
                                />
                            )
                        })
                    }

                </ScrollView>
            </View>
        )
    }
}
