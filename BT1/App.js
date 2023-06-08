import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, FlatList,PermissionsAndroid,Button} from 'react-native';
import {BleManager} from 'react-native-ble-plx';
import { db } from '../BT1/firebaseConfig';
import { addDoc, collection, getDocs, where, query, doc, getDoc} from 'firebase/firestore';
import base64 from 'react-native-base64';

export default App = () => {
  const [manager] = useState(new BleManager());
  const [devices, setDevices] = useState([]); //Scan Device List

  const [angle, setAngle] = useState(); //Motor Angle
  const [umState, setUmState] = useState(); //현재 자리 우산 유무
  const [check_um_m, setCheckMotor] = useState(false); //적외선 센서(모터)
  const [check_um_p, setCheckPassage] = useState(false); //적외선 센서(통로)
  const [motorState, setMotorSate] = useState(false); //모터 동작 완료
  const [openState, setOpenState] = useState(false);
  useEffect(() => {
    //code

  },
  [check_um_p,check_um_m,motorState])
  
  const update = async(code, um_num, station, user) => {
    const docStation = doc(db,"Station",station);
    const docUser = doc(db,"User",user);
    const docSnap1 = await getDoc(docStation);
    const docSnap2 = await getDoc(docUser);
    const st_count = docSnap1.get('st_count'); //station 우산 개수 
    const st_donation = docSnap1.get('st_donation');
    const u_donation = docSnap2.get('u_donation');

    const type = code % 10;
    try{
      switch (type){
        case 1: //대여 성공
          await updateDoc(docStation,
            `um_count_state.${um_num}.state`, false, 
            "st_count",st_count-1 
          );
          await updateDoc(docUser,
            "u_rent",true 
          );
          break;
        case 2: //대여 실패: 공유 우산 존재x          
          await updateDoc(docStation,
            `um_count_state.${um_num}.state`, false, 
            "st_count",st_count-1 
          );
          break;

        case 3: //반납 성공
          await updateDoc(docStation,
            `um_count_state.${um_num}.state`, true, 
            "st_count",st_count+1 
          );
          await updateDoc(docUser,
            "u_rent",false 
          );
          break;

        case 4: //반납 실패: 공유 우산 존재o
          await updateDoc(docStation,
            `um_count_state.${um_num}.state`, true, 
            "st_count",st_count+1 
          );        
          break;

        case 5: //폐우산 기부 성공
          await updateDoc(docStation,
            "st_donation",st_donation+1 
          );
          await updateDoc(docUser,
            "u_donation",u_donation+1 
          );        
          break;
      }
    }catch( error ){
      console.log("update rent error");
    }
  }




  const rent = async(st_id2, um_num2) => {
    //우산번호와 일치하는 각도 가져오기(스테이션 아이디(station1), 우산 번호(2))
    try{
      const docRef = doc(db,'Station',st_id2);
      const docSnap = await getDoc(docRef);
      const angle = docSnap.get(`um_count_state.${um_num2}.angle`)
      setAngle(angle);
      console.log(angle);
    }catch(error){ console.log(error.message)}
    send(angle); //bluetooth로 모터각도 전송 및 동작
    
    if(motorState == true){
      if(check_um_m == true){
        send('open'); //솔레노이드 open
        setOpenState(true); 
        //딜레이 주고 싶엉
        if(check_um_p == true && openState == false){
          //대여 성공 시 DB동작(대여상태, 스테이션 우산 개수 변환)

          setCheckPassage(false); //통로 센서인식 완료 후 false로 전환
        }else{
          //오류 메세지 창 출력 [우산을 가져가지 않았습니다. 다시 시도해주세요]
          //홈 화면으로 이동
        }
        send('close'); //솔레노이드 close
      }else{
        //우산번호 선택화면으로 이동(station정보 및 사용자 정보)
      }
      setMotorSate(false); //모터 동작완료 확인 false로 전환
    }
  }




  useEffect(() => {
    const subscription = manager.onStateChange(state => {
      if (state === 'PoweredOn') scanAndConnect(); 
    }, true);
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

  
  const connectToDevice = async device => {
    try {
      //connect
      const connectedDevice = await manager.connectToDevice(device.id);
      await connectedDevice.discoverAllServicesAndCharacteristics();
      console.log('Connected to', connectedDevice.name);

      //Read Massage from Connected Device
      connectedDevice.monitorCharacteristicForService(
        '0000ffe0-0000-1000-8000-00805f9b34fb', //serviceUUID
        '0000ffe1-0000-1000-8000-00805f9b34fb', //characterUUID
        (error,Characteristic)=>{
          const readData = `${Characteristic?.value}`;
          console.log('readData: '+base64.decode(`${Characteristic?.value}`));
          //적외선 센서 수신
          if(readData == 'check1') setCheckMotor(true);         //적외선센서1 check
          else if(readData == 'check2') setCheckPassage(true);  //적외선센서2 check
          //else if(readData == 'uncheck1') setCheckMotor(false);
          //else if(readData == 'uncheck2') setCheckPassage(false); //센서 비인식은 코드로 관리
          else if(readData == 'motortask') setMotorSate(true); //motortask: 모터 동작 완료    
        })
    } catch (error) {
      console.log('Connection/Read error:', error);
    }
  };

  const renderItem = ({item}) => (
    <TouchableOpacity onPress={() => connectToDevice(item)}>
      <Text>{item.name || 'Unknown Device'}</Text>
      <Text>{item.id}</Text>
    </TouchableOpacity>
  
  );

   //send
   const send = async (sendData) =>{
    try{
       await manager.writeCharacteristicWithResponseForDevice(
        '4C:24:98:70:B0:B9',
        '0000ffe0-0000-1000-8000-00805f9b34fb', //serviceUUID
        '0000ffe1-0000-1000-8000-00805f9b34fb', //characterUUID
        `${sendData}`
      )
    }catch(error){
      console.log(error);
    }
  }

  return (
    <View>
      <TouchableOpacity onPress={() => scanAndConnect()}>
        <Text style = {{fontSize:30, paddingTop:30}}>{"Click to Scan"} </Text>
      </TouchableOpacity>
      <Button 
      onPress={send}
      title='보내기'
      />
      <Button 
      onPress={rent}
      title='Station'
      />
      <Text>Bluetooth Devices:</Text>
      <FlatList
        data={devices}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};
