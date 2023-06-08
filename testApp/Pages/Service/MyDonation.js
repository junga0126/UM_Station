import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';

import DonationComponent from '../../Component/DonationComponent';

const MyDonation = ({ navigation }) => {
    const [donationList, setDonationList] = useState();


    useEffect(() => {
        // DB 읽어오기   


    }, []);



    return (
        <View style={styles.container}>
            <Text style={{ color: '#6699FF', fontWeight: 'bold', fontSize: 25, padding: 10 }}>나의 기부 내역</Text>
            <ScrollView>
                <View style={{ padding: 10 }}>
                    <DonationComponent date="2023.04.08" stationnum="station1" statiodnadd="충청남도 아산시 탕정면 선물로 221번길 70"/>
                </View>
                {/* <View style={{ padding: 10 }}>
                    <DonationComponent />
                </View> */}
            </ScrollView>
            
        </View>
    );
};

export default MyDonation;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        padding:10,
    },
});