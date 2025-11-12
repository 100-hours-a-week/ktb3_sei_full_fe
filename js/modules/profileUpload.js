export function setupProfileUpload(profileCircle) {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*';
  fileInput.style.display = 'none';
  document.body.appendChild(fileInput);

  let selectedImagePath = null;

  profileCircle.addEventListener('click', () => fileInput.click());

  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

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

    selectedImagePath = file.name;

  });

    return () => selectedImagePath;

  
}
