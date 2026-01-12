# 🕵️‍♂️ AI Public Integrity & Fraud Detection System

<div align="center">

![Fraud Detection Banner](https://img.shields.io/badge/AI-Fraud%20Detection-blue?style=for-the-badge&logo=python)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)

**A multi-module AI system designed to detect fraud, anomalies, and corruption in government public spending.**

[Features](#-features) • [Architecture](#-architecture) • [Installation](#-installation) • [API Reference](#-api-reference) • [Models](#-ml-models) • [Contributing](#-contributing)

</div>

---

## 📋 Overview

This project is a comprehensive fraud detection platform built for the **Hack4Delhi** hackathon. It leverages machine learning models to identify various types of financial irregularities in government spending, including ghost beneficiaries, bid rigging, spending anomalies, and suspicious legal documents.

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🏥 **Welfare & Healthcare Fraud Detection** | Detects ghost beneficiaries and overbilling in healthcare claims |
| 💰 **Treasury & Spending Anomaly Monitor** | Flags unusual transactions and structuring patterns |
| 📄 **Legal Document Scanner** | Analyzes contracts and documents for suspicious language |
| 🤝 **Bid Rigging & Collusion Hunter** | Identifies cartels and monopolistic vendor behavior |
| 🔐 **Secure Authentication** | JWT-based user authentication system |
| 📊 **Interactive Dashboard** | React-based frontend for easy data analysis |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           FRONTEND (React + Vite)                        │
│                         http://localhost:5173                            │
└─────────────────────────────────────────┬───────────────────────────────┘
                                          │
                    ┌─────────────────────┴─────────────────────┐
                    │                                           │
                    ▼                                           ▼
    ┌───────────────────────────────┐       ┌───────────────────────────────┐
    │   NODE.JS AUTH BACKEND        │       │   FASTAPI ML BACKEND          │
    │   (Express + MongoDB)         │       │   (Python + ML Models)        │
    │   http://localhost:5000       │◄──────│   http://localhost:8000       │
    │                               │       │                               │
    │   • User Authentication       │       │   • Spending Anomaly API      │
    │   • JWT Token Management      │       │   • Legal Document API        │
    │   • User Registration         │       │   • Welfare Fraud API         │
    └───────────────────────────────┘       │   • Bid Rigging API           │
                                            └───────────────────────────────┘
```

---

## 📁 Project Structure

```
Fraud_Detection/
├── 📂 frontend/
│   └── fraud_front/           # React + Vite frontend application
│       ├── src/
│       │   ├── pages/         # Login, Register, Home, Form pages
│       │   ├── components/    # Reusable UI components
│       │   ├── features/      # Redux slices and state
│       │   └── services/      # API service layer
│       └── package.json
│
├── 📂 backend/
│   ├── server.js              # Express.js entry point
│   ├── controllers/           # Auth controller
│   ├── models/                # MongoDB models (User)
│   ├── routes/                # API routes
│   ├── middleware/            # Auth middleware
│   └── backend-fastapi/       # FastAPI ML service
│       ├── main.py            # FastAPI entry point
│       ├── routers/           # API endpoint routers
│       ├── models/            # ML model loaders
│       └── schemas.py         # Pydantic schemas
│
├── 📂 llm/
│   ├── main.py                # Standalone FastAPI with ML models
│   ├── *.pkl                  # Trained ML model artifacts
│   ├── *.ipynb               # Jupyter notebooks for model training
│   └── requirements.txt       # Python dependencies
│
└── DOCUMENTATION.txt          # Model documentation
```

---

## 🚀 Installation

### Prerequisites

- **Node.js** v18+ 
- **Python** 3.10+
- **MongoDB** (local or Atlas)

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Yash-Vashishth/Fraud_Detection.git
cd Fraud_Detection
```

### 2️⃣ Setup Frontend

```bash
cd frontend/fraud_front
npm install
```

Create a `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
VITE_ML_API_URL=http://localhost:8000
```

### 3️⃣ Setup Node.js Backend (Authentication)

```bash
cd backend
npm install
```

Create a `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/fraud_detection
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
```

### 4️⃣ Setup FastAPI Backend (ML Models)

```bash
cd llm
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac

pip install -r requirements.txt
```

Create a `.env` file:
```env
NODE_AUTH_URL=http://localhost:5000/api
PORT=8000
```

---

## ▶️ Running the Application

### Start All Services

**Terminal 1 - Frontend:**
```bash
cd frontend/fraud_front
npm run dev
# → Runs on http://localhost:5173
```

**Terminal 2 - Node.js Backend:**
```bash
cd backend
npm run dev
# → Runs on http://localhost:5000
```

**Terminal 3 - FastAPI ML Backend:**
```bash
cd llm
python main.py
# → Runs on http://localhost:8000
```

---

## 📡 API Reference

### Authentication Endpoints (Node.js - Port 5000)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register new user |
| `POST` | `/api/auth/login` | User login |
| `GET` | `/api/auth/me` | Get current user |
| `GET` | `/api/health` | Health check |

### Fraud Detection Endpoints (FastAPI - Port 8000)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/analyze/bid-rigging` | Analyze bids for collusion |
| `POST` | `/api/analyze/legal-document` | Scan legal documents |
| `POST` | `/api/analyze/spending` | Detect spending anomalies |
| `POST` | `/api/analyze/welfare` | Analyze welfare fraud |
| `GET` | `/health` | Health check with model status |
| `GET` | `/docs` | Swagger API documentation |

### Example Request - Spending Anomaly

```bash
curl -X POST "http://localhost:8000/api/analyze/spending" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "department": "Public Works",
    "amount": 5000000,
    "category": "Infrastructure",
    "description": "Road construction project"
  }'
```

### Example Response

```json
{
  "success": true,
  "prediction": "Spending anomaly detected",
  "confidence": 0.87,
  "risk_level": "HIGH",
  "details": {
    "department": "Public Works",
    "amount": 5000000,
    "category": "Infrastructure",
    "analyzed_by": "user@example.com"
  }
}
```

---

## 🤖 ML Models

### Model Artifacts (`.pkl` files)

| Model | Algorithm | Purpose |
|-------|-----------|---------|
| `Welfare Delivery.pkl` | Random Forest | Detects ghost beneficiaries & overbilling |
| `spending_anomaly_model.pkl` | Isolation Forest | Flags unusual transactions |
| `legal_nlp_model.pkl` | Logistic Regression + TF-IDF | Analyzes document language |
| `text_vectorizer.pkl` | TF-IDF Vectorizer | Converts text to numeric features |
| `bid_rigging_graph.pkl` | NetworkX Graph | Network analysis for collusion |
| `vendor_names.pkl` | Dictionary | Vendor ID lookup |

### Training Notebooks

- `bid-rigging-collusion-detector.ipynb` - Bid rigging detection model
- `legal-document-scanner.ipynb` - Legal NLP model
- `spending-anomaly-model.ipynb` - Spending anomaly detection
- `welfare-delivery.ipynb` - Welfare fraud detection

---

## 🔧 Tech Stack

### Frontend
- **React 19** - UI Framework
- **Vite** - Build tool
- **Redux Toolkit** - State management
- **React Router DOM** - Navigation
- **Tailwind CSS** - Styling
- **Styled Components** - CSS-in-JS
- **Axios** - HTTP client

### Backend (Authentication)
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Backend (ML/AI)
- **Python 3.10+** - Runtime
- **FastAPI** - Web framework
- **Uvicorn** - ASGI server
- **Scikit-learn** - ML algorithms
- **Pandas & NumPy** - Data processing
- **NetworkX** - Graph analysis

---

## 🧪 Testing

### API Health Check

```bash
# Node.js Backend
curl http://localhost:5000/api/health

# FastAPI Backend
curl http://localhost:8000/health
```

### Run Frontend Tests

```bash
cd frontend/fraud_front
npm run lint
```

---

## 📊 Screenshots

> Add screenshots of your application here

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

Built with ❤️ for **Hack4Delhi 2026**

---

## 📞 Support

For support, please open an issue in the GitHub repository or contact the team.

---

<div align="center">

**⭐ Star this repo if you find it useful!**

</div>
