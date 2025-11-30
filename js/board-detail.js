import { setupDropdownMenu, setupDropdownActions } from './modules/dropdownMenu.js';
import { loadUserProfileIcon } from './modules/profileIcon.js';
import { authFetch } from './modules/authFetch.js';



const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get("postId");
if (!postId) {
  alert("잘못된 접근입니다.");
  window.location.href = "/board.html";
}

const titleEl = document.querySelector(".post-title");
const authorNameEl = document.querySelector(".author-name");
const dateEl = document.querySelector(".post-date");
const imageEl = document.querySelector(".post-image");
const contentEl = document.querySelector(".post-content");

const likeCountBox = document.querySelector(".like-box");
const viewCountBox = document.querySelector(".count-box div:nth-child(2)");
const commentCountBox = document.querySelector(".count-box div:nth-child(3)");

const commentTextarea = document.querySelector(".comment-input textarea");
const commentBtn = document.querySelector(".comment-btn");
const commentListEl = document.querySelector(".comment-list");

const editPostBtn = document.querySelector(".edit-post");
const deletePostBtn = document.querySelector(".delete-post");

const postDeleteModal = document.getElementById('postDeleteModal');
const cancelPostDelete = document.getElementById('cancelPostDelete');
const confirmPostDelete = document.getElementById('confirmPostDelete');

const commentDeleteModal = document.getElementById('commentDeleteModal');
const confirmCommentDelete = document.getElementById('confirmCommentDelete');

let deletingCommentId = null;
let editingCommentId = null;

let isLiked = false;
let currentLikeCount = 0;

function formatNumber(num) {
  if (num >= 100000) return Math.floor(num / 1000) + "k";
  if (num >= 10000) return Math.floor(num / 1000) + "k";
  if (num >= 1000) return Math.floor(num / 100) / 10 + "k";
  return num;
}

async function fetchPostDetail() {
  const response = await authFetch(`http://127.0.0.1:8080/posts/${postId}`, {
    credentials: "include",
  });
  const result = await response.json();
  if (!response.ok) return;

  const post = result.data.post;
  const comments = result.data.comments;

  renderPost(post);
  renderComments(comments);
}

function updateLikeUI() {
  likeCountBox.innerHTML =
    `<span class="count-number">${formatNumber(currentLikeCount)}</span>
     <span class="count-label">좋아요수</span>`;

  if (isLiked) {
    likeCountBox.style.backgroundColor = "#DCE7D3";
    likeCountBox.style.border = "2px solid #92A583";
  } else {
    likeCountBox.style.backgroundColor = "#FFFFFF";  
    likeCountBox.style.border = "2px solid #E5E5E0";
  }
}


function renderPost(post) {
 

  titleEl.textContent = post.title;
  authorNameEl.textContent = post.nickname;
  dateEl.textContent = post.createdAt;

  let imgUrl = post.image_url;

  if (!imgUrl || imgUrl.trim() === "") {
    imageEl.style.display = "none";   // ← 회색 네모 숨기기
  } else{
  
  if (imgUrl && !imgUrl.startsWith("http")) {
    imgUrl = "http://127.0.0.1:8080" + imgUrl;
  }
  if (imgUrl) imageEl.src = imgUrl.trim();
     imageEl.style.display = "block";
  }
  contentEl.textContent = post.content;

  currentLikeCount = post.likeCount;
  isLiked = post.isLiked === true;

  updateLikeUI();

  viewCountBox.innerHTML =
    `<span class="count-number">${formatNumber(post.viewCount)}</span>
     <span class="count-label">조회수</span>`;
   commentCountBox.innerHTML =
      `<span class="count-number">${formatNumber(post.commentCount)}</span>
      <span class="count-label">댓글</span>`;
    }

async function toggleLike() {
  try {
    const response = await authFetch(`http://127.0.0.1:8080/posts/${postId}/likes`, {
      method: "POST",
      credentials: "include",
    });
    const result = await response.json();
    const likedNow = result.data.isLiked;

    if (likedNow) currentLikeCount += 1;
    else currentLikeCount -= 1;

    isLiked = likedNow;
    updateLikeUI();
  } catch (e) {
    console.error("좋아요 실패", e);
  }
}

likeCountBox.addEventListener("click", toggleLike);

function renderComments(comments) {
  commentListEl.innerHTML = "";

  comments.forEach((c) => {
    const node = document.createElement("div");
    node.classList.add("comment");
    node.dataset.id = c.id;

    const profileUrl = c.profileImageUrl
      ? `http://127.0.0.1:8080${c.profileImageUrl}`
      : '/images/profile.png';

    node.innerHTML = `
      <div class="comment-left">
<div class="comment-author-img" style="background-image:url('${profileUrl}')"></div>        <div>
          <p class="author-name">${c.nickname}</p>
          <p class="comment-meta">${c.createdAt}</p>
          <p class="comment-body">${c.content}</p>
        </div>
      </div>
      <div class="comment-actions">
        <button class="edit-comment">수정</button>
        <button class="delete-comment">삭제</button>
      </div>
    `;

    node.querySelector(".edit-comment").addEventListener("click", () => {
      editingCommentId = c.id;
      commentTextarea.value = c.content;
      commentBtn.textContent = "CONFIRM";
      commentBtn.style.backgroundColor = "#665A51";
    });

    node.querySelector(".delete-comment").addEventListener("click", () => {
      deletingCommentId = c.id;
      commentDeleteModal.style.display = 'flex';
    });

    commentListEl.appendChild(node);
  });

    commentCountBox.innerHTML =
      `<span class="count-number">${formatNumber(comments.length)}</span>
      <span class="count-label">댓글</span>`;
}

commentTextarea.addEventListener("input", () => {
  const empty = commentTextarea.value.trim() === "";
  commentBtn.disabled = empty;
  commentBtn.style.backgroundColor = empty ? "#665A51" : "#665A51";
});

commentBtn.addEventListener("click", async () => {
  const content = commentTextarea.value.trim();
  if (!content) return;


  try{
    let response;
    if (editingCommentId) {
      response = await authFetch(`http://127.0.0.1:8080/posts/${postId}/comments/${editingCommentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ content }),
      });
    } else {
      response = await authFetch(`http://127.0.0.1:8080/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ content }),
      });
  }
  if (!response.ok) {
      const message = (await response.json())?.message || "서버 오류가 발생했습니다.";
      alert(`댓글 등록 실패: ${message}`);
      return;
    }

  editingCommentId = null;
  commentTextarea.value = "";
  commentBtn.textContent = "POST";
  commentBtn.style.backgroundColor = "#665A51";

  fetchPostDetail();
  }catch(err){
    console.error("댓글 등록 중 오류:", err);
    alert("네트워크 오류가 발생했습니다.");
  }
});



confirmCommentDelete.addEventListener("click", async () => {
  if (!deletingCommentId) return;

  try {
    const response = await authFetch(`http://127.0.0.1:8080/posts/${postId}/comments/${deletingCommentId}`, {
      method: "DELETE",
      credentials: "include",
    });

    const result = await response.json();

    if (!response.ok) {
      alert(result.message || "본인 댓글만 삭제할 수 있습니다.");
      return; 
    }

    
    alert("댓글이 삭제되었습니다.");
    deletingCommentId = null;
    commentDeleteModal.style.display = "none";
    fetchPostDetail();

  } catch (e) {
    console.error(e);
    alert("댓글 삭제 중 오류가 발생했습니다.");
  }
});




editPostBtn.addEventListener("click", () => {
  window.location.href = `/board-edit.html?postId=${postId}`;
});



confirmPostDelete.addEventListener("click", async () => {
  try {
    const response = await authFetch(`http://127.0.0.1:8080/posts/${postId}`, {
      method: "DELETE",
      credentials: "include",
    });

    const result = await response.json();

    if (!response.ok) {
      // 백엔드에서 권한 부족 메시지를 보낸 경우
      alert(result.message || "본인 게시글만 삭제할 수 있습니다.");
      postDeleteModal.style.display = "none";
      return;
    }

    // 성공한 경우
    alert("게시글이 삭제되었습니다.");
    window.location.href = "/board.html";

  } catch (e) {
    console.error(e);
    alert("삭제 중 오류가 발생했습니다.");
  }
});




deletePostBtn.addEventListener('click', () => {
  postDeleteModal.style.display = 'flex';
});
cancelPostDelete.addEventListener('click', () => {
  postDeleteModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
  if (e.target === postDeleteModal) postDeleteModal.style.display = 'none';
  if (e.target === commentDeleteModal) commentDeleteModal.style.display = 'none';
});

fetchPostDetail();
setupDropdownMenu();
setupDropdownActions();

document.querySelector(".back-btn").addEventListener("click", () => {
  window.location.href = "./board.html"; 
});

loadUserProfileIcon();

