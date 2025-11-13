import { setupDropdownMenu, setupDropdownActions } from './modules/dropdownMenu.js';
import { showHelperText } from './modules/helperText.js';
import { checkNicknameDuplication } from './modules/validateNickname.js';
import { uploadFile } from './modules/uploadFile.js';
import { loadUserProfileIcon } from './modules/profileIcon.js';

const profileCircle = document.querySelector(".profile-circle");
const profileImg = document.getElementById("profileImage");
const profileInput = document.getElementById("profileInput");

const nicknameInput = document.querySelector('.form-group input[type="text"]:not([readonly])');
const helperText = document.getElementById("nickname-helper");

const editBtn = document.querySelector(".small-btn");
const submitBtn = document.querySelector(".submit-btn");
const deleteBtn = document.getElementById("openModal");

const modalOverlay = document.getElementById("modalOverlay");
const cancelModal = document.getElementById("cancelModal");
const confirmModal = document.getElementById("confirmModal");

let selectedProfileFile = null;
let isNicknameValid = true;
let originalNickname = "";

async function loadProfile() {
  try {
    const res = await fetch("http://127.0.0.1:8080/users/profile", { credentials: "include" });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "불러오기 실패");

    const user = result.data;

    const emailInput = document.querySelector('.form-group input[readonly]');
    emailInput.value = user.email;

    originalNickname = user.nickname;
    nicknameInput.value = user.nickname;

    const profileUrl = user.profile_image;
    if (profileUrl && typeof profileUrl === "string") {
      profileImg.src = profileUrl.startsWith("http")
        ? profileUrl
        : "http://127.0.0.1:8080" + profileUrl;
    } else {
      profileImg.src = "/images/profile.png";
    }

    console.log("프로필 이미지 로드됨:", profileImg.src);
  } catch (error) {
    console.error("프로필 불러오기 오류:", error);
  }
}

profileCircle.addEventListener("click", () => profileInput.click());

profileInput.addEventListener("change", async () => {
  const file = profileInput.files[0];
  if (!file) return;

  selectedProfileFile = file;

  const reader = new FileReader();
  reader.onload = (e) => {
    profileImg.src = e.target.result;
  };
  reader.readAsDataURL(file);

  const uploadedUrl = await uploadFile(file);
  if (uploadedUrl) {
    console.log("업로드 완료 URL:", uploadedUrl);
    selectedProfileFile = null; 
    profileImg.dataset.uploadedUrl = uploadedUrl; 
  }
});

nicknameInput.addEventListener("input", async () => {
  const nickname = nicknameInput.value.trim();

  if (nickname === "") {
    showHelperText(nicknameInput, "닉네임을 입력해주세요");
    isNicknameValid = false;
    return;
  }

  if (nickname.length > 10) {
    showHelperText(nicknameInput, "닉네임은 최대 10자까지 작성 가능합니다.");
    isNicknameValid = false;
    return;
  }

  if (nickname === originalNickname) {
    showHelperText(nicknameInput, "");
    isNicknameValid = true;
    return;
  }

  const ok = await checkNicknameDuplication(nicknameInput);
  if (ok) showHelperText(nicknameInput, "");
  isNicknameValid = ok;
});

editBtn.addEventListener("click", async () => {
  const nickname = nicknameInput.value.trim();
  if (!isNicknameValid || nickname === "") return;

  const profileUrl =
    profileImg.dataset.uploadedUrl ||
    (profileImg.src.includes("http://127.0.0.1:8080")
      ? profileImg.src.replace("http://127.0.0.1:8080", "")
      : null);

  try {
    const res = await fetch("http://127.0.0.1:8080/users/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        nickname,
        profile_image: profileUrl,
      }),
    });

    if (!res.ok) throw new Error("수정 실패");
    alert("회원정보가 수정되었습니다!");
    window.location.reload();
  } catch (err) {
    console.error("수정 오류:", err);
    alert("프로필 수정 중 오류가 발생했습니다.");
  }
});

deleteBtn.addEventListener("click", () => {
  modalOverlay.style.display = "flex";
});
cancelModal.addEventListener("click", () => {
  modalOverlay.style.display = "none";
});
confirmModal.addEventListener("click", async () => {
  await fetch("http://127.0.0.1:8080/users/profile", {
    method: "DELETE",
    credentials: "include",
  });

  alert("회원 탈퇴가 완료되었습니다.");
  window.location.href = "/index.html";
});

document.querySelector(".back-btn").addEventListener("click", () => history.back());
setupDropdownMenu();
setupDropdownActions();
loadProfile();
loadUserProfileIcon();
