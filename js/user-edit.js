import { checkNicknameDuplication } from './modules/validateNickname.js';
import { showHelperText } from './modules/helperText.js';
import { setupProfileUpload } from './modules/profileUpload.js';
    
    
document.addEventListener('DOMContentLoaded', ()=>{

      const profileBtn = document.getElementById('profileBtn');
    const dropdownMenu = document.getElementById('dropdownMenu');
    profileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdownMenu.classList.toggle('show');
    });
    document.addEventListener('click', (e) => {
      if (!dropdownMenu.contains(e.target) && e.target !== profileBtn) {
        dropdownMenu.classList.remove('show');
      }
    });

    const profileCircle = document.querySelector('.profile-circle');
    const getSelectedImage = setupProfileUpload(profileCircle);

    const nicknameInput = document.querySelector('.form-group input[placeholder]');
    const editBtn = document.querySelector('.small-btn');
    const submitBtn = document.querySelector('.submit-btn');
  
});
    


  
    const modalOverlay = document.getElementById('modalOverlay');
    const openModalBtn = document.getElementById('openModal');
    const cancelModalBtn = document.getElementById('cancelModal');
    const confirmModalBtn = document.getElementById('confirmModal');

    openModalBtn.addEventListener('click', () => {
      modalOverlay.style.display = 'flex';
    });

    cancelModalBtn.addEventListener('click', () => {
      modalOverlay.style.display = 'none';
    });

    confirmModalBtn.addEventListener('click', () => {
      modalOverlay.style.display = 'none';
      alert('회원탈퇴가 완료되었습니다.'); 
    });