import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';


const GraySmallButton = (props) => {
    return (
        <TouchableOpacity
            style={[styles.smallbutton,{height:props.height, width:props.width}]}
            onPress={() => { props.func }}
        >
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{props.title}</Text>
        </TouchableOpacity>
    );
};

export default GraySmallButton;

const styles = StyleSheet.create({
    smallbutton: {
        backgroundColor: '#F2F2F2',
        borderRadius: 10,
        padding:10,
        justifyContent: 'center',
        alignItems: 'center'
    },
});