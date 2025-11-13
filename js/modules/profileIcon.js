export async function loadUserProfileIcon() {
const profileIcon = document.getElementById("profileBtn");
  if (!profileIcon) return;

  try {
    const res = await fetch("http://127.0.0.1:8080/users/profile", { credentials: "include" });
    if (!res.ok) throw new Error("유저 정보를 불러올 수 없습니다.");
    const result = await res.json();
    const user = result.data;

    let profileUrl = user.profile_image;
    if (profileUrl && typeof profileUrl === "string") {
      profileIcon.src = profileUrl.startsWith("http")
        ? profileUrl
        : "http://127.0.0.1:8080" + profileUrl;
    } else {
      profileIcon.src = "/images/profile.png"; 
    }
  } catch (error) {
    console.error("프로필 아이콘 로드 실패:", error);
    profileIcon.src = "/images/profile.png";
  }
}
