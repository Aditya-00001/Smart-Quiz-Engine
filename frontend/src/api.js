const BaseURL = "http://localhost:8000/api";
const QuizURL = "http://localhost:8000/quiz";
export async function uploadFile(file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${BaseURL}/upload`, {
    method: "POST",
    body: formData
  });

  return res.json();
}

export async function parseText(rawText) {
  const res = await fetch(`${BaseURL}/parse`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ raw_text: rawText })
  });

  return res.json();
}

export async function getMyQuizzes(){
  const token = localStorage.getItem("token");
  const res = await fetch(`${QuizURL}/my`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
  return res.json();
}

export async function getQuizById(id){
  const res = await fetch(`${QuizURL}/${id}`);
  return res.json();
}



function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`
  };
}