import { StatusBar } from 'expo-status-bar';
import { Text, View, StyleSheet, Image, ActivityIndicator, Button, TouchableOpacity, Dimensions } from 'react-native';
import { useEffect, useState } from 'react'
// Location API
import * as Location from 'expo-location';
// firebase 연동
import { db } from '../../firebaseConfig';
import { addDoc, collection, getDocs } from 'firebase/firestore';

//날씨 api키
const API_KEY = "204756a8614d5d5f3d4e6544f1cd8c7d"

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}


const Main = ({navigation}) => {
    //날씨
    const [weather, setWeather] = useState("");
    const [icon, seticon] = useState("");
    const [address, setAddress] = useState("");



    const [users, setUsers] = useState();


    useEffect(() => {
        (async () => {
            // firebase
            try {
                const data = await getDocs(collection(db, "User"))
                setUsers(data.docs.map(doc => ({ ...doc.data(), id: doc.id })))
                console.log('users--------', users)
                
                // 핸드폰 로컬에 저장되어 있는 사용자의 ID와 동일한지 확인
                // users?.map((row, idx) => {
                //     if (row.id == '1') {
                //         console.log('row' + idx, row)
                //     }
                //     console.log('row' + idx, row)
                // })

            } catch (error) {
                console.log('eeerror', error.message)
            }




            //위치 수집 허용하는지 물어보기
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            let addresscheck = await Location.reverseGeocodeAsync(location.coords);
            console.log('main address-> ', addresscheck)
            var addresstotal = addresscheck[0].region + ' ' + addresscheck[0].city // 충청남도 아산시    
            setAddress(addresstotal)
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${location.coords.latitude.toFixed(5)}&lon=${location.coords.longitude.toFixed(5)}&appid=${API_KEY}&units=metric`);
            const res = await response.json()
            // console.log('temp -> ',res)
            console.log('res--', res)
            setWeather(res)
            iconsplit = res.weather[0].icon.split('n')
            seticon(iconsplit[0])
        })();
    }, [])







    return (
        <View style={styles.container}>
 

            <View style={styles.explainView}>
                <TouchableOpacity
                    style={styles.explainUMS}
                    onPress={() => console.log("Dddd")}
                >
                    <View style={{ flexDirection: 'row', width: '100%' }}>
                        <View style={{ padding: 10, alignItems: 'center', width: '88%' }}>
                            <Text style={{ fontSize: 20, }}>          UMStation 설명</Text>
                        </View>
                        <View style={styles.arrowicon}>
                            <Image style={{ width: '50%', height: '50%' }} source={require('../../assets/arrow_icon.png')} />
                        </View>
                    </View>
                </TouchableOpacity>
            </View>


            <View style={styles.userinfoView}>
                <TouchableOpacity 
                    style={styles.userinfo}
                    onPress={() => navigation.navigate('UserInfo')}
                >
                    <View style={styles.weatherView}>
                        <View style={styles.weather}>
                            {
                                weather != "" ?
                                    <>
                                        <View style={styles.temperature}>
                                            <View style={{ width: '40%', height: '100%', backgroundColor:'white', borderRadius:50, marginRight:4}}>
                                                <Image style={{ width: '100%', height: '100%' }} source={{ uri: `http://openweathermap.org/img/wn/${icon}d.png` }} />
                                            </View>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Text style={{ fontSize: 30 }}>{weather.main.temp.toFixed(0)}</Text>
                                                <Text style={{ fontSize: 20 }}>  °C </Text>
                                            </View>
                                        </View>
                                        <View style={styles.location}>
                                            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{address}</Text>
                                        </View>
                                    </>
                                    :
                                    <ActivityIndicator />
                            }
                        </View>
                    </View>
                    <View style={styles.userstate}>
                        <View style={{ flexDirection: 'row', height: '100%', }}>
                            {
                                users ?
                                    <>
                                        <View style={{ width: '65%', padding:3 }}>
                                            <View style={{ alignItems: 'center', marginBottom:3, paddingLeft:7 }}>
                                                <Text style={{ fontSize: 20 }}>{users[0].u_name}님은</Text>
                                            </View>
                                            <View style={{ alignItems: 'center' }}>
                                                {
                                                    users[0].u_rent ?
                                                        <Text style={{ fontSize: 35, fontWeight: 'bold' }}>대여 가능</Text> :
                                                        <Text style={{ fontSize: 35, fontWeight: 'bold' }}>대여 중</Text>
                                                }
                                            </View>
                                        </View>
                                    </> :
                                    <ActivityIndicator />
                            }
                            <View style={{ width: '35%', hieght:'100%', justifyContent: 'center', alignItems:'center', }}>
                                {/* {
                                    // 이미지 링크 넣기 user DB에 스토리지 링크 넣어서 가져오기
                                    users[0].u_profile ? 
                                    <Image style={{ width: '100%', height: '100%', borderRadius: 15, }} source={{ uri: users[0].u_profile }}></Image> 
                                    :
                                    <Image style={{ width: '50%', height: '100%', borderRadius: 15, }} source={{ uri: 'https://cdn-icons-png.flaticon.com/512/6522/6522516.png' }}></Image>
                                } */}
                                <Image style={{ width: '50%', height: '100%', borderRadius: 15, }} source={{ uri: 'https://cdn-icons-png.flaticon.com/512/6522/6522516.png' }}></Image>
                            </View>
                        </View>
                    </View>
                    <View style={styles.donation}>
                        <Text style={{ fontSize: 16 }}>폐우산 기부 횟수 :    3</Text>
                    </View>
                </TouchableOpacity>
            </View>




            <View style={styles.mainfunctionView}>
                <TouchableOpacity 
                    style={styles.mapbutton}
                    onPress={() => navigation.navigate('Map')}
                >
                    <Image style={{ width: '100%', height: '100%', borderRadius: 15,}} source={require('../../assets/map_sample.png')}></Image>

                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.scanner}
                    onPress={() => navigation.navigate('QRScanner')}
                >
                    <Image style={{ width: '100%', height: '100%', borderRadius: 15, }} source={require('../../assets/qr_sample.png')}></Image>

                </TouchableOpacity>
            </View>



            <View style={styles.serviceView}>
                <TouchableOpacity 
                    style={styles.service}
                    onPress={() => navigation.navigate('CustMain')}
                >
                    <View style={{ width: '20%', height: '100%', padding: 10, alignItems: 'center' }}>
                        <Image style={{ width: '80%', height: '100%' }} source={require('../../assets/service_icon.png')}></Image>
                    </View>
                    <View style={{ width: '80%', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>고객센터        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>

    );
}

export default Main;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    explainView: {
        width: Dimensions.get('screen').width,
        height: Dimensions.get('screen').height * 0.1,
        padding: 15,
        justifyContent: 'center',
        flexDirection: 'row'
    },
    explainUMS: {
        width: '100%',
        height: '100%',
        backgroundColor: '#D9E5FF',
        justifyContent: 'center',
        alignContent: 'center',
        borderRadius: 15,
    },
    arrowicon: {
        width: '12%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    userinfoView: { //사용자 정보 첫 레이아웃
        width: Dimensions.get('screen').width,
        height: Dimensions.get('screen').height * 0.28,
        padding: 15,
        justifyContent: 'center',
        alignContent: 'center',
    },
    userinfo: { // 사용자의 정보 radius
        width: '100%',
        height: '100%',
        backgroundColor: '#F2F2F2',
        borderRadius: 15,
        padding: 15,
        alignItems:'center',
    },
    weatherView:{
        width: '90%',
        height: '35%',
        borderBottomColor: '#848484',
        borderBottomWidth: 2,
    },
    weather: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems:'center',
    },
    temperature: {
        flexDirection: 'row',
        width: '50%',
        height: '100%',
        justifyContent: 'flex-end',
        padding: 5,
    },
    location: {
        width: '50%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    userstate: {
        width: '100%',
        height: '45%',
        paddingTop: 15,
    },
    donation: {
        width: '100%',
        height: '20%',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        paddingRight: 15,
    },
    mainfunctionView: {
        width: Dimensions.get('screen').width,
        height: Dimensions.get('screen').height * 0.35,
        padding: 15,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    mapbutton: {
        width: '48%',
        backgroundColor: 'red',
        height: '100%',
        marginRight: 7,
        borderRadius: 15,

    },
    scanner: {
        width: '48%',
        backgroundColor: 'skyblue',
        height: '100%',
        marginLeft: 7,
        borderRadius: 15,
    },
    serviceView: {
        width: Dimensions.get('screen').width,
        height: Dimensions.get('screen').height * 0.1,
        padding: 15,
        justifyContent: 'center',
        flexDirection: 'row',
    },
    service: {
        width: '100%',
        height: '100%',
        backgroundColor: '#F2F2F2',
        justifyContent: 'center',
        alignContent: 'center',
        borderRadius: 15,
        flexDirection: 'row'
    },
});
