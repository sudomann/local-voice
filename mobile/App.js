import React from 'react';
import {ApplicationProvider, IconRegistry} from 'react-native-ui-kitten';
import {mapping, dark as theme} from '@eva-design/eva';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import {Main} from './main';

export default class App extends React.Component {
  render() {
    return (
      <React.Fragment>
        <IconRegistry icons={EvaIconsPack} />
        <ApplicationProvider mapping={mapping} theme={theme}>
          <Main />
        </ApplicationProvider>
      </React.Fragment>
    );
  }
}
