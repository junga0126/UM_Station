import React, { useEffect, useState,  useRef,} from 'react';
import { Text, View, StyleSheet, Dimensions, Button, Alert, Modal, Pressable, Image, TouchableOpacity, Keyboard, KeyboardAvoidingView, } from 'react-native';
import MapView, { Marker, Circle, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import { Camera, Constants } from 'expo-camera';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { db } from '../../firebaseConfig';
import { addDoc, collection, getDocs } from 'firebase/firestore';


//날씨 api키
const API_KEY = "204756a8614d5d5f3d4e6544f1cd8c7d"

const Map = ({navigation}) => {

  const [weather, setWeather] = React.useState("");
  const [address, setAddress] = React.useState("");

  // 사진찍기
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  //모달
  const [photoModal, setPhotoModal] = React.useState(false); //사진찍는 모달
  const [weatherModal, setWeatherModal] = React.useState(false); // 산책 완료 모달


  const [mapRegion, setmapRegion] = useState({ //나의 위치 usestate
    latitude: 36.7987869, //위도
    longitude: 127.0757584, //경도
  });

  //QR코드 스캐너
  const [scaned, setScaned] = useState(true);
  const ref = React.useRef(null);

  //firestor 연동
  const [stations, setStations] = useState();






  //에니메이션으로 이동
  const mapRef = React.useRef(null);
  const [region, setRegion] = React.useState();



  // 드래그 해서 위치의 위도경도 가져오기
  const mapRegionChangehandle = (region) => {
      setRegion(region)
    
  };

  
  useEffect(() => {
    // 종료후 재시작을 했을때 초기화
    setScaned(true);
  }, []);

  const onBarCodeRead = (event) => {
    if (!scaned) return;
    setScaned(false);
    Vibration.vibrate();
    Alert.alert("QR Code", event.nativeEvent.codeStringValue, [
      { text: "OK", onPress: () => setScaned(true) },
    ]);
  };


  useEffect(() => {
    (async () => {
      try {
        const data = await getDocs(collection(db, "Station"))
        setStations(data.docs.map(doc => ({ ...doc.data(), id: doc.id })))
        
        // stations?.map((row, idx) => {
        //   console.log('row' + idx, row)
        // })
        console.log('data', data.docs)
      } catch (error) {
        console.log('eerror', error.message)
      }




      //위치 수집 허용하는지 물어보기
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      let address = await Location.reverseGeocodeAsync(location.coords);
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${location.coords.latitude.toFixed(5)}&lon=${location.coords.longitude.toFixed(5)}&appid=${API_KEY}&units=metric`);
      const res = await response.json()
      console.log('address -> ', address)
      console.log(address[0].district)
      console.log(res)
      setWeather(res)

      setmapRegion({ //현재 위치
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      })
      
    })();
  }, []);

  const takePicture = async () => {
    if (camera) {
      console.log('tackPicture')
      const data = await camera.takePictureAsync(null)
      setImage(data.uri);
      console.log('data', data.uri);
      setPhotoModal(false)
    }
  }

  if (hasCameraPermission === false) {
    return <Text>No access to camera</Text>;
  }

  


  
  //이동하기
  const onDetail = (lat, lon, stationNum) => { // 반납 가능 우산 개수, 대여 가능 우산 개수 계산
    setmapRegion({ //현재 위치
      latitude: lat,
      longitude: lon,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005
    })
    mapRef.current.animateToRegion({ //해당 위치로 지도 이동
      latitude: lat,
      longitude: lon,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005
    }, 1000);
  }

  return (
    <View style={styles.container}>
      <View style={{ alignContent: 'center', justifyContent: 'center' }}>
        {/* 사진 찍은 후 확인 모달 */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={weatherModal}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setWeatherModal(!weatherModal);
          }}>

          <View style={styles.centeredView}>
            <View style={styles.weathertab}>
              {
                weather != "" ?
                  <>
                    <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                      {/* <Text style={{ color: 'gray' }}>     {address[0].district} </Text> */}
                      <Text style={{ fontSize: 20, }}> {weather.main.temp.toFixed(0)}°C       </Text>
                    </View>
                    <Image style={{ width: '20%', height: '100%' }} source={{ uri: `http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png` }} />
                    <Text>{weather.weather[0].main}</Text>
                  </>
                  :
                  null
              }
            </View>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.modalView}>

              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={{ padding: 10 }}>
                  <View style={{ backgroundColor: 'yellow', alignItems: 'center', justifyContent: 'center', height: 320, width: 280 }}>
                    <Image source={{ uri: image }} style={{ resizeMode: "cover", height: '100%', width: '100%', borderWidth: 2, borderColor: '#EBE3D7' }} />
                  </View>
                  <Text>Ddddd</Text>
                  
                </View>

              </TouchableWithoutFeedback>



              <View style={{ flexDirection: 'row', padding: 10 }}>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => {

                    setWeatherModal(!weatherModal)

                  }}>
                  <Text style={styles.textStyle}>확인</Text>
                </Pressable>
              </View>
            </KeyboardAvoidingView>
          </View>
        </Modal>


      </View>








      <View style={styles.containerMap}>
        <MapView
          style={styles.map}
          // region={mapRegion}
          // initialRegion={{mapRegion}}
          initialRegion={{
            latitude: 36.7987869,
            longitude: 127.0757584,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
          ref={mapRef}
          //사용자 위치에 맞게 마커가 표시된다.
          showsUserLocation={true}
          // userLocationUpdateInterval = 
          onUserLocationChange={(e) => {
            setmapRegion({
              latitude: e.nativeEvent.coordinate.latitude,
              longitude: e.nativeEvent.coordinate.longitude
            });
          }}
          onRegionChange={mapRegionChangehandle}
        >
          {/* <Marker
            coordinate={{
              latitude: parseFloat(region.latitude),
              longitude: parseFloat(region.longitude),
            }}
          >


          </Marker> */}

          {
            stations?.map((e, idx) => {
              if (e.id=="Station"){
                var rentalCount = 0
                var returnCount = 0

                e.s_count.map((e2, idx2) => {
                  if (e2.u_state ) {
                    rentalCount++;
                  } else {
                    returnCount++;
                  }
                })

                return (
                  <Marker
                    key={idx}
                    coordinate={{ latitude: e.s_position_x, longitude: e.s_position_y }}
                    onPress={() => {
                      console.log(e)
                      onDetail(e.s_position_x, e.s_position_y, e.s_num)
                    }}
                  >
                    <Callout style={{ width:Dimensions.get('screen').width*0.6}}>

                        <View style={{ justifyContent:'center', padding:5}}>
                          <Text style={{ fontSize: 20, fontWeight: 'bold' , color:'#6699FF'}}>{e.s_num}</Text>
                          <Text >충청남도 아산시 탕정면 선문로 221번길 70 </Text>
                        </View>

                        <View style={{ alignItems:'flex-end', marginTop:10}}>
                          <Text style={{ fontSize: 13, fontWeight: 'bold',}}>대여 가능 우산 갯수 : {rentalCount}</Text>
                          <Text style={{ fontSize: 13, fontWeight: 'bold',}}>반납 가능 우산 갯수 : {returnCount}</Text>
                        </View>

                        <View>


                        </View>
                      </Callout>
                  </Marker>
                )
              }
              
            })
          }




         
        </MapView>


        <View>
          

        </View>

        <View style={styles.buttons}>
          {/* 버튼 */}
          {/* 화면비율 맞추기 */}
          <>
            <Pressable style={styles.closemap} onPress={()=> navigation.navigate('Main')} >
              <Text style={{fontSize:20, fontWeight:'bold'}}>지도 닫기</Text>
            </Pressable>
            <Text>              </Text>

            <Pressable style={styles.qrscanner} onPress={() => navigation.navigate('QRScanner')}>
              <Image style={{width:'25%', height:'55%'}} source={require('../../assets/qr_icon.png')} />
              <Text style={{fontSize:20, fontWeight:'bold', color:'white'}}>  대여하기</Text>
            </Pressable></>
        </View>

      </View>
    </View>

  );
}

export default Map;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerMap: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...StyleSheet.absoluteFillObject,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  buttons: {
    padding: 5,
    height: "10%",
    flexDirection: 'row',
    widh: "100%",
    justifyContent: 'center',
    marginBottom: 15,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
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
    borderRadius: 20,
    padding: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    width: '80%',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  weathertab: {
    width: '100%',
    height: Dimensions.get('window').height * 0.08,
    backgroundColor: 'white',
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  closemap:{
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'white',
    width: '40%'
  },
  qrscanner:{
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    elevation: 3,
    backgroundColor: '#5775D9',
    width: '40%',
    flexDirection:'row'
  },
  mylocation:{
    backgroundColor:'white',
    width:50,
    height:50,
  }
});