import { useState, useEffect, useContext } from 'react';
import { View, Image, Text, StyleSheet, Dimensions } from 'react-native';
import AppContext from '../Appcontext';
import base64 from 'react-native-base64'; 
import { BleManager } from 'react-native-ble-plx';

const Loading = ({navigation}) => {
    const [manager] = useState(new BleManager()); //bluetooth object
    const [connect, setConnect] = useState(false); //connect state
    const myContext = useContext(AppContext);

    useEffect(() => {
        manager.onStateChange(state => {
            if (state === 'PoweredOn') {
                //Station mac주소를 통해 connect
                connectToDevice(myContext.connectedStation.st_mac);
            }
        }, true);
    }, [connect, myContext]);

    //Bluetooth Connect & Read
    const connectToDevice = async mac => { //[TESTBT] 4C:24:98:70:B0:B9
        try {
            //connect
            const connectedDevice =  await manager.connectToDevice(mac); //mac 주소로 연결 
            await connectedDevice.discoverAllServicesAndCharacteristics(); 
            console.log('Connected to', connectedDevice.name);
            setConnect(true); 
           
            //Read 
            connectedDevice.monitorCharacteristicForService(
                '0000ffe0-0000-1000-8000-00805f9b34fb', //serviceUUID
                '0000ffe1-0000-1000-8000-00805f9b34fb', //characterUUID
                (error, Characteristic) => {
                    console.log('Read Massage from connected Device: ' + base64.decode(`${Characteristic?.value}`));
                    const read_data = base64.decode(`${Characteristic?.value}`);
                    myContext.setRead(read_data);

                    //중복 read 확인(기존 전역변수 read_data)
                    if(myContext.read_data == read_data)
                        console.log("Read- " + myContext.read_data + " : " + read_data);
                    else{
                        //read_data/10 = code (1:대여, 2:반납, 3:기부)
                        switch(read_data){
                            case "11":
                            case "12":
                            case "13":
                                navigation.navigate("RentalPage");
                                break;
                            case "24":
                            case "25":
                            case "26":
                                navigation.navigate("ReturnPage");
                                break;
                            case "37":
                            case "38":   
                                navigation.navigate("DonationPage"); 
                                break;
                        }
                    }
                }
            )
        } catch (error) {
            console.log("해당 기기를 찾을 수 없습니다")
            console.log('Connection/Read error:', error);
        }
    };

    return (
        <>
        { 
            connect ? 
            navigation.push('FunctionList',{
                device: manager
            })
            :
            (
                <View style={styles.LoadingView}>
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
    LoadingView: {
        backgroundColor:'white',
        alignItems: 'center',
        justifyContent:'center'
    },
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