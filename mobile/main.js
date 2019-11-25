import React from 'react';
import {StyleSheet, View, SafeAreaView} from 'react-native';
import {
  Layout,
  Button,
  Text,
  Icon,
  Tab,
  TabView,
  Input,
} from 'react-native-ui-kitten';
import TrackPlayer from 'react-native-track-player';

const HeartIcon = style => <Icon {...style} name="heart" />;

export class Main extends React.Component {
  state = {
    selectedIndex: 0,
    host: undefined,
    port: undefined,
    mediaState: undefined,
  };

  async componentDidMount() {
    // Creates the player
    TrackPlayer.setupPlayer().then(async () => {
      // Adds a track to the queue
      await TrackPlayer.add({
        id: 'trackId',
        url: 'http://192.168.1.134:9999/',
        title: 'Voice Over Local Network',
        artist: 'Willy Njundong',
        album: 'Networking Project',
        artwork:
          'https://icon-library.net/images/voice-chat-icon/voice-chat-icon-2.jpg', // Load artwork from the network
      });
    });
  }

  componentWillUnmount() {}
  onTabSelect = selectedIndex => {
    this.setState({selectedIndex});
  };

  getMediaState = async () => {
    let state = await TrackPlayer.getState();
    this.setState({mediaState: state});
  };

  onJoin = () => {
    TrackPlayer.play();
  };
  onQuit = () => {
    TrackPlayer.pause();
  };
  onStartHosting = () => {};

  onChangeHost = value => {
    this.setState({host: value});
  };
  onChangePort = value => {
    this.setState({port: value});
  };
  render() {
    return (
      <Layout style={{flex: 1}}>
        <SafeAreaView>
          <Layout style={[styles.container, styles.header]} level="1">
            <Text category="h1" style={styles.text}>
              Voice Chat Over Local Network
            </Text>

            <Text appearance="hint" style={styles.text}>
              By Willy Njundong
            </Text>
            <Text category="c1" style={styles.text}>
              Current Media State: {this.state.mediaState}
            </Text>
            <Button onPress={this.getMediaState}>Update Media Status</Button>
          </Layout>
          <Layout level="3" style={styles.tabContainer}>
            <TabView
              selectedIndex={this.state.selectedIndex}
              onSelect={this.onTabSelect}>
              <Tab title="JOIN A VOICE CHAT">
                <Layout level="4" style={styles.tabContainer}>
                  <View style={styles.tabContent}>
                    <Input
                      label="HOST"
                      value={this.state.host}
                      onChangeText={this.onChangeHost}
                    />
                    <Input
                      label="PORT"
                      value={this.state.port}
                      onChangeText={this.onChangePort}
                    />
                    <Button onPress={this.onJoin}>Join</Button>
                    <Button onPress={this.onQuit}>Quit</Button>
                  </View>
                </Layout>
              </Tab>
              <Tab title="HOST A VOICE CHAT">
                <Layout level="4" style={styles.tabContainer}>
                  <View style={styles.tabContent}>
                    <Button onPress={this.onStartHosting}>Start Hosting</Button>
                  </View>
                </Layout>
              </Tab>
            </TabView>
          </Layout>
        </SafeAreaView>
      </Layout>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
  tabContainer: {
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  tabContent: {
    margin: 30,
    justifyContent: 'space-evenly',
  },
  header: {
    marginBottom: 50,
  },
  text: {
    textAlign: 'center',
  },
  likeButton: {
    marginVertical: 16,
  },
});
