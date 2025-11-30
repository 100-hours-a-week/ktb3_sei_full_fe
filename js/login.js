import { checkEmailFormat } from './modules/validateEmail.js';
import { checkPasswordFormat } from './modules/validatePassword.js';
import { showHelperText } from './modules/helperText.js';
import { authFetch } from './modules/authFetch.js';


document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.login-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.querySelector('.login-btn');
    const signUpLink = document.querySelector('.signup-link');

    loginBtn.disabled = true;
    loginBtn.style.backgroundColor = '#655447';

    function updateButtonState(){
        const emailValid = checkEmailFormat(emailInput);
        const passwordValid = checkPasswordFormat(passwordInput);

        if(emailValid && passwordValid){
            loginBtn.disabled = false;
            loginBtn.style.backgroundColor = '#655447';
        } else {
            loginBtn.disabled = true;
            loginBtn.style.backgroundColor = '#655447';
        }
    }
    [emailInput, passwordInput].forEach((input) => {
        input.addEventListener('input', () => {
            if (input === emailInput) checkEmailFormat(emailInput);
            if (input === passwordInput) checkPasswordFormat(passwordInput);
            updateButtonState();
        });
    });


    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const emailValid = checkEmailFormat(emailInput);
        const passwordValid = checkPasswordFormat(passwordInput);

        if (!emailValid || !passwordValid) {
            alert('입력한 정보를 다시 확인해주세요.');
            return;
        }

        const requestData = {
            email: emailInput.value.trim(),
            password: passwordInput.value.trim(),
        };

        try {
            const response = await authFetch('http://127.0.0.1:8080/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: "include",
                body: JSON.stringify(requestData),
            });

            if (!response.ok) {
                showHelperText(passwordInput, '아이디 또는 비밀번호를 확인해주세요.');
                return;
            }

            const data = await response.json();

            const accessToken = data.accessToken;
            const refreshToken = data.refreshToken;

            window.accessToken = accessToken;
            localStorage.setItem("refreshToken", refreshToken);


        
            alert('로그인 성공!');
            console.log('로그인 성공:', data);
            window.location.href = '/board.html'; 

        } catch (error) {
            console.error('로그인 오류:', error);
            alert('서버 연결 중 오류가 발생했습니다.');
        }
    });

    signUpLink.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = '/signup.html';
    });

});