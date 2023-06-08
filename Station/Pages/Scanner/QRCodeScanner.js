import React, { useState, useEffect, useContext } from 'react';
import { Text, View, StyleSheet, Modal, Image, Dimensions, TouchableOpacity, Pressable, TextInput } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Camera } from 'expo-camera';
import { db } from '../../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import AppContext from '../../Appcontext';

const QRCodeScanner = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [stationNum, setStationNum] = useState(); //Station Code
  const [stationName, setStationName] = useState(''); //Station ID
  const myContext = useContext(AppContext);
  //카메라
  const [scanned, setScanned] = useState(false);
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
  //모달
  const [modalVisible, setModalVisible] = useState(false);
  const [numModalVisible, setNumModalVisible] = useState(false);
  
  useEffect(() => {
    //카메라 핸들러 
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };
    getBarCodeScannerPermissions();
  }, []);

  //barcode인식하면 나오는 함수 - QR scan
  const handleBarCodeScanned = ({ data }) => {
    setScanned(true);
    console.log('handleBarcodescanned', data);
    //console.log(typeof(data)) //string 
    var s_data = data.split('"'); // " " 기준으로 나누기
    console.log('s_data', s_data[3]);
    checkStation(s_data[3]);
  };

  //카메라 권한 확인 예외처리
  if (hasPermission === null) 
    return <Text>Requesting for camera permission</Text>;
  if (hasPermission === false) 
    return <Text>No access to camera</Text>;
  
  //동일 Station 확인
  const checkStation = async (station) => {
    try {
      let checkresult = false; //예외 처리
      const data = await getDocs(collection(db, "Station"));

      //[1] Scan QR - st_id
      if (station != null){
        data.docs.map((doc, idx) => {
          //scan 일치 성공, 상태 false -> 사용 가능
          if (doc.data().st_id == station && doc.data().st_state) {
            checkresult = true;
            myContext.setStation(doc.data()); //Station 정보(전역 변수)
            setStationName(station);
          }
        })
      }
      //[2] Station Code 입력 - st_num
      else if (stationNum != null) {
        data.docs.map((doc, idx) => {
          //station code 일치 성공, 상태 true -> 사용 가능
          if (doc.data().st_num == station && doc.data().st_state) {
            checkresult = true;
            myContext.setStation(doc.data()); //Station 정보(전역 변수)
            setStationName(doc.data().st_id);
          }
        })
      } 

      //station 사용 가능
      if (checkresult) { 
        setNumModalVisible(false); // 번호 입력 모달창 닫기
        setModalVisible(!modalVisible); // 스캔 모달창 열기
      }
      else alert('사용할 수 없는 Station입니다. 다시 스캔해주세요');
    } catch (error) {
      console.log('eerror', error.message)
    }
  }

  return (
    <View style={styles.container}>
      <View style={{ justifyContent: 'center', alignItems: 'center', }}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={styles.modalTop}>
                <Text style={{ fontSize: 20, textAlign: 'center' }}>Scan 완료!</Text>
              </View>

              <View style={styles.modalMid}>
                <Text style={{ fontSize: 25, }}>{stationName}을 </Text>
                <Text style={{ fontSize: 25, }}>사용하시겠습니까? </Text>
              </View>

              <View style={styles.modalbot}>
                <Pressable
                  style={{ width: '50%' }}
                  onPress={() => {
                    setScanned(false)
                    setModalVisible(!modalVisible)
                    navigation.navigate("Loading");
                  }}>
                  <Text style={styles.textStyle}>예</Text>
                </Pressable>
                <Pressable
                  style={{ width: '50%' }}
                  onPress={() => {
                    setScanned(false)
                    setModalVisible(!modalVisible)
                  }}>
                  <Text style={styles.textStyle}>아니오</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={numModalVisible}
          onRequestClose={() => {
            setNumModalVisible(!numModalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={styles.modalTop}>
                <Text style={{ fontSize: 20, textAlign: 'center',  }}>Station 번호 입력하기</Text>
              </View>

              <View style={styles.modalMid}>
                <TextInput
                  style={{ width: '50%', height: 50, fontSize: 20, textAlign: 'center' }}
                  value={stationNum}
                  onChangeText={(e)=> setStationNum(e)}
                  placeholder="StationNum (8자)"
                  placeholderTextColor="#E7E7E7"
                  maxLength={8}
                  numeric
                  keyboardType={'numeric'}
                />
              </View>

              <View style={styles.modalbot}>
                <Pressable
                  style={{ width: '50%' }}
                  onPress={() => {
                    // station 유무 확인 함수
                    setStationNum()
                    checkStation(stationNum)
                  }}>
                  <Text style={styles.textStyle}>확인</Text>
                </Pressable>
                <Pressable
                  style={{ width: '50%' }}
                  onPress={() => setNumModalVisible(!numModalVisible)}>
                  <Text style={styles.textStyle}>취소</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </View>
      
      <Camera
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={[StyleSheet.absoluteFillObject, styles.container]}
        barCodeTypes={BarCodeScanner.type}
        flashMode={flash}
      >
        <Image
          style={styles.qr}
          source={require('../../assets/qr_scan.png')}
        />

        <View style={styles.qrassiView}>
          <View style={{ flexDirection: 'row', height: '50%', width: '90%', justifyContent: 'space-between' }}>
            <TouchableOpacity
              style={styles.assi}
              onPress={() => setNumModalVisible(true)}>
              <Image style={{ width: '100%', height: '100%' }} source={require('../../assets/keypad.png')} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.assi}
              onPress={() => {
                setFlash(
                  flash === Camera.Constants.FlashMode.off
                    ? Camera.Constants.FlashMode.torch
                    : Camera.Constants.FlashMode.off);
              }}>
              <Image style={{ width: '100%', height: '100%' }} source={require('../../assets/flashlight.png')} />
            </TouchableOpacity>
          </View>

          <View style={{ height: '50%', width: '100%', alignItems: 'center', marginTop: 20 }}>
            <TouchableOpacity
              style={styles.assi}
              onPress={() => navigation.pop()}>
              <Text style={{ fontSize: 20, fontWeight: 'bold' }}>X</Text>
            </TouchableOpacity>
          </View>

        </View>
      </Camera>
    </View>
  );
}
export default QRCodeScanner;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qr: {
    marginTop: 20,
    width: Dimensions.get('window').width * 0.7,
    height: Dimensions.get('window').width * 0.7,
  },
  qrassiView: {
    width: Dimensions.get('window').width * 0.7,
    height: Dimensions.get('window').height * 0.2,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  assi: {
    backgroundColor: 'white',
    width: Dimensions.get('window').width * 0.15,
    height: Dimensions.get('window').width * 0.15,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTop: {
    width: '100%',
    justifyContent: 'center',
    textAlign: 'center',
    padding: 10,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  modalMid: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  modalbot: {
    width: '100%',
    backgroundColor: '#B2CCFF',
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderColor: 'gray',
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
  },
  modalbutton: {
    width: '20%',
    justifyContent: 'center',
    alignItems: 'center',
    height: 30,
    borderRadius: 10,
  },
  textStyle: {
    fontSize: 20,
    textAlign: 'center',
    padding: 10,
  },
});