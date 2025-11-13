import { setupDropdownMenu, setupDropdownActions } from './modules/dropdownMenu.js';
import { uploadFile } from "./modules/uploadFile.js";
import { showHelperText } from './modules/helperText.js'; 


document.addEventListener('DOMContentLoaded', () => {

  setupDropdownActions();
  setupDropdownMenu();

  const backBtn = document.querySelector('.back-btn');
  const form = document.querySelector('.write-form');
  const titleInput = document.getElementById('title');
  const contentInput = document.getElementById('content');
  const imageInput = document.getElementById('image');
  const fileLabel = document.querySelector('.file-label');
  const submitBtn = document.querySelector('.submit-btn');

  backBtn.addEventListener('click', () => {
    window.history.back();
  });

  submitBtn.disabled = true;
  submitBtn.style.backgroundColor = "#ACA0EB";


  imageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    fileLabel.textContent = file ? file.name : '파일을 선택해주세요.';
  });


  titleInput.addEventListener("input", () => {
    if (titleInput.value.length > 26) {
      titleInput.value = titleInput.value.slice(0, 26);
    }
    toggleButton();
  });

  contentInput.addEventListener("input", toggleButton);

  function toggleButton() {
      const isFilled = titleInput.value.trim() && contentInput.value.trim();
      const message = '* 제목, 내용을 모두 작성해주세요';

      if (isFilled) {
        submitBtn.disabled = false;
        submitBtn.style.backgroundColor = "#7F6AEE"; 
        submitBtn.style.cursor = "pointer";

        showHelperText(titleInput, '');
        showHelperText(contentInput, '');

      } else {
        submitBtn.disabled = true;
        submitBtn.style.backgroundColor = "#ACA0EB"; 
        submitBtn.style.cursor = "not-allowed";

        showHelperText(titleInput, '');
        showHelperText(contentInput,message); 
      }
    }
    
    toggleButton();
    

  form.addEventListener('submit', async (e) =>{
    e.preventDefault();

    const title = titleInput.value.trim();
    const content = contentInput.value.trim();

    if (!title || !content) {
      alert('제목과 내용을 모두 입력해주세요.');
      toggleButton(); 
      return;
    }

    let uploadedImageUrl = null;

    if(imageInput.files.length>0){
      const file = imageInput.files[0];
      uploadedImageUrl = await uploadFile(file);
      if(!uploadedImageUrl) return;
    }

    console.log("uploadedImageUrl:", uploadedImageUrl);

    try {
      const response = await fetch("http://127.0.0.1:8080/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: title,
          content: content,
          image_url: uploadedImageUrl,
        }),
     });
     const result = await response.json();

      if (response.ok) {
        alert("게시글 작성 완료!");
        window.location.href = "board.html";
      } else {
        alert(result.message || "게시글 작성 실패");
      }
    } catch (error) {
      console.error("게시글 작성 오류:", error);
      alert("서버 통신 중 오류가 발생했습니다.");
    }
  });
});