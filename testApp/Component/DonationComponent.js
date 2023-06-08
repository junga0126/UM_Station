import { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image } from 'react-native';


const DonationComponent = (props) => {
    return (
        <TouchableOpacity
            style={styles.donationView}
            onPress={() => console.log('donation')}
        >
            <View style={styles.donationdate}>
                <Text style={{fontSize:20, marginLeft:5}}>{props.date}</Text>
            </View>
            <View style={styles.donationInfo}>
                <View style={styles.stationInfo}>
                    <Text style={{fontSize:25, fontWeight:'bold', marginLeft:5}}>{props.stationnum}</Text>
                    <Text style={{fontSize:15, padding:5}}>{props.statiodnadd}</Text>
                </View>
                <View style={styles.donaPickture}>
                    <Image style={{ width: '85%', height: '100%', }} source={{uri:'https://cdn-icons-png.flaticon.com/512/4343/4343277.png'}} />
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default DonationComponent;

const styles = StyleSheet.create({
    donationView:{
        backgroundColor:'#F2F2F2',
        width:Dimensions.get('window').width*0.9,
        height:Dimensions.get('window').height*0.18,
        borderRadius: 10,
        padding: 10,
    },
    donationdate:{
        height:'35%',
        justifyContent:'center',
    },
    donationInfo:{
        height:'65%',
        flexDirection:'row',
    },
    stationInfo:{
        width:'70%',
        padding:8
    },
    donaPickture:{
        width:'30%',
        height:'100%',
    },
});
