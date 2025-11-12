import { showHelperText } from './helperText.js';

export function checkPasswordFormat(passwordInput){
    const password = passwordInput.value.trim();
    
    if(password ===''){
        showHelperText(passwordInput,'비밀번호를 입력해주세요.');
        return false;
    }
      const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,20}$/;


    if (!regex.test(password)) {
        showHelperText(passwordInput,
      '비밀번호는 8~20자이며, 대문자,소문자,숫자,특수문자를 각각 최소 1개 포함해야 합니다.'
    );
    return false;
    }
    showHelperText(passwordInput,'');
    return true;
}

export function checkPasswordMatch(passwordInput,passwordCheckInput){
    const password = passwordInput.value.trim();
    const confirm = passwordCheckInput.value.trim();

    if(confirm ===''){
        showHelperText(passwordCheckInput,'비밀번호를 한번 더 입력해주세요');
    }

    if(password !== confirm){
        showHelperText(passwordCheckInput,'비밀번호가 다릅니다.');
        return false;
    }

    showHelperText(passwordCheckInput,'');
    return true;
}