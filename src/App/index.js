import React from 'react';
import './App.css';
import AppLayout from './AppLayout';
import AppBar from './AppBar';
import { AppProvider } from './AppProvider'; // AppProvider is one among the multiple exports and is not a default export
import Settings from '../Settings';
import Dashboard from '../Dashboard'
import Content from '../Shared/Content'

class App extends React.Component {
  render() {
    return (
      <AppLayout>
        <AppProvider>
          <AppBar />
          <Content>
            <Settings />
            <Dashboard />
          </Content>
        </AppProvider>
      </AppLayout>
    );
  }
}

export default App;