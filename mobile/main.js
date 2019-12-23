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
import { Audio } from 'expo-av';
import * as Network from 'expo-network';
import * as FileSystem from 'expo-file-system';
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
var server = dgram.createSocket('udp4');
var client = dgram.createSocket('udp4');

server.on('error', function(msg, rinfo) {
  console.log(
    rinfo,
    Buffer.from(msg)
  );
});

server.on('message', async function(msg, remote) {
  console.log(remote.address + ':' + remote.port + '\'s message:' + msg);
  const rcvdmsg = await FileSystem.writeAsStringAsync(outputFileUri, msg, {
    encoding: FileSystem.EncodingType.Base64,
  });
  console.log('writeAsStringAsync() returned',rcvdmsg)
});

server.on('listening', function() {
  let socketInfo = server.address();
  console.log(
    'UDP Server listening on ' + socketInfo.address + ':' + socketInfo.port,
  );
});

export class Main extends React.Component {
  state = {
    selectedIndex: 0,
    serverStatus: 'Disconnected',
    readyToHost: true,
    host: undefined,
    port: undefined,
    deviceIpAddress: 'To be determined...',
    socketPort: 'To be determined...',
  };

  
  async componentDidMount() {

    AudioRecord.init(options);
    AudioRecord.start();
    AudioRecord.on('data', async data => {
      //base64-encoded audio data chunks
      try {
        await soundObject.loadAsync({
          uri:
            `data:audio/mpeg;base64,${data}`
        });
        await soundObject.playAsync();
      } catch (error) {}
      //let chunk = Buffer.from(data, 'base64');
      //client.send(chunk, 0, chunk.length, 12345, '0.0.0.0');
      //console.log('client just sent:', chunk);
    });
  }

  componentWillUnmount() {}
  onTabSelect = selectedIndex => {
    this.setState({selectedIndex});
  };

  onJoin = () => {};
  onQuit = () => {};
  onStartHosting = async () => {
    this.setState({
      serverStatus: 'Initiallizing server...',
      readyToHost: false,
    });

    server.bind(12345, '0.0.0.0');
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
