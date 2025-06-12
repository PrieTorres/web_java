# Projeto Web com Spring Boot + Next.js

Este projeto contém um backend em **Java com Spring Boot** e um frontend em **Next.js**, conectados e integrados com **Firebase Firestore** como banco de dados.

---

## 🚀 Instruções para rodar a aplicação localmente

### ✅ Pré-requisitos

- Java JDK 17+
- Node.js 18+
- Maven (ou o wrapper `./mvnw`)
- Yarn ou npm
- Conta no [Firebase Console](https://console.firebase.google.com) com Firestore habilitado

---

backend/
├── src/main/java/com/example/backend/
│   ├── BackendApplication.java
│   ├── FirebaseInitializer.java
│   ├── CorsConfig.java
│   └── controllers/
│       └── FirebaseController.java
└── src/main/resources/
    └── firebase-service-account.json

frontend/
├── pages/
│   └── index.tsx
├── package.json
└── next.config.js



## 📦 Backend (Spring Boot)

### ▶️ Iniciar o servidor

```bash
cd backend
./mvnw clean install
./mvnw spring-boot:run


firebase login
firebase init
firebase deploy
