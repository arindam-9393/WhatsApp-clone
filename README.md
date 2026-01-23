<div align="center">

  <img src="https://capsule-render.vercel.app/api?type=waving&color=8b5cf6&height=220&section=header&text=Chatty&fontSize=80&fontColor=ffffff&fontAlign=50&animation=fadeIn" alt="Chatty Header" />

  <h2 align="center">📹 Connect Beyond Text: Video, Voice & Chat</h2>

  <p align="center">
    <b>Low Latency WebRTC Calls | Secure Google Auth | Instant Media Sharing</b>
  </p>

  <p align="center">
    <a href="#">
      <img src="https://img.shields.io/badge/🚀_Live_Demo-Coming_Soon-8b5cf6?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo" />
    </a>
    <a href="https://github.com/arindam-9393/chatty/stargazers">
      <img src="https://img.shields.io/github/stars/arindam-9393/chatty?style=for-the-badge&color=fbbf24" alt="Stars" />
    </a>
    <a href="https://github.com/arindam-9393/chatty/issues">
      <img src="https://img.shields.io/github/issues/arindam-9393/chatty?style=for-the-badge&color=fbbf24" alt="Issues" />
    </a>
  </p>
</div>

---

## 📖 About The Project

**Chatty** is not just another messaging app; it's a full-duplex communication suite. While most chat apps handle text, Chatty bridges the gap by integrating **Peer-to-Peer (P2P) Video and Voice calling** directly into the browser.

By leveraging **WebRTC** for streams and **Socket.io** for signaling, this application ensures near-zero latency communication. It also solves the challenge of heavy media storage by integrating **Cloudinary** for seamless image and file sharing.

---

## ✨ Key Features

### 📡 Real-Time Communication
* **Video & Voice Calls:** High-quality, low-latency P2P calls using WebRTC.
* **Instant Messaging:** Messages delivered instantly via Socket.io websockets.
* **Typing Indicators:** Real-time feedback when a user is composing a message.
* **Online/Offline Status:** Live user presence tracking.

### 🔐 Security & UX
* **Google OAuth:** One-click secure login/signup strategy.
* **Cloudinary Integration:** Fast and optimized image/media uploads in chat.
* **Group Chats:** Create rooms for multiple users (Text).
* **Responsive Design:** Optimized for Desktop and Mobile viewports.

---

## 📸 Screenshots

<div align="center">
  <img src="./assets/chat-interface.png" alt="Chat Interface" width="700" style="border-radius: 10px; border: 1px solid #333;">
  <br>
  <i>Clean interface with integrated video calling capabilities.</i>
</div>

---

## 🛠️ Tech Stack

Engineered for speed and scalability.

| Component | Technology | Role |
| :--- | :--- | :--- |
| **Real-Time Engine** | ![Socket.io](https://img.shields.io/badge/Socket.io-black?style=flat&logo=socket.io&badgeColor=010101) | Signaling server and text message transport. |
| **Streaming** | ![WebRTC](https://img.shields.io/badge/WebRTC-333333?style=flat&logo=webrtc&logoColor=white) | Peer-to-peer audio and video streaming. |
| **Frontend** | ![React](https://img.shields.io/badge/React-20232a?style=flat&logo=react&logoColor=61DAFB) | Dynamic UI with Redux/Context API for state management. |
| **Backend** | ![NodeJS](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white) | REST API and WebSocket handling. |
| **Database** | ![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat&logo=mongodb&logoColor=white) | Storing chat history and user profiles. |
| **Media Cloud** | ![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=flat&logo=cloudinary&logoColor=white) | Optimized storage for shared images/files. |
| **Auth** | ![Google](https://img.shields.io/badge/Google_Auth-4285F4?style=flat&logo=google&logoColor=white) | OAuth2.0 implementation. |

---

## 🚀 Getting Started

To run Chatty locally, you need to configure the environment variables for Google Auth and Cloudinary.

### Prerequisites

* Node.js (v14+)
* MongoDB
* Cloudinary Account
* Google Cloud Console Project (for OAuth keys)

### Installation

1.  **Clone the Repo**
    ```bash
    git clone [https://github.com/arindam-9393/chatty.git](https://github.com/arindam-9393/chatty.git)
    cd chatty
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    cd client
    npm install
    ```

3.  **Setup .env file**
    Create a `.env` file in the root directory:
    ```env
    PORT=5000
    MONGO_URI=your_mongo_db_string
    JWT_SECRET=your_jwt_secret
    
    # Cloudinary
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_key
    CLOUDINARY_API_SECRET=your_secret

    # Google Auth
    GOOGLE_CLIENT_ID=your_google_client_id
    GOOGLE_CLIENT_SECRET=your_google_client_secret
    CLIENT_URL=http://localhost:3000
    ```

4.  **Run the App**
    ```bash
    # Run backend and frontend concurrently
    npm run dev
    ```

---

## 🔮 Roadmap

- [ ] **Screen Sharing:** Allow users to share screens during video calls.
- [ ] **End-to-End Encryption:** Enhance security for message content.
- [ ] **Group Video Calls:** Implementing SFU (Selective Forwarding Unit) for multi-user video.
- [ ] **Mobile App:** React Native port.

---

## 👨‍💻 Author

<div align="center">
  <img src="https://github.com/arindam-9393.png" width="100px" style="border-radius: 50%;">
  <br>
  <b>Arindam Mriganka Sengupta</b>
  <br>
  <i>Full Stack Engineer | Real-Time Systems Specialist</i>
  <br><br>
  <a href="https://www.linkedin.com/in/arindam-sengupta-5803ab260/">
    <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" />
  </a>
  <a href="mailto:arindamsengupta93@gmail.com">
    <img src="https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white" alt="Gmail" />
  </a>
</div>

---

<div align="center">
  <i>Liked this project? Give it a ⭐️ to support development!</i>
</div>
