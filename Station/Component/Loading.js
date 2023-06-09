//23.06.04 19:12
import { useState, useEffect, Component, useContext } from 'react';
import { 
    View, Image, Text, StyleSheet, 
    Button, Dimensions, LogBox, 
} from 'react-native';
import { useNavigation } from '@react-navigation/native'; //navigation 오류로 인해 네이티브 훅 라이브러리를 사용
import AppContext from '../Appcontext';

// 블루투스
import base64 from 'react-native-base64';
import { BleManager } from 'react-native-ble-plx';

LogBox.ignoreLogs(["'new NativeEventEmitter() ...", "Non-serializable ..."]);
LogBox.ignoreAllLogs();

const Loading = ({route, navigation}) => {
    const [stationData, setStationData] = useState(); // Station 전체 데이터
    const [manager] = useState(new BleManager()); //블루투스 객체
    const [connect, setConnect] = useState(false) //connect 여부

   
    const myContext = useContext(AppContext);

    // 블루투스 
    useEffect(() => {
        console.log("--------Loading-------");
        manager.onStateChange(state => {
            if (state === 'PoweredOn') {
                connectToDevice(myContext.connectedStation.st_mac);
            }
        }, true);
        setStationData(myContext.connectedStation);
    }, [connect, myContext]);

    const connectToDevice = async device => { // 매개변수로 mac주소를 전달받음 TESTBT: 4C:24:98:70:B0:B9, FINAL:F0:B5:D1:AA:0C:24
        try {
            //connect
            const connectedDevice =  await manager.connectToDevice(device); //mac 주소로 연결 
            await connectedDevice.discoverAllServicesAndCharacteristics(); 
            console.log('Connected to', connectedDevice.name); // 연결된 기기 이름
            setConnect(true)
           
            //Read Massage from Connected Device
            connectedDevice.monitorCharacteristicForService(
                '0000ffe0-0000-1000-8000-00805f9b34fb', //serviceUUID
                '0000ffe1-0000-1000-8000-00805f9b34fb', //characterUUID
                (error, Characteristic) => {
                    console.log('monitorCharacteristicForService: ' + base64.decode(`${Characteristic?.value}`));
                    const read_data = base64.decode(`${Characteristic?.value}`);
                    if(myContext.readData == read_data){ 
                        console.log("중복 read");
                    //[2] new read data update
                    }else{
                        switch(read_data){
                            case "11":
                            case "12":
                            case "13":
                                myContext.setData(base64.decode(`${Characteristic?.value}`));
                                myContext.setState(true);
                                navigation.navigate("RentalPage");
                                break;
                            case "24":
                            case "25":
                            case "26":
                                myContext.setData(base64.decode(`${Characteristic?.value}`));
                                myContext.setState(true);
                                navigation.navigate("Return");
                                break;
                            case "37":
                            case "38":   
                                myContext.setData(base64.decode(`${Characteristic?.value}`));
                                myContext.setState(true);
                                navigation.navigate("DonationPage"); 
                                break;
                        }
                    }
                }
            )
            // 블루투스 연결 실패 시
        } catch (error) {
            console.log("해당 기기를 찾을 수 없습니다")
            console.log('Connection/Read error:', error);
        }
    };


    return (
        <>
        { 
            connect ? 
            navigation.navigate('FunctionList',{
                data: myContext.connectedStation,
                manager: manager
            })
            :
            (
                <View 
                style={styles.container}
                >
                    <Image
                        style={{ width: 100, height: 100, resizeMode: 'contain', }}
                        source={require('../assets/loading_do.gif')}
                    />
                    <Text>Station을 탐색 중입니다...</Text>
                </View>
            )
        }

    </>
    );
    
};

export default Loading;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    explainView: {
        width: Dimensions.get('window').width * 0.9,
        height: Dimensions.get('window').height * 0.1,
        padding:10,
    },
    pictureView:{
        width: Dimensions.get('window').width * 0.9,
        height: Dimensions.get('window').height * 0.5,
        justifyContent:'center',
        alignItems:'center',
        padding:10,
        backgroundColor:'gray',
    },
    text:{
        fontSize:30,
        fontWeight:'bold',
        color:'black',
        textAlign:'center',
    },
    buttonView: {
        width: Dimensions.get('window').width * 0.9,
        height: Dimensions.get('window').height * 0.1,
        marginBottom: 40,
        padding:10,
    },
    buttonstyle: {
        width: '100%',
        height: Dimensions.get('window').height * 0.10,
        backgroundColor: '#6699FF',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    }

});