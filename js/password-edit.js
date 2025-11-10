    const profileBtn = document.getElementById("profileBtn");
    const dropdownMenu = document.getElementById("dropdownMenu");

    profileBtn.addEventListener("click", (e) => {
      e.stopPropagation(); 
      dropdownMenu.classList.toggle("show");
    });

    document.addEventListener("click", (e) => {
      if (!dropdownMenu.contains(e.target) && e.target !== profileBtn) {
        dropdownMenu.classList.remove("show");
      }
    });