import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Dimensions} from 'react-native';

import TitleName from '../../Component/TitleName';

const Rental = ({navigation}) => {
    return (
        <View style={styles.container}>
            <TitleName title='대여하기' />
            <View style={styles.buttonView}>
                
        

            </View>

        </View>
    );
};

export default Rental;

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
        marginBottom:20,
    },


});