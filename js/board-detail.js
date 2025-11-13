import { setupDropdownMenu, setupDropdownActions } from './modules/dropdownMenu.js';
import { loadUserProfileIcon } from './modules/profileIcon.js';


const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get("postId");
if (!postId) {
  alert("잘못된 접근입니다.");
  window.location.href = "/posts.html";
}

const titleEl = document.querySelector(".post-title");
const authorNameEl = document.querySelector(".author-name");
const dateEl = document.querySelector(".post-date");
const imageEl = document.querySelector(".post-image");
const contentEl = document.querySelector(".post-content");

const likeCountBox = document.querySelector(".count-box div:nth-child(1)");
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
const cancelCommentDelete = document.getElementById('cancelCommentDelete');
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
  const response = await fetch(`http://127.0.0.1:8080/posts/${postId}`, {
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
  likeCountBox.innerHTML = `<span>${formatNumber(currentLikeCount)}</span><br>좋아요수`;

  if (isLiked) {
    likeCountBox.style.backgroundColor = "#ACA0EB";
  } else {
    likeCountBox.style.backgroundColor = "#D9D9D9";
  }
}

function renderPost(post) {
  titleEl.textContent = post.title;
  authorNameEl.textContent = post.nickname;
  dateEl.textContent = post.createdAt;

  let imgUrl = post.imageUrl;
  if (imgUrl && !imgUrl.startsWith("http")) {
    imgUrl = "http://127.0.0.1:8080" + imgUrl;
  }
  if (imgUrl) imageEl.src = imgUrl.trim();

  contentEl.textContent = post.content;

  currentLikeCount = post.likeCount;
  isLiked = post.isLiked === true;

  updateLikeUI();

  viewCountBox.innerHTML = `<span>${formatNumber(post.viewCount)}</span><br>조회수`;
  commentCountBox.innerHTML = `<span>${formatNumber(post.commentCount)}</span><br>댓글`;
}

async function toggleLike() {
  try {
    const response = await fetch(`http://127.0.0.1:8080/posts/${postId}/likes`, {
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

    node.innerHTML = `
      <div class="comment-left">
        <div class="comment-author-img"></div>
        <div>
          <p class="author-name">${c.nickname}</p>
          <p class="comment-meta">${c.created_at}</p>
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
      commentBtn.textContent = "댓글 수정";
      commentBtn.style.backgroundColor = "#7F6AEE";
    });

    node.querySelector(".delete-comment").addEventListener("click", () => {
      deletingCommentId = c.id;
      commentDeleteModal.style.display = 'flex';
    });

    commentListEl.appendChild(node);
  });

  commentCountBox.innerHTML = `<span>${formatNumber(comments.length)}</span><br>댓글`;
}

commentTextarea.addEventListener("input", () => {
  const empty = commentTextarea.value.trim() === "";
  commentBtn.disabled = empty;
  commentBtn.style.backgroundColor = empty ? "#ACA0EB" : "#7F6AEE";
});

commentBtn.addEventListener("click", async () => {
  const content = commentTextarea.value.trim();
  if (!content) return;

  if (editingCommentId) {
    await fetch(`http://127.0.0.1:8080/posts/${postId}/comments/${editingCommentId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ content }),
    });
  } else {
    await fetch(`http://127.0.0.1:8080/posts/${postId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ content }),
    });
  }

  editingCommentId = null;
  commentTextarea.value = "";
  commentBtn.textContent = "댓글 등록";
  commentBtn.style.backgroundColor = "#ACA0EB";

  fetchPostDetail();
});

confirmCommentDelete.addEventListener("click", async () => {
  if (!deletingCommentId) return;

  await fetch(`http://127.0.0.1:8080/posts/${postId}/comments/${deletingCommentId}`, {
    method: "DELETE",
    credentials: "include",
  });

  deletingCommentId = null;
  commentDeleteModal.style.display = "none";
  fetchPostDetail();
});

editPostBtn.addEventListener("click", () => {
  window.location.href = `/board-edit.html?postId=${postId}`;
});

confirmPostDelete.addEventListener("click", async () => {
  await fetch(`http://127.0.0.1:8080/posts/${postId}`, {
    method: "DELETE",
    credentials: "include",
  });
  alert("게시글이 삭제되었습니다.");
  window.location.href = "/board.html";
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

