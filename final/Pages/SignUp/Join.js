import { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Button, Alert, Modal, Pressable, Image, TextInput, Keyboard, KeyboardAvoidingView, ScrollView, TouchableOpacity } from 'react-native';


const Join = ({ navigation }) => {
  // 입력 내용
  const [id, setId] = useState("id");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [nickName, setNickName] = useState("");


  //회원가입 버튼 활설화
  const [okId, setOkId] = useState(false);
  const [okPw, setOkPw] = useState(false);
  const [okPwEq, setOkPwEq] = useState(false);
  const [okName, setOkName] = useState(false);
  const [okNickname, setOkNickname] = useState(false);
  const [okPhone, setOkPhone] = useState(false);
  const [okMail, setOkMail] = useState(false);


  //정규식 메시지 check
  const [errorMessage, setErrorMessage] = useState(""); //id
  const [errorMessagePw, setErrorMessagePw] = useState(""); // pw
  const [errorMessagePwEq, setErrorMessageEq] = useState(""); // pwEq
  const [errorMessageName, setErrorMessageName] = useState(""); // name
  const [errorMessageNickname, setErrorMessageNickname] = useState(""); // nickname 
  const [errorMessagePhone, setErrorMessagePhone] = useState(""); // phone



  const regiButton = () => {
    if (okId & okPw & okPwEq & okName & okNickname & okPhone == true) {

      return false;
    }
    return true;
  }

  //아이디 정규식
  const validateId = id => {
    const regex = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;
    return regex.test(id) && id.length > 4;
  }

  //패스워드 정규식
  const validatePw = pw => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    return regex.test(pw);
  }

  //패드워드 같은지
  const validateEq = eq => {
    if (eq === pw) { return true; }
    else { return false; }
  }

  //이름 정규식
  const validateName = name => {
    const regex = /^[가-힣]{2,20}$/;
    return regex.test(name);
  }

  //닉네임 정규식
  const validateNickname = nickname => {
    const regex = /^[가-힣a-zA-Z0-9]{2,20}$/;
    return regex.test(nickname);
  }

  //전화번호 정규식
  const validatePhone = phone => {
    const regex = /^01([0|1|6|7|8|9]?)-?([0-9]{3,4})-?([0-9]{4})$/;
    return regex.test(phone);
  }
  const validateDetail = detail_Address => {
    if (detail_Address !== "") { return true; }
    else { return false; }
  }

  //띄어쓰기 고로시
  const removespace = text => {
    const regex = /\s/g;
    return text.replace(regex, '');
  }

  //자동 하이픈 생성
  const autoHyphen = (target) => {
    return target.replace(/[^0-9]/g, '').replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, "$1-$2-$3").replace(/(\-{1,2})$/g, "");
  }


  //아이디 핸들러
  const handleIdChange = (id) => {
    //DB 아이디 중복체크


  };

  //비밀번호 핸들러
  const handlePwChange = (pw) => {
    const changedPw = removespace(pw);
    setPassword(changedPw);
    setErrorMessagePw(
      validatePw(changedPw) ? "올바른 비밀번호 형식입니다." : "영어 한개이상 숫자 한개 이상 특수문자 한개이상 8자리 이상."
    );
    setOkPw(validatePw(changedPw));
  }

  //비밀번호 확인 핸들러
  const handlePwEqChange = (eq) => {
    const changedPwEq = removespace(eq);
    setPasswordCheck(changedPwEq);
    setErrorMessageEq(
      validateEq(changedPwEq) ? "비밀번호가 일치합니다." : "비밀번호가 다릅니다!"
    );
    setOkPwEq(validateEq(changedPwEq));
  }
  //이름 핸들러
  const handleNameChange = (name) => {
    const changedName = removespace(name);
    setName(changedName);
    setErrorMessageName(
      validateName(changedName) ? "올바른 이름 형식입니다." : "이름을 올바르게 입력해주세요."
    );
    setOkName(validateName(changedName));
  }

  //닉네임 핸들러
  const handleNicknameChange = (nickname) => {
    const changedNickname = removespace(nickname);
    setNickname(changedNickname);
    setErrorMessageNickname(
      validateNickname(changedNickname) ? "올바른 닉네임 형식입니다." : "2~20자리 특수문자 제외"
    );
    setOkNickname(false);
  }

  //전화번호 핸들러
  const handlePhoneChange = (콜) => {
    const changedPhone = autoHyphen(콜);
    setPhone(changedPhone);
    setErrorMessagePhone(
      validatePhone(changedPhone) ? "올바른 휴대전화 번호입니다" : "올바른 휴대전화 번호가 아닙니다."
    );
    setOkPhone(validatePhone(changedPhone));
  }

  const JoinButton = () => {
    // 회원가입 DB 넣기
    console.log(id)

  }


  return (

    <View style={styles.container}>
      {/* 회원가입 */}
      <View style={styles.title}>
        <Text style={{ fontSize: 25 }}>회원가입</Text>
      </View>


      {/* 사용자 필수정보 */}
      <ScrollView style={styles.scrollviewstyle}>
        <View style={styles.importInfo}>
          <View style={styles.textInputView}>
            <Text style={styles.titleText}>아이디</Text>
            <View style={{ flexDirection: 'row', width: '100%', }}>
              <TextInput
                style={styles.textInput}
                value={id}
                placeholder="아이디를 입력해주세요."
                onChangeText={handleIdChange}
                maxLength={15}
              ></TextInput>
              <TouchableOpacity
                style={styles.overlapButton}
                disabled={!validateId(id)}
                onPress={() => { handleIdChange(id) }}
              >
                <Text style={styles.overlapButtonText}>
                  중복확인
                </Text>
              </TouchableOpacity>
            </View>

          </View>
          <Text>{errorMessage}</Text>
          <View style={styles.textInputView}>
            <Text style={styles.titleText}>비밀번호</Text>
            <TextInput
              style={styles.textInput}
              value={password}
              placeholder="비밀번호를 입력해주세요."
              onChangeText={handlePwChange}
            ></TextInput>
          </View>

          <View style={styles.textInputView}>
            <Text style={styles.titleText}>비밀번호 확인</Text>
            <TextInput
              style={styles.textInput}
              value={passwordCheck}
              placeholder="비밀번호를 입력해주세요."
              onChangeText={handlePwEqChange}
            ></TextInput>
          </View>
        </View>

        {/* 사용자 개인정보 */}
        <View style={styles.userinfo}>
          <View style={styles.textInputView}>
            <Text style={styles.titleText}>닉네임</Text>
            <TextInput
              style={styles.textInput}
              value={nickName}
              placeholder="닉네임를 입력해주세요."
              onChangeText={handleNicknameChange}
            ></TextInput>
          </View>
          <View style={styles.textInputView}>
            <Text style={styles.titleText}>전화번호</Text>
            <TextInput
              style={styles.textInput}
              value={phone}
              placeholder="전화번호를 입력해주세요."
              onChangeText={handlePhoneChange}
            ></TextInput>
          </View>
          <View style={styles.textInputView}>
            <Text style={styles.titleText}>이름</Text>
            <TextInput
              style={styles.textInput}
              value={name}
              placeholder="이름를 입력해주세요."
              onChangeText={handleNameChange}
            ></TextInput>
          </View>
        </View>
      </ScrollView>



      {/* 회원가입 버튼 */}
      <View style={styles.SignUpButton}>
        <TouchableOpacity
          style={[styles.loginBtn, { opacity: 0.5 }]}
          disabled={regiButton()}
          onPress={() => JoinButton()}
        >
          <Text style={styles.loginText}>가입하기</Text>
        </TouchableOpacity>
      </View>



    </View>

  );
};

export default Join;



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  title: {
    padding: 25,
  },
  importInfo: { // 회원가입 필수정보
    width: Dimensions.get('window').width * 0.8,
    height: Dimensions.get('window').height * 0.3,
  },
  userinfo: { // 사용자 개인정보
    width: Dimensions.get('window').width * 0.8,
    height: Dimensions.get('window').height * 0.35,
  },
  textInputView: { // TextInput css
    width: '100%',
    borderBottomColor: '#6699FF',
    borderBottomWidth: 3,
    padding: 5,
    paddingBottom: 0,
  },
  titleText: {
    marginTop: 8,
    marginLeft: 8,
    color: '#6699FF',
    fontWeight: 'bold',
  },
  textInput: {
    padding: 10,
    backgroundColor: 'white',
    width: '80%'
  },
  SignUpButton: {
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  overlapButton: {
    backgroundColor: '#6699FF',
    opacity: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    width: '20%',
    borderRadius: 5,
  },
  overlapButtonText: {
    fontSize: 15
  }
}
);