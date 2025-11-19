export function setupDropdownMenu(profileBtnId = 'profileBtn', menuId = 'dropdownMenu') {
  const profileBtn = document.getElementById(profileBtnId);
  const dropdownMenu = document.getElementById(menuId);

  if (!profileBtn || !dropdownMenu) return;

  profileBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdownMenu.classList.toggle('show');
  });

  document.addEventListener('click', (e) => {
    if (!dropdownMenu.contains(e.target) && e.target !== profileBtn) {
      dropdownMenu.classList.remove('show');
    }
  });

  dropdownMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      dropdownMenu.classList.remove('show');
    });
  });
}


export function setupDropdownActions(menuId = 'dropdownMenu') {
  const menu = document.getElementById(menuId);
  if (!menu) return;

  const links = menu.querySelectorAll('a');
  const [profileEdit, passwordEdit, logout] = links;

  if (profileEdit) {
    profileEdit.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = '/user-edit.html';
    });
  }

  if (passwordEdit) {
    passwordEdit.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = '/password-edit.html';
    });
  }

  if (logout) {
    logout.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('token');
      alert('로그아웃되었습니다.');
      window.location.href = '/welcome.html';
    });
  }
}
