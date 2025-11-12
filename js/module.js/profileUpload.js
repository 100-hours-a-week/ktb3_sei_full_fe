export function setupProfileUpload(profileCircle,uploadUrl){
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);

    let uploadedImageUrl = null;

    profileCircle.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', async(e) =>{
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

        const foemData = new FormData();
        foemData.append('file', file);

        try {
            const res = await fetch(uploadUrl, {
            method: 'POST',
            body: formData,
        });

        if (!res.ok) throw new Error('이미지 업로드 실패');

        const data = await res.json();
        uploadedImageUrl = data.url; 
        console.log('업로드 성공:', uploadedImageUrl);
     }  catch (error) {
        console.error('업로드 오류:', error);
        alert('이미지 업로드 중 문제가 발생했습니다.');
        uploadedImageUrl = null;
        }

        return () => uploadedImageUrl;

    });





    }