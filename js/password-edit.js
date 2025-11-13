import { setupDropdownActions, setupDropdownMenu } from './modules/dropdownMenu.js';
import { checkPasswordFormat, checkPasswordMatch } from './modules/validatePassword.js';
import { loadUserProfileIcon } from './modules/profileIcon.js';

document.addEventListener('DOMContentLoaded',()=>  {
  setupDropdownMenu();
  setupDropdownActions();

  const form = document.querySelector('.edit-form');
  const passwordInput = document.getElementById('password');
  const passwordCheckInput = document.getElementById('password-check');
  const submitBtn = form.querySelector('.small-btn');

  submitBtn.disabled = true;
  submitBtn.style.backgroundColor = '#D9D9D9';
  submitBtn.style.cursor = 'not-allowed';

  form.addEventListener('input', () => {

    const validPassword = checkPasswordFormat(passwordInput);
    const matchPassword = checkPasswordMatch(passwordInput, passwordCheckInput);


    if (validPassword && matchPassword) {
      submitBtn.disabled = false;
      submitBtn.style.backgroundColor = '#ACA0EB';
      submitBtn.style.cursor = 'pointer';
    }
  });

  submitBtn.addEventListener('click', async() =>{

    const validPassword = checkPasswordFormat(passwordInput);
    const matchPassword = checkPasswordMatch(passwordInput, passwordCheckInput);


    if (!validPassword || !matchPassword) return;

    const newPassword = passwordInput.value.trim();

    try{
      const response= await fetch('http://127.0.0.1:8080/users/password',{
        method: 'PATCH',
        headers:{
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({new_password: newPassword}),
        credentials: 'include', 
      });

      const result = await response.json();

      if (response.ok) {
        showToast('수정 완료');
        passwordInput.value = '';
        passwordCheckInput.value = '';
        submitBtn.disabled = true;
        submitBtn.style.backgroundColor = '#D9D9D9';
        submitBtn.style.cursor = 'not-allowed';
      } else {
        alert(result.message || '비밀번호 수정 실패');
      }
    }catch(error){
      console.error('Error:', error);
      alert('서버 통신 오류 발생');
    }

  });
  function showToast(message) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.position = 'fixed';
    toast.style.bottom = '40px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.backgroundColor = '#333';
    toast.style.color = '#fff';
    toast.style.padding = '10px 20px';
    toast.style.borderRadius = '6px';
    toast.style.fontSize = '0.9rem';
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    toast.style.zIndex = '9999';

    document.body.appendChild(toast);
    requestAnimationFrame(() => (toast.style.opacity = '1'));

    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  }
 
  });

loadUserProfileIcon();
