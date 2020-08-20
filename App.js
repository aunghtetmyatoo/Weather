import React from 'react';
import SearchInput from './components/SearchInput';
import getImageForWeather from './utils/getImageForWeather';
import getIconForWeather from './utils/getIconForWeather';
import { getLocationId, getWeather } from './utils/api';
import { 
  StyleSheet, 
  Text, Platform, 
  ImageBackground, 
  View, 
  KeyboardAvoidingView ,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
// import moment from 'moment';



export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      loading: false,
      error: false,
      location: '',
      temperature: 0,
      weather: '',
      // created: '2000-01-01T00:00:00.000000Z'
    }
  }
  

  handleDate = date => moment(date).format("hh:mm:ss");

  handleUpdateLocation = async city => {
    if(!city) return;

    this.setState({loading: true}, async () => {
      try {
        const localId = await getLocationId(city);
        const { location, weather, temperature } = await getWeather(localId);
        this.setState({
          loading: false,
          error: false,
          location,
          weather,
          temperature,
          // created,
        })
      } catch (e) {
        this.setState({
          loading: false,
          error: true,
        })
      }
    });
  };
  render(){
    const { location, loading, error, weather, temperature } = this.state;
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <StatusBar barStyle="light-content" />
        <ImageBackground
          source={getImageForWeather(weather)}
          style={styles.imgaeContainer}
          imageStyle={styles.image}
        >
          <View style={styles.detailContainer}>
            <ActivityIndicator animating={loading} color="white" size="large" />
            {!loading && (
              <View>
                {error && (
                  <Text style={[styles.smallText, styles.textStyle]}>
                    😞 Could not load weather, please try a different city.
                  </Text>
                )}
                {!error && (
                  <View>
                    <Text style={[styles.largeText, styles.textStyle]}>{getIconForWeather(weather)} {location}</Text>
                    <Text style={[styles.smallText, styles.textStyle]}>{weather}</Text>
                    <Text style={[styles.largeText, styles.textStyle]}>{`${Math.round(temperature)}`}</Text>
                  </View>
                )}
                <SearchInput 
                  placeholder="Search by city" 
                  onSubmit={this.handleUpdateLocation}
                />
                
              </View>
            )}
          </View>
        </ImageBackground>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#34495E',
  },
  imgaeContainer: {
    flex: 1,
  },
  image: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'cover',
  },
  detailContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },  
  textStyle: {
    color: 'white',
    textAlign: 'center',
    ...Platform.select({
      ios: {
        fontFamily: 'AvenirNext-Regular',
      },
      android: {
        fontFamily: 'Roboto',
      }
    })
  },
  largeText: {
    fontSize: 44,
  },
  smallText: {
    fontSize: 18,
  },
});
