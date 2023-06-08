import {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';


const FunctionList = ({navigation}) => {

    

    useEffect(() => {   
        // DB 읽어오기 = 대여/반납 여부 확인
        // 확인 후 버튼 활성화/비활성화
        



    }, []);


    return (
        <View style={styles.container}>
            <View style={styles.buttonView}>
                <TouchableOpacity
                    style={styles.buttonstyle}
                    onPress={() => navigation.navigate('Rental')}
                >
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color:'white' }}>대여하기</Text>
                </TouchableOpacity>
            </View>


            <View style={styles.buttonView}>
                <TouchableOpacity
                    style={styles.buttonstyle}
                    onPress={() => navigation.navigate('Return')}
                >
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color:'white' }}>반납하기</Text>
                </TouchableOpacity>
            </View>


            <View style={styles.buttonView}>
                <TouchableOpacity
                    style={styles.buttonstyle}
                    onPress={() => navigation.navigate('Donation')}
                >
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color:'white' }}>폐우산 기부하기</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default FunctionList;

const styles=StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height ,
        padding:20,
        paddingTop:50,
    },
    buttonView:{
        justifyContent: 'space-between', 
        height:Dimensions.get('window').height * 0.1, 
        marginBottom:40,
    },
    buttonstyle: {
        width: '100%',
        height: Dimensions.get('window').height * 0.10,
        backgroundColor: '#6699FF',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius:10,
    }
});