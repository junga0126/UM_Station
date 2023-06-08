import { useState } from "react";
import { Text, View, TextInput, TouchableOpacity, ImageBackground, Image } from "react-native";
import { event } from "react-native-reanimated";
import { styles } from "../../Component/style";

/* LoginScreen - 관리자 로그인 화면 DB를 통해 회원 식별, 회원가입 선택 가능 */
const Login = (props) => {
    const [idTextInput, setIdTextinput] = useState("") //입력받은 id
    const [pwTextInput, setPwTextinput] = useState("") //입력받은 password
    const [manager, setManager] = useState("") //불러온 관리자 정보

    //로그인 입력값 useState에 저장
    const idChangeInput = (event) => {
        setIdTextinput(event)
    }
    const pwChangeInput = (event) => {
        setPwTextinput(event)
    }

    return (
        <ImageBackground style={styles.image} source={require('../../assets/LoginScreen.png')} resizeMode='cover'>
            <View style={styles.mainView}>

                <TextInput
                    style={styles.loginputText}
                    value={idTextInput}
                    onChangeText={idChangeInput}
                    placeholder="ID"
                />
                <TextInput
                    style={styles.loginputText}
                    value={pwTextInput}
                    onChangeText={pwChangeInput}
                    placeholder="PASSWORD"
                />
                <TouchableOpacity
                    style={styles.loginBTN}
                    onPress={() => {
                        props.navigation.navigate("Home")
                    }}>
                    <Text style={styles.loginText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.loginBTN}
                    onPress={() => {
                        props.navigation.navigate("SignUp")
                    }}>
                    <Text style={styles.loginText}>SignUp</Text>
                </TouchableOpacity>

            </View>
        </ImageBackground>
    )
}

export default Login;