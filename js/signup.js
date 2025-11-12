import { showHelperText } from './modules/helperText.js';
import { checkEmailFormat, checkEmailDuplicate } from './modules/validateEmail.js';
import { checkPasswordFormat, checkPasswordMatch } from './modules/validatePassword.js';
import { checkNicknameDuplication } from './modules/validateNickname.js';
import { setupProfileUpload } from './modules/profileUpload.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.signup-form');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const passwordCheckInput = document.getElementById('password-check');
  const nicknameInput = document.getElementById('nickname');
  const profileCircle = document.querySelector('.profile-circle');
  const signupBtn = document.querySelector('.signup-btn');

  const profileUploader = setupProfileUpload(profileCircle);


  signupBtn.disabled = true;
  signupBtn.style.backgroundColor = '#ACA0EB';


  async function updateButtonState() {
    const emailValid =
      checkEmailFormat(emailInput) && (await checkEmailDuplicate(emailInput));
    const passwordValid = checkPasswordFormat(passwordInput);
    const passwordMatch = checkPasswordMatch(passwordInput, passwordCheckInput);
    const nicknameValid = await checkNicknameDuplication(nicknameInput);

    const allValid =
      emailValid && passwordValid && passwordMatch && nicknameValid;

    if (allValid) {
      signupBtn.disabled = false;
      signupBtn.style.backgroundColor = '#7F6AEE';
    } else {
      signupBtn.disabled = true;
      signupBtn.style.backgroundColor = '#ACA0EB';
    }

    return allValid;
  }


  [emailInput, passwordInput, passwordCheckInput, nicknameInput].forEach(
    (input) => {
      input.addEventListener('input', async () => {

        if (input === emailInput) checkEmailFormat(emailInput);
        if (input === passwordInput) checkPasswordFormat(passwordInput);
        if (input === passwordCheckInput)
          checkPasswordMatch(passwordInput, passwordCheckInput);
        if (input === nicknameInput) await checkNicknameDuplication(nicknameInput); // ✅ 추가

        updateButtonState();
      });

     

      input.addEventListener('blur', async () => {
        if (input === emailInput) await checkEmailDuplicate(emailInput);
        if (input === nicknameInput) await checkNicknameDuplication(nicknameInput);
        updateButtonState();
      });
    }
  );


  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const isAllValid = await updateButtonState();
    if (!isAllValid) {
      alert('입력한 정보를 다시 확인해주세요.');
      return;
    }

    const profileImageUrl = profileUploader();

    const requestData = {
      email: emailInput.value.trim(),
      password: passwordInput.value.trim(),
      nickname: nicknameInput.value.trim(),
      profile_image: profileImageUrl || null,
    };

    try {
      const response = await fetch('http://localhost:8080/users/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) throw new Error('회원가입 실패');
      const data = await response.json();

      alert('회원가입이 완료되었습니다!');
      console.log('회원가입 성공:', data);
      window.location.href = '/login';
    } catch (error) {
      console.error('회원가입 오류:', error);
      alert('회원가입 중 문제가 발생했습니다.');
    }
  });
});

const loginLink = document.querySelector('.login-link');
if (loginLink) {
  loginLink.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = '/login.html';
  });
}
