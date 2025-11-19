import { setupDropdownMenu, setupDropdownActions } from './modules/dropdownMenu.js';
import { loadUserProfileIcon } from './modules/profileIcon.js';

document.addEventListener('DOMContentLoaded',() => {
  setupDropdownMenu();
  setupDropdownActions();

  const postList = document.querySelector('.post-list');
  const writeBtn = document.querySelector('.write-btn');
  
  let page = 1;
  const size = 10;
  let isLoading = false;
  let hasMore = true;

  writeBtn.addEventListener('click', () => {
    window.location.href = '/board-write.html';
  });

  function formatCount(count) {
    if (count >= 100000) return `${Math.floor(count / 1000)}k`;
    if (count >= 10000) return `${Math.floor(count / 1000)}k`;
    if (count >= 1000) return `${Math.floor(count / 1000)}k`;
    return count;
  }

  function formatDate(dateStr) {
    const date = new Date(dateStr);
    if (isNaN(date)) return '';
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
  }

  function renderPost(post) {
    const title = post.title.length > 26 ? post.title.slice(0, 26) + '...' : post.title;
    const date = formatDate(post.createdAt || post.created_at || post.created_time);
    const likeCount = formatCount(post.likeCount || 0);
    const commentCount = formatCount(post.commentCount || 0);
    const viewCount = formatCount(post.viewCount || 0);

    const card = document.createElement('div');
    card.classList.add('post-card');
    card.innerHTML = `
    <div class="author-row">
        <div class="author-img" style="background-image:url('${post.authorImageUrl || ''}')"></div>
        <p class="author-name">${post.nickname || '익명 사용자'}</p>
        <span class="date">${date}</span>
    </div>

    <div class="post-title">${title}</div>

    <div class="meta">
        좋아요 ${likeCount} &nbsp;&nbsp;
        조회수 ${viewCount} &nbsp;&nbsp;
        댓글 ${commentCount}
    </div>
  `;

    card.addEventListener('click', () => {
      window.location.href = `/board-detail.html?postId=${post.id}`;
    });

    postList.appendChild(card);
  }

  async function loadPosts() {
    if (isLoading || !hasMore) return;
    isLoading = true;

    try {
      const response = await fetch(`http://localhost:8080/posts?page=${page}&size=${size}&sort=created_at,desc`, {
        credentials: 'include',
      });

      if (!response.ok) throw new Error('게시글 목록을 불러오지 못했습니다.');

      const result = await response.json();
      const posts = result.data.content || result.data.posts || [];

      if (posts.length === 0) {
        hasMore = false;
        return;
      }

      posts.forEach(renderPost);
      page++;
    } catch (error) {
      console.error('Error:', error);
    } finally {
      isLoading = false;
    }
  }

  window.addEventListener('scroll', () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      loadPosts();
    }
  });

  loadPosts();


});
loadUserProfileIcon();
