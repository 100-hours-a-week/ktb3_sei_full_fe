export async function authFetch(url, options = {}){
    options.credentials = "include";

    const isFormData = options.body instanceof FormData;

    options.headers = {
        ...(options.headers || {}),
    };

    if (!isFormData) {
        options.headers["Content-Type"] = "application/json";
    }

    const response = await fetch(url,options);

    if(response.status === 401){
        alert("로그인이 필요합니다.");
            window.location.href = "/index.html";
            return;

    }
    return response;
}

