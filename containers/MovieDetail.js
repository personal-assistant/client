import React from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Image,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { Container, Content, Header, Body, Title, Text, H3 } from 'native-base'
import axios from 'axios'
import { Ionicons, FontAwesome } from '@expo/vector-icons'
import { Font } from "expo"

export default class App extends React.Component {

  state = {
    data: null,
    isLoading: true,
    error: ""
  }

  componentDidMount() {

    let movieId = this.props.navigation.getParam('movieId', "")

    const FontJob = Font.loadAsync({
      'Roboto': require('native-base/Fonts/Roboto.ttf'),
      'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
      ...Ionicons.font,
    })

    // onPress={() => this.handlePress(type, link)}

    const MovieDetail = axios.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=89935f82b605a99e3e42642ab9aca081`)

    Promise.all([FontJob, MovieDetail])
      .then(([res1, { data }]) => {

        this.setState({
          isLoading: false,
          data: data,
          error: ""
        })
      }).catch(err => {
        this.setState(
          {
            isLoading: false,
            error: "Something Error"
          }
        )
      })
  }

  render() {
    const { isLoading, error, data } = this.state
    if (isLoading) {
      return <ActivityIndicator style={styles.container} color="#a6003d" size={50}></ActivityIndicator>
    } else if (error !== "") {
      return <Text style={styles.container}>{error}</Text>
    } else {
      let vote_average = data.vote_average;
      return (
        <Container
          style={{
            marginTop: StatusBar.currentHeight
          }}
        >
          <Header style={{ backgroundColor: '#a6003c' }}>
            <Body>
              <Title>{data.title}</Title>
            </Body>
          </Header>
          <Content>
            <Image style={styles.backdrop} source={{ uri: "http://image.tmdb.org/t/p/w500" + data.backdrop_path }}></Image>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                marginHorizontal: 10,
                marginTop: 10
              }}
            >
              <Image style={styles.poster} source={{ uri: "http://image.tmdb.org/t/p/w300" + data.poster_path }}>
              </Image>
              <View style={styles.info}>
                <H3>{data.title}</H3>
                <Text>{'(' + data.release_date.split("-")[0] + ')'}</Text>
                <View style={{ flexDirection: 'row' }}>
                  {
                    getStar(vote_average)
                  }
                </View>
                <Text>{getGenre(data.genres)}</Text>
              </View>
            </View>
            <View style={{ marginHorizontal: 10 }}>
              <Text style={styles.caption}>Overview: </Text>
              <Text style={{ marginLeft: 25 }}>{data.overview}</Text>
            </View>
          </Content>
        </Container>
      );
    }


  }
}

function getStar(num) {

  let array = []
  for (let i = 0; i < 5; i++) {
    if (num >= 2) {
      array.push(<FontAwesome key={i} style={{ marginRight: 5 }} name="star" size={20} color="#a6003c"></FontAwesome>)
    } else if (num > 0) {
      array.push(<FontAwesome key={i} style={{ marginRight: 5 }} name="star-half-full" size={20} color="#a6003c"></FontAwesome>)
    } else {
      array.push(<FontAwesome key={i} style={{ marginRight: 5 }} name="star-o" size={20} color="#a6003c"></FontAwesome>)
    }
    num = num - 2
  }
  return array
}

function getGenre(array) {
  let genres = []
  array.forEach(element => {
    genres.push(element.name)
  });
  return genres.join(", ")
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backdrop: {
    width: '100%',
    height: undefined,
    aspectRatio: 300 / 169,
  },
  poster: {
    flex: 4,
    height: undefined,
    aspectRatio: 185 / 278,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  info: {
    flex: 8,
    marginLeft: 20,
  },
  caption: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 10,
    marginBottom: 5
  }
});