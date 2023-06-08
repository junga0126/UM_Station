import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, TextInput, TouchableOpacity, Keyboard } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

import GraySmallButton from '../../Component/GraySmallButton';


const BreakReport = () => {
    const [breakList, setBreakList] = useState([false, false, false, false]); // 고장 내용 입력 list
    const [sentence, setSentence] = useState(''); // 구체적인 고장 사유 입력

    const breakListFunc = (index) => {
        const temp = breakList;
        temp[index] = !temp[index];
        setBreakList(temp);

    }





    return (
        <View style={styles.container}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.breakReportView}>
                    <View style={styles.stationnum}>
                        <Text style={{ fontSize: 25, fontWeight: 'bold', color: '#6699FF' }}>신고할 station</Text>
                        <TouchableOpacity
                            style={styles.bigbutton}
                            onPress={() => { console.log('QR코드 스캔') }}
                        >
                            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>QR코드 촬영</Text>
                        </TouchableOpacity>
                    </View>


                    <View style={styles.breakInfo}>
                        <Text style={{ fontSize: 25, fontWeight: 'bold', color: '#6699FF' }}>고장 내용</Text>
                        <View style={styles.breakselect}>
                            <View style={{ justifyContent: 'space-around', width: '50%', marginRight: 5 }}>
                                <GraySmallButton title="여닫이 작동 안함" func={() => breakListFunc(0)} />
                                <GraySmallButton title="폐우산 기부 안됨" func={() => breakListFunc(0)} />
                            </View>
                            <View style={{ justifyContent: 'space-around', width: '50%', marginLeft: 5 }}>
                                <GraySmallButton title="모터 작동 안함" func={() => breakListFunc(0)} />
                                <GraySmallButton title="QR코드 손실" func={() => breakListFunc(0)} />
                            </View>
                        </View>
                    </View>


                    <View style={styles.sentence}>
                        <Text style={{ fontSize: 25, fontWeight: 'bold', color: '#6699FF' }}>구체적인 고장 사유</Text>
                        <View style={{ marginTop: 10, }}>
                            <View style={styles.sentenceInputView}>
                                <TextInput
                                    value={sentence}
                                    onChangeText={text => setSentence(text)}
                                    placeholder="useless placeholder"
                                    multiline={true}
                                />
                            </View>
                        </View>
                    </View>
                </View>
                <View style={styles.submitView}>
                    <TouchableOpacity
                        style={styles.submit}
                        onPress={() => { console.log('DB에 저장 ') }}
                    >
                        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>제출하기</Text>
                    </TouchableOpacity>
                </View>
            </TouchableWithoutFeedback>
        </View>
    );
};

export default BreakReport;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        justifyContent: 'space-between',
    },
    breakReportView: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height * 0.75,
        padding: 10,
    },
    stationnum: {
        height: '18%',
        padding: 8,
    },
    breakInfo: {
        height: '30%',
        padding: 8,
    },
    breakselect: {
        height: '75%',
        justifyContent: 'center',
        flexDirection: 'row',
        width: '100%',
    },
    sentence: {
        height: '52%',
        padding: 8,
    },
    sentenceInputView: {
        height: '90%',
        width: '100%',
        backgroundColor: '#F2F2F2',
        borderRadius: 10,
        padding: 10,
    },
    bigbutton: {
        backgroundColor: '#F2F2F2',
        padding: 10,
        borderRadius: 10,
        height: '70%',
        marginTop: 3,
        justifyContent: 'center',
        alignItems: 'center'
    },
    submitView: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height * 0.25,
        padding: 10,
    },
    submit: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#D9E5FF',
        borderRadius: 15,
        height: '40%',
    },
});