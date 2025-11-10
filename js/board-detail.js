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

    const postDeleteBtn = document.querySelector('.delete-post');
    const postDeleteModal = document.getElementById('postDeleteModal');
    const cancelPostDelete = document.getElementById('cancelPostDelete');
    const confirmPostDelete = document.getElementById('confirmPostDelete');

    postDeleteBtn.addEventListener('click', () => {
      postDeleteModal.style.display = 'flex';
    });
    cancelPostDelete.addEventListener('click', () => {
      postDeleteModal.style.display = 'none';
    });
    confirmPostDelete.addEventListener('click', () => {
      postDeleteModal.style.display = 'none';
      alert('게시글이 삭제되었습니다.');
    });

    const commentDeleteBtns = document.querySelectorAll('.delete-comment');
    const commentDeleteModal = document.getElementById('commentDeleteModal');
    const cancelCommentDelete = document.getElementById('cancelCommentDelete');
    const confirmCommentDelete = document.getElementById('confirmCommentDelete');

    commentDeleteBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        commentDeleteModal.style.display = 'flex';
      });
    });
    cancelCommentDelete.addEventListener('click', () => {
      commentDeleteModal.style.display = 'none';
    });
    confirmCommentDelete.addEventListener('click', () => {
      commentDeleteModal.style.display = 'none';
      alert('댓글이 삭제되었습니다.');
    });

    window.addEventListener('click', (e) => {
      if (e.target === postDeleteModal) postDeleteModal.style.display = 'none';
      if (e.target === commentDeleteModal) commentDeleteModal.style.display = 'none';
    });