import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { db } from '../../firebaseConfig';
import { getDocs, collection } from 'firebase/firestore';
import AppContext from '../../Appcontext';

const FunctionList = ({ navigation, route }) => {
    const [retalButton, setRentalButton] = useState(true);
    const [returnButton, setReturnButton] = useState(true);
    const [manager, setManager] = useState(); //ble manager
    const [id] = useState(AsyncStorage.getItem('id'));
    const [user_rent, setUserRent] = useState(true); 
    const myContext = useContext(AppContext);

    useEffect(() => {
        console.log('funcionlist', myContext.station_data.st_id);
        if (route.params != undefined) {
            setManager(route.params.manager);

            //우산 번호 개수: um_count_state의 길이 
            const um_count = Object.keys(myContext.station_data.um_count_state).length; 
            var rentalCount = 0;
            var returnCount = 0;

            for (var i=0; i<um_count; i++) { 
                // key값이 string이라서 변환 후 state읽기
                if (myContext.station_data.um_count_state[String(i + 1)].state) 
                    rentalCount++; // 대여 가능한 우산 개수 true
                else 
                    returnCount++; // 반납 가능한 우산 개수 false              
            }
            //반납 공간 x
            if (um_count == rentalCount) {
                // 전체 공간(개수) == 존재 공유우산(개수)
                console.log('반납 불가능');
                setReturnButton(!returnButton);
            }
            //공유 우산 x
            if (um_count == returnCount) { 
                // 전체 공간(개수) == 반납 공간(개수)
                console.log('대여 불가능')
                setRentalButton(!retalButton)
            }
        }
    }, []);

    useEffect(() => {
        (async () => {
            try {
                const data = await getDocs(collection(db, "User"));
                data.docs.map(doc => { 
                    if (doc.data().u_id == id && doc.data().u_rent)  //사용자의 아이디와 같고 대여한 상태
                        setUserRent(true);
                })
            } catch (error) {
                console.log('error: ', error.message)
            }
        })();
    }, [user_rent]);

    //Renteal Button 활성화
    const checkRental = () =>{
        if (retalButton && (user_rent == false)){
            return false //활성화
        }else {
            return true
        }
    }

    //Return Button 활성화
    const checkReturn = () =>{
        if (returnButton && (user_rent == true)){
            return false
        } else{
            return true
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.buttonView}>
                <TouchableOpacity
                    style={retalButton && (user_rent==false) ? styles.buttonstyle : [styles.buttonstyle, { opacity: 0.5 }]}
                    onPress={() => navigation.push('Rental', { manager: manager })}
                    disabled={checkRental()}
                >
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>대여하기</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.buttonView}>
                <TouchableOpacity
                    style={returnButton && (user_rent==true) ? styles.buttonstyle : [styles.buttonstyle, { opacity: 0.5 }]}
                    onPress={() => navigation.push('ReturnPage', { manager: manager })}
                    disabled={checkReturn()}
                >
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>반납하기</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.buttonView}>
                <TouchableOpacity
                    style={styles.buttonstyle}
                    onPress={() => navigation.push('DonationPage', { manager: manager })}
                >
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>폐우산 기부하기</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default FunctionList;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        padding: 20,
        paddingTop: 50,
    },
    buttonView: {
        justifyContent: 'space-between',
        height: Dimensions.get('window').height * 0.1,
        marginBottom: 40,
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