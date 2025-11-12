import { checkNicknameDuplication } from './modules/validateNickname.js';
import { showHelperText } from './modules/helperText.js';
import {}
    
    
    
    
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