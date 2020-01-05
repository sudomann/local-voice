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
import {Audio} from 'expo-av';
import * as FileSystem from 'expo-file-system';
import * as Permissions from 'expo-permissions';
import AudioRecord from 'react-native-audio-record';
import {Buffer} from 'buffer';
var dgram = require('react-native-udp');
const soundObject = new Audio.Sound();

const outputFileUri = '/storage/emulated/0/Download/' + 'localVoiceAudio';
const options = {
  sampleRate: 44100, // default 44100
  channels: 1, // 1 or 2, default 1
  bitsPerSample: 16, // 8 or 16, default 16
  //audioSource: 6, // android only (it seems this blocks ios)
  wavFile: 'test.wav', // default 'audio.wav'
};

const socketOptions = {
  type: 'udp4',
  //reuseAddr: true,
};
var server = dgram.createSocket(socketOptions);
var client = dgram.createSocket(socketOptions);
server.bind(12345);
client.bind(12346);

export class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: 0,
      serverStatus: 'Disconnected',
      readyToHost: true,
      host: undefined,
      port: undefined,
      deviceIpAddress: 'To be determined...',
      socketPort: 'To be determined...',
      recCount: 0,
      msgCount: 0,
    };

    server.on('listening', () => {
      const address = server.address();
      console.log(`server listening ${address.address}:${address.port}`);
    });

    client.on('listening', () => {
      const address = client.address();
      console.log(`client listening ${address.address}:${address.port}`);
      client.connect;
    });
  }

  async componentDidMount() {
    // const {status} = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
    server.on('message', async (msg, remote) => {
      const decodedMsg = Buffer.from(msg).toString('base64');
      this.setState({msgCount: this.state.msgCount + 1});
      if (this.state.msgCount <= 1) {
        console.log(
          remote.address + ':' + remote.port + "'s plain message:" + msg,
        );
        console.log('decoded message:', decodedMsg);
      }

      try {
        const {sound: soundObject, status} = await Audio.Sound.createAsync(
          {uri: `data:audio/wav;base64,${decodedMsg}`},
          {shouldPlay: true},
        );
        // Your sound is playing!
      } catch (error) {
        console.log('ERROR when trying to play audio', error);
      }
    });
    AudioRecord.init(options);
  }

  componentWillUnmount() {}
  onTabSelect = selectedIndex => {
    this.setState({selectedIndex});
    AudioRecord.stop();
  };

  onJoin = () => {};
  onQuit = () => {};
  onStartHosting = async () => {
    this.setState({
      serverStatus: 'Initiallizing server...',
      readyToHost: false,
    });
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      });
    } catch (error) {
      console.log(error); // eslint-disable-line
    }
    AudioRecord.start();

    AudioRecord.on('data', async data => {
      this.setState({recCount: this.state.recCount + 1});
      if (this.state.recCount <= 1) {
        const chunk = Buffer.from(data, 'base64');
        client.send(chunk, 0, chunk.length, 12345, '0.0.0.0');
        console.log('client just sent chunk:', chunk);
        console.log('client just sent data:', {data});
      }
    });
  };

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
          </Layout>
          <Text>Writing to {outputFileUri}</Text>
          <Layout level="3" style={styles.tabContainer}>
            <TabView
              selectedIndex={this.state.selectedIndex}
              onSelect={this.onTabSelect}>
              <Tab title="HOST A VOICE CHAT">
                <Layout level="4" style={styles.tabContainer}>
                  <View style={styles.tabContent}>
                    <Text>IP Address:</Text>
                    <Text>{this.state.deviceIpAddress}</Text>
                    <Text>Port:</Text>
                    <Text>{this.state.socketPort}</Text>
                    <Text>Status: {this.state.serverStatus}</Text>
                    <Button
                      disabled={!this.state.readyToHost}
                      onPress={this.onStartHosting}>
                      Start Hosting
                    </Button>
                  </View>
                </Layout>
              </Tab>
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

server.on('error', err => {
  console.log(`server error:\n${err.stack}`);
  server.close();
});

client.on('error', err => {
  console.log(`client error:\n${err.stack}`);
  server.close();
});
