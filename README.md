# 🔍 QueryLens — MySQL Execution Plan Visualizer

*QueryLens* is a full-stack web app that helps SQL developers visualize and understand MySQL query execution plans using EXPLAIN FORMAT=JSON.  
Built with React, Node.js, MongoDB, and D3.js.

---

## 🚀 Features

- 🔐 User login & signup system
- 📄 Input any valid MySQL query
- ⚙ Runs EXPLAIN FORMAT=JSON and parses output
- 🌳 Interactive tree view of the execution plan using D3
- 🧾 Clean, readable JSON preview
- 🗂 Query history per user
- 🔄 Runs frontend and backend concurrently using npm run both

---

## 📸 Screenshots

| JSON Preview | Tree View |
|--------------|-----------|
![Screenshot 2025-06-28 152121](https://github.com/user-attachments/assets/e0f495ca-90e6-490d-9f34-e08d86ff19cd)

|![Screenshot 2025-06-28 152156](https://github.com/user-attachments/assets/ea83f03d-435b-454d-813e-bb72c707fd13)|

---

## 🛠 Tech Stack

| Layer      | Tech |
|------------|------|
| Frontend   | React, TailwindCSS, D3.js |
| Backend    | Express.js |
| Auth       | JWT or session-based |
| Database   | MongoDB (Auth, History), MySQL (Query Execution) |
| Utilities  | concurrently, dotenv |

---

# To Run

cd frontend  
npm run both
