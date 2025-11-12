import { showHelperText } from './helperText.js';

export function checkEmailFormat(emailInput){
    const email = emailInput.value.trim();
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if(email === ''){
        showHelperText(emailInput, '이메일을 입력해주세요.');
        return false;
    }
    if(!regex.test(email)){
        showHelperText(emailInput, '올바른 이메일 주소 형식을 입력해주세요 <br> (예: example@example.com)');
        return false;
    }

    showHelperText(emailInput, '');
    return true;
}

export async function checkEmailDuplicate(emailInput){
    const email = emailInput.value.trim();

    if(email === ''){
        showHelperText(emailInput,'이메일을 입력해주세요.');
        return false;
    }
    try{
        const response = await fetch(`http://localhost:8080/users?email=${encodeURIComponent(email)}`);
;
        const message = await response.text();

        showHelperText(emailInput, message);

        if(!response.ok){
            return false;
        }

        return true;
    }catch(error){
        console.error('이메일 중복 확인 오류:', error);
        showHelperText(emailInput, '서버 연결 문제가 발생했습니다.');
        return false;
    }
}