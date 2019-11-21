import React from 'react';
import {StyleSheet} from 'react-native';
import {
  Layout,
  Button,
  Text,
  Icon,
  Tab,
  TabView,
  Input,
} from 'react-native-ui-kitten';

const HeartIcon = style => <Icon {...style} name="heart" />;

export class Main extends React.Component {
  state = {
    selectedIndex: 0,
  };

  onSelect = selectedIndex => {
    this.setState({selectedIndex});
  };
  render() {
    return (
      <Layout style={styles.container}>
        <TabView
          selectedIndex={this.state.selectedIndex}
          onSelect={this.onSelect}>
          <Tab title="HOST A VOICE CHAT">
            <Text>HOST</Text>
            <Button>Start Hosting</Button>
          </Tab>
          <Tab title="JOIN A VOICE CHAT">
            <Text>JOIN</Text>
            <Input />
            <Input />
            <Button>Join</Button>
          </Tab>
        </TabView>
      </Layout>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    textAlign: 'center',
  },
  likeButton: {
    marginVertical: 16,
  },
});
