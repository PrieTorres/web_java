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

```

### ⚙️ Configurar Firebase

1. Crie um projeto no Firebase e habilite o login com Google
2. Adicione seu domínio (por exemplo `http://localhost:3000`) na lista de
   domínios autorizados em **Authentication > Settings > Authorized domains**
3. Crie um arquivo `.env.local` dentro da pasta `frontend` com as chaves abaixo:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=SuaApiKey
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seuProjeto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seuProjetoId
NEXT_PUBLIC_FIREBASE_APP_ID=SeuAppId
```

