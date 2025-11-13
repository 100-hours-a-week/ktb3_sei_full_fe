export async function uploadFile(file, uploadUrl = "http://localhost:8080/images/upload") {
  if (!file) return null;

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(uploadUrl, {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    const result = await response.json();

    if (response.ok) {
      return result.url;    

    } else {
      alert(result.message || "파일 업로드 실패");
      return null;
    }

  } catch (error) {
    console.error("업로드 에러:", error);
    alert("서버 오류");
    return null;
  }
}
