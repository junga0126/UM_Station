import React, {useState, useEffect, useMemo} from 'react';
import {View, Text, TouchableOpacity, FlatList, PermissionsAndroid, Button, TextInput} from 'react-native';
import {BleManager, Characteristic} from 'react-native-ble-plx';
//import {PERMISSIONS, RESULTS, requestMultiple,checkMultiple,request} from 'react-native-permissions';
//import base64 from 'react-native-base64';
// import firestore from '@react-native-firebase/firestore';
// import database, {firebase} from '@react-native-firebase/database'

// import { db } from '../BTapp2/firebaseConfig';
// import { addDoc, collection, getDocs } from 'firebase/firestore';

const App = () => {
  //const [manager] = useState(new BleManager()); //blemanager object
  const blemanager = useMemo(() => new BleManager(),[]);
  const [devices, setDevices] = useState([]);
  const [test, setTest] = useState();

  // //1. Permission 관련
  // const requestPermission = async() =>{
  //   checkMultiple([PERMISSIONS.ANDROID.BLUETOOTH_SCAN, PERMISSIONS.ANDROID.BLUETOOTH_CONNECT]).then((statuses) => {
  //     console.log('BLUETOOTH_SCAN', statuses[PERMISSIONS.ANDROID.BLUETOOTH_SCAN]);
  //     console.log('BLUETOOTH_CONNECT', statuses[PERMISSIONS.ANDROID.BLUETOOTH_CONNECT]);
  //     request(PERMISSIONS.ANDROID.BLUETOOTH_SCAN).then((result)=>{
  //       console.log("PERMISSIONS.ANDROID.BLUETOOTH_SCAN",result)
  //     })
  //   });
  //   try {
  //     const granted = await requestMultiple([
  //       PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
  //       PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
  //       PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
  //       PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
  //     ]).then((result) => {
  //       if (
  //         result['android.permission.ACCESS_FINE_LOCATION'] === 'granted') {
  //         console.log("모든 권한 획득",result)
  //       } else {
  //         console.log("거절된 권한있음",result)
  //       }   
  //     })
  //   } catch (err) {
  //     console.warn(err)
  //   }
  // }
  // requestPermission();

  //2. 바로 실행 (실행하자마자 작동하는것은 어플을 키자마자 렌더링이 되기 때문이다.)
  //rendering이 될 때마다 실행된다.
  useEffect(() => {  
      const subscription = blemanager.onStateChange(state => 
      {
        if (state === 'PoweredOn') 
        {
          scanAndConnect();
        }
      }, true);
      
      return () => subscription.remove();
  },[]);
  
  const scanAndConnect = async() => {
    console.log('scanAndConnect');
    await blemanager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log("scanAndConnect error");
        return;
      }
      setDevices((prevDevices) => {
        if (!prevDevices.some((d) => d.id === device.id)) {
          return [...prevDevices, device];
        }
        return prevDevices;
      });
    });
    setTimeout(() => {
      blemanager.stopDeviceScan();
    }, 10000);
  };

  //Connect Device
  const connectToDevice = async (device) => {
    try {
      //Connect with Choose Device
      const connectedDevice = await blemanager.connectToDevice(device.id);
      await connectedDevice.discoverAllServicesAndCharacteristics(); 
      console.log('Connected to', connectedDevice.name);
      
      //Read Massage from Connected Device
      connectedDevice.monitorCharacteristicForService(
        '0000ffe0-0000-1000-8000-00805f9b34fb', //serviceUUID
        '0000ffe1-0000-1000-8000-00805f9b34fb', //characterUUID
        (error,Characteristic)=>{
        console.log('monitorCharacteristicForService: '+base64.decode(`${Characteristic?.value}`));
      })
    } catch (error) {
      console.log('Connection error:', error);
    }
  };

  //연결가능한 디바이스를 선택할 시 Connect
  const renderItem = ({item}) => (
    <TouchableOpacity onPress={() => connectToDevice(item)}>
      <Text>{item.name || 'Unknown Device'}</Text>
      <Text>{item.id}</Text>
    </TouchableOpacity>
  );

  //Data send
  const send = async () =>{
    try{
      console.log('SSSSSSSSSSSSSSSSSSSSSSSSSSSSS')
       await manager.writeCharacteristicWithResponseForDevice(
        '4C:24:98:70:B0:B9',
        '0000ffe0-0000-1000-8000-00805f9b34fb', //serviceUUID
        '0000ffe1-0000-1000-8000-00805f9b34fb', //characterUUID
        base64.encode('안녕')
      )
    }catch(error){
      console.log('error in send data');
    }
  }

 
  return (
    <View>
      <TouchableOpacity onPress={() => scanAndConnect()}>
        <Text style = {{fontSize:30, paddingTop:30}}>{"Click to Scan"} </Text>
      </TouchableOpacity>
      <Button title='데이터베이스'
      onPress={()=>readDB()}/>
      <Button 
      onPress={send}
      title='보내기'
      />
      <Text>Bluetooth Devices:</Text>
      <FlatList
        data={devices}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default App;