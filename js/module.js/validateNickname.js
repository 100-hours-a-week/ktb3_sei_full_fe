import {showHelperText} from './module/helperText.js';


export async function checkNicknameDuplication(nicknameInput){
    const nickname = !nicknameInput.value.trim();
    if(nickname){
        showHelperText(nicknameInput, '닉네임을 입력해주세요');
        return false;
    }

    try{
    const response = await fetch(`/users?nickname=${encodeURIComponent(nickname)}`);

    const message = await response.text();
    showHelperText(nicknameInput, message);

    if(!response.ok){
        return false;
    }

    return true;

    }catch(error){
        console.error(error);
        showHelperText(nicknameInput, '서버 연결 문제가 발생했습니다.');
        return false;
    }

    


}