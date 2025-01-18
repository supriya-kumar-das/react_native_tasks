import React from 'react';
import {NavigationContainer,} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import Home from './src/screens/home';

const Stack = createStackNavigator();
const App = () => {
  return (
    <GestureHandlerRootView >
    <NavigationContainer >
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home}  options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default App;

