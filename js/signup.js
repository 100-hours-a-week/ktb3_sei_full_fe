import {showHelperText} from './module/helperText.js';
import { checkNicknameDuplication } from './module/validateNickname.js';


document.addEventListener('DOMContentLoaded',() =>{
    const form = document.querySelector('.signup-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const passwordCheckInput = document.getElementById('password-check');
    const nicknameInput = document.getElementById('nickname');
    const profileCircle = document.querySelector('.profile-circle');
    const profilePlus = document.querySelector('.plus');

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);

    profileCircle.addEventListener('click',()=>{
        fileInput.click();
    });

    fileInput.addEventListener('change',(e)=>{
        const file = e.target.files[0];
        if(!file) return;

        const reader = new FileReader();
        reader.onload = (evant) => {
            const img = document.createElement('img');
            img.src = event.target.result;
            profileCircle.innerHTML = '';
        };
        reader.readAsDataURL(file);
    });

    

    // 이메일 검사
    function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    //비밀번호 검사
    function isValidPassword(password) {
    const regex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,20}$/;
    return regex.test(password);
    }

    form.addEventListener('submit', (e)=>{
        e.preventDefault();

        let isValid = true;

        if(!isValidEmail(emailInput.value)){
            showHelperText(emailInput, '올바른 이메일 주소 형식을 입력해주세요(예: example@example.com');
            isValid = false;
        }else{
            showHelperText(emailInput,'');
        }

        if(!isValidPassword(passwordInput.value)){
            showHelperText(passwordInput, '비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 최소 1개씩 포함해야 합니다.');
            isValid = false;
        }else{
            showHelperText(passwordInput,'');
        }

        if(passwordInput.value !== passwordCheckInput.value){
            showHelperText(passwordCheckInput,'비밀번호가 일치하지 않습니다.');
            isValid = false;
        }else{
            showHelperText(passwordCheckInput,'');
        }
    })



})