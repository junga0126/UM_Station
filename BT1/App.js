import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, FlatList,PermissionsAndroid} from 'react-native';
import {BleManager} from 'react-native-ble-plx';
import {PERMISSIONS, RESULTS, requestMultiple,checkMultiple,request} from 'react-native-permissions';
import base64 from 'react-native-base64';

const App = () => {
  const [manager] = useState(new BleManager());
  const [devices, setDevices] = useState([]); //Scan devices

  useEffect(() => {
    const subscription = manager.onStateChange(state => {
      if (state === 'PoweredOn') scanAndConnect(); 
    }, true);
    return () => subscription.remove();
  }, []);

  //scan
  const scanAndConnect = async() => {
    console.log('scanAndConnect')
    await manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log("scanAndConnect error");
        return;
      }
      setDevices(prevDevices => {
        if (!prevDevices.some(d => d.id === device.id)) {
          return [...prevDevices, device];
        }
        return prevDevices;
      });
    });

    setTimeout(() => {
      manager.stopDeviceScan();
    }, 10000);
  };

  //connect
  const connectToDevice = async device => {
    try {
      const connectedDevice = await manager.connectToDevice(device.id);
      await connectedDevice.discoverAllServicesAndCharacteristics();
      console.log('Connected to', connectedDevice.name);
    } catch (error) {
      console.log('Connection error:', error);
    }
  };

  const renderItem = ({item}) => (
    <TouchableOpacity onPress={() => connectToDevice(item)}>
      <Text>{item.name || 'Unknown Device'}</Text>
      <Text>{item.id}</Text>
    </TouchableOpacity>
  
  );

  return (
    <View>
      <TouchableOpacity onPress={() => scanAndConnect()}>
        <Text style = {{fontSize:30, paddingTop:30}}>{"Click to Scan"} </Text>
      </TouchableOpacity>
      <Text>Bluetooth Devices:</Text>
      <FlatList
        data={devices}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

export default App;