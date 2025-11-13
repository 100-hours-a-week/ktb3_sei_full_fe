import { checkEmailFormat, checkEmailDuplicate } from './modules/validateEmail.js';
import { checkPasswordFormat, checkPasswordMatch } from './modules/validatePassword.js';
import { checkNicknameDuplication } from './modules/validateNickname.js';
import { uploadFile } from './modules/uploadFile.js';
import { showHelperText } from './modules/helperText.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.signup-form');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const passwordCheckInput = document.getElementById('password-check');
  const nicknameInput = document.getElementById('nickname');
  const profileCircle = document.querySelector('.profile-circle');
  const signupBtn = document.querySelector('.signup-btn');

  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*';
  fileInput.style.display = 'none';
  document.body.appendChild(fileInput);

  let uploadedImageUrl = null; 

  profileCircle.addEventListener('click', () => fileInput.click());

  fileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    console.log("선택된 파일:", file);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = document.createElement('img');
      img.src = event.target.result;
      img.alt = '프로필 사진';
      img.classList.add('profile-preview');
      profileCircle.innerHTML = '';
      profileCircle.appendChild(img);
    };
    reader.readAsDataURL(file);

    uploadedImageUrl = await uploadFile(file);
    console.log("업로드된 이미지 URL:", uploadedImageUrl);
  });

  signupBtn.disabled = true;
  signupBtn.style.backgroundColor = '#ACA0EB';

  async function updateButtonState() {
    const emailValid = checkEmailFormat(emailInput) && (await checkEmailDuplicate(emailInput));
    const passwordValid = checkPasswordFormat(passwordInput);
    const passwordMatch = checkPasswordMatch(passwordInput, passwordCheckInput);
    const nicknameValid = await checkNicknameDuplication(nicknameInput);

    const allValid = emailValid && passwordValid && passwordMatch && nicknameValid;
    signupBtn.disabled = !allValid;
    signupBtn.style.backgroundColor = allValid ? '#7F6AEE' : '#ACA0EB';
    return allValid;
  }

  [emailInput, passwordInput, passwordCheckInput, nicknameInput].forEach((input) => {
    input.addEventListener('input', updateButtonState);
    input.addEventListener('blur', updateButtonState);
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const isAllValid = await updateButtonState();
    if (!isAllValid) {
      alert('입력한 정보를 다시 확인해주세요.');
      return;
    }

    const requestData = {
      email: emailInput.value.trim(),
      password: passwordInput.value.trim(),
      nickname: nicknameInput.value.trim(),
      profile_image: uploadedImageUrl, 
    };

    try {
      const response = await fetch('http://localhost:8080/users/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();
      if (response.ok) {
        alert('회원가입이 완료되었습니다!');
        console.log('회원가입 성공:', result);
        window.location.href = './index.html';
      } else {
        alert(result.message || '회원가입 실패');
      }
    } catch (error) {
      console.error('회원가입 오류:', error);
      alert('회원가입 중 문제가 발생했습니다.');
    }
  });
});
