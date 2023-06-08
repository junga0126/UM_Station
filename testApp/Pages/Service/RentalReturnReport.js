import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, TextInput, TouchableOpacity, Keyboard } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { RadioButton } from 'react-native-paper';

import GraySmallButton from '../../Component/GraySmallButton';

const RentalReturnReposrt = () => {
    const [breakList, setBreakList] = useState([false, false, false, false]); // 고장 내용 입력 list
    const [sentence, setSentence] = useState(''); // 구체적인 고장 사유 입력
    const [checked, setChecked] = useState('first');


    const breakListFunc = (index) => {
        const temp = breakList;
        temp[index] = !temp[index];
        setBreakList(temp);

    }





    return (
        <View style={styles.container}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.rentalReportView}>
                    <View style={styles.problemView}>
                        <GraySmallButton title="대여가 안돼요" func={() => breakListFunc(0)} height='80%' width='45%'/>
                        <GraySmallButton title="반납이 안돼요" func={() => breakListFunc(0)} height='80%' width='45%'/>
                    </View>

                    <View style={styles.stationnum}>
                        <Text style={{ fontSize: 25, fontWeight: 'bold', color: '#6699FF' }}>신고할 station</Text>
                        <TouchableOpacity
                            style={styles.bigbutton}
                            onPress={() => { console.log('QR코드 스캔') }}
                        >
                            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>QR코드 촬영</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.radioView}>
                        <Text style={{ fontSize: 25, fontWeight: 'bold', color: '#6699FF' }}>문제 원인 선택하기</Text>
                        <View style={styles.radio}>
                            <RadioButton
                                color='#6699FF'
                                value="first"
                                status={checked === 'first' ? 'checked' : 'unchecked'}
                                onPress={() => setChecked('first')}
                            />
                            <Text style={{fontSize:17}} onPress={() => setChecked('third')}>대여했는데 우산을 잃어버렸어요</Text>
                        </View>
                        <View style={styles.radio}>
                            <RadioButton
                                color='#6699FF'
                                value="second"
                                status={checked === 'first' ? 'checked' : 'unchecked'}
                                onPress={() => setChecked('second')}
                            />
                            <Text style={{fontSize:17}} onPress={() => setChecked('third')}>대여하지 않았는데 대여중이라고 나와있어요</Text>
                        </View>
                        <View style={styles.radio}>
                            <RadioButton
                                color='#6699FF'
                                value="third"
                                status={checked === 'first' ? 'checked' : 'unchecked'}
                                onPress={() => setChecked('third')}
                            />
                            <Text style={{fontSize:17}} onPress={() => setChecked('third')}>기타(하단에 구체적인 신고 내용을 적어주세요)</Text>
                        </View>
                    </View>


                    <View style={styles.sentence}>
                        <Text style={{ fontSize: 25, fontWeight: 'bold', color: '#6699FF' }}>구체적인 신고 내용</Text>
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

export default RentalReturnReposrt;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        justifyContent: 'space-between',
    },
    rentalReportView: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height * 0.75,
        padding: 10,
    },
    problemView: {
        width: '100%',
        height:'15%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingTop:10,
    },
    stationnum: {
        height: '20%',
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
    radioView:{
        height:'25%',
        padding: 8,
        marginTop:10,
    },
    radio: {
        flexDirection: 'row',
        alignItems:'center',
    },
    sentence: {
        height: '40%',
        padding: 8,
        marginTop:10,
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