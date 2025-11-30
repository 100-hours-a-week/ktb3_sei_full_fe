import { setupDropdownMenu, setupDropdownActions } from './modules/dropdownMenu.js';
import { uploadFile } from "./modules/uploadFile.js";
import { showHelperText } from './modules/helperText.js'; 
import { loadUserProfileIcon } from './modules/profileIcon.js';
import { authFetch } from './modules/authFetch.js';


document.addEventListener('DOMContentLoaded', () => {
  setupDropdownActions();
  setupDropdownMenu();

  const backBtn = document.querySelector('.back-btn');
  const form = document.querySelector('.write-form');
  const titleInput = document.querySelector('.write-form input[type="text"]');
  const contentInput = document.querySelector('.write-form textarea');
  const imageInput = document.getElementById('image');
  const fileLabel = document.querySelector('.file-label');
  const submitBtn = document.querySelector('.submit-btn');

  backBtn.addEventListener('click', () => history.back());

  const postId = new URLSearchParams(window.location.search).get("postId");
  if (!postId) {
    alert("잘못된 접근입니다.");
    location.href = "/board.html";
    return;
  }

  let originalImageUrl = null;

  async function fetchPost() {
    const response = await authFetch(`http://127.0.0.1:8080/posts/${postId}`, {
      credentials: "include",
    });

    if (!response.ok) {
      alert("게시글을 불러올 수 없습니다.");
      location.href = "/board.html";
      return;
    }

    const result = await response.json();
    const post = result.data.post;

    titleInput.value = post.title;
    contentInput.value = post.content;

    if (post.imageUrl) {
      originalImageUrl = post.imageUrl.startsWith("http")
        ? post.imageUrl
        : "http://127.0.0.1:8080" + post.imageUrl;

      const filename = originalImageUrl.split("/").pop();
      fileLabel.textContent = filename;
    } else {
      originalImageUrl = null;
      fileLabel.textContent = "기존 파일명";
    }

    toggleButton();
  }

  fetchPost();

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
      submitBtn.style.backgroundColor = "#655447";
      submitBtn.style.cursor = "pointer";
      showHelperText(contentInput, '');
    } else {
      submitBtn.disabled = true;
      submitBtn.style.backgroundColor = "#655447";
      submitBtn.style.cursor = "not-allowed";
      showHelperText(contentInput, message);
    }
  }

  imageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    fileLabel.textContent = file ? file.name : (originalImageUrl ? originalImageUrl.split("/").pop() : '기존 파일명');
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = titleInput.value.trim();
    const content = contentInput.value.trim();

    if (!title || !content) {
      alert("제목과 내용을 모두 입력해주세요.");
      toggleButton();
      return;
    }

    let finalImageUrl = originalImageUrl;

    if (imageInput.files.length > 0) {
      const file = imageInput.files[0];
      const uploadedUrl = await uploadFile(file);
      if (!uploadedUrl) return;
      finalImageUrl = uploadedUrl;
    }

    try {
      const response = await authFetch(`http://127.0.0.1:8080/posts/${postId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: title,
          content: content,
          image_url: finalImageUrl,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert("게시글이 수정되었습니다.");
        location.href = `/board-detail.html?postId=${postId}`;
      } else {
        alert(result.message || "게시글 수정 실패");
      }

    } catch (error) {
      console.error("게시글 수정 오류:", error);
      alert("서버 오류가 발생했습니다.");
    }
  });
});



loadUserProfileIcon();
