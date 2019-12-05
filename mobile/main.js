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
import {Player} from '@react-native-community/audio-toolkit';

const HeartIcon = style => <Icon {...style} name="heart" />;
var p = new Player('http://192.168.1.134:8080/');
p.looping = true;
p.volume = 0.5;

export class Main extends React.Component {
  state = {
    selectedIndex: 0,
    host: undefined,
    port: undefined,
    playerStatus: 'not ready!',
    player: undefined,
  };

  async componentDidMount() {
    //this.setState({player: new Player('http://192.168.1.134:8081/')});
    p.prepare(() => {
      this.setState({playerStatus: 'ready!'});
    });
  }

  componentWillUnmount() {}
  onTabSelect = selectedIndex => {
    this.setState({selectedIndex});
  };

  onJoin = () => {
    p.play();
  };
  onQuit = () => {
    p.pause();
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
              Player is: {this.state.playerStatus}
            </Text>
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
