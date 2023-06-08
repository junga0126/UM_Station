import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState, useRef, } from 'react';
import { View, Text, StyleSheet, Dimensions, Button, Alert, Modal, Pressable, Image, TextInput, Keyboard, KeyboardAvoidingView, TouchableOpacity } from 'react-native';


import Main2 from './Pages/Main/Main2';
import BTconnect from "./Pages/BTconnect";
import Login from "./Pages/SignUp/Login";
import Join from  "./Pages/SignUp/Join";
import SignUp from "./Pages/SignUp/SignUp";
import UserInfo from "./Pages/Info/UserInfo";
import QRCodeScanner from "./Pages/Scanner/QRCodeScanner";
import CameraCheck from "./Pages/Scanner/CameraCheck";
import Map from "./Pages/Map/Map";
import Main from "./Pages/Main/Main"

import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';


const Stack = createStackNavigator();
// expo install react-native-safe-area-context
// npm install @react-navigation/native
// expo install react-native-gesture-handler react-native-reanimated react-native-screens react-native-safe-area-context @react-native-community/masked-view


export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Main2" component={Main2} />
          <Stack.Screen name="Login" component={Login}/>
          <Stack.Screen name="Join" component={Join}/>
          <Stack.Screen name="SignUp" component={SignUp}/>
          <Stack.Screen name="UserInfo" component={UserInfo}/>
          <Stack.Screen name="BTconnect" component={BTconnect}/>
          <Stack.Screen name="QRCodeScanner" component={QRCodeScanner}/>
          <Stack.Screen name="CameraCheck" component={CameraCheck}/>
          <Stack.Screen name="Map" component={Map}/>
          <Stack.Screen name="Main" component={Main}/>
        </Stack.Navigator>
      </NavigationContainer>
      
    </>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});