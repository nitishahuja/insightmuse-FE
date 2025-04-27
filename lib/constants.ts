export const loadingMessages = [
  "Shrinking that massive paper 📝",
  "Teaching AI to speed read 👀",
  "Extracting the good stuff 🧪",
  "Making science digestible 🍳",
  "Converting jargon to English 📚",
  "Filtering out the boring parts 🔍",
  "Translating academic-speak 🎓",
  "Compressing knowledge 🧠",
  "Finding the interesting bits 💎",
  "Turning complexity into clarity ✨",
  "Removing unnecessary citations [1][2][3] 📌",
  "Decoding professor-speak 🤓",
  "Separating science from sci-fi 🚀",
  "Making researchers cry less 😢",
  "Turning p-values into plain English 📊",
  "Extracting actual insights 💡",
  "Translating from PhD to human 🎭",
  "Removing academic posturing 🧐",
  "Finding the 'so what?' 🤔",
  "Cutting through the academic fluff ☁️",
]

export const errorMessages = {
  upload: "Oops! This paper is too spicy for our servers 🌶️",
  processing: "Our AI had a coffee break ☕ Try again?",
  notFound: "This paper pulled a disappearing act 🎩",
  timeout: "Taking too long... Maybe the paper is too complex? 🤔",
}

export const API_BASE = "http://127.0.0.1:8000"

export const API_ENDPOINTS = {
  UPLOAD: "/upload_pdf",
  TLDR: "/tldr",
  QNA: "/qna",
}

export const POLLING_INTERVAL = 3000 // 3 seconds
export const MAX_RETRIES = 3
