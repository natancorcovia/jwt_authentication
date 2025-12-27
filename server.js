import express from "express";
import jwt from "jsonwebtoken";

const app = express();
const PORT = 3000;
const SECRET_KEY = "9885f8af04289135df259e34bd22d17fe45ea81e";

app.use(express.json());

const users = [
  { id: 1, username: "natansilva", password: "123456", role: "admin" },
  { id: 2, username: "natancorcovia", password: "123456", role: "user" },
];

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = users.find(
    (user) => user.username === username && user.password === password
  );

  if (user) {
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      SECRET_KEY,
      { expiresIn: "1h" }
    );
    res.status(201).json({ massage: token });
  } else {
    res.status(400).json({ message: "Usuário ou senha inválidos!" });
  }
});

const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    res.status(403).json({ message: "Token não fornecido!" });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      res.status(403).json({ message: "Token inválido!" });
    }
    req.user = user;
    next();
  });
};

app.get("/protected", authenticateToken, (req, res) => {
  res.status(200).json({ message: "Bem vindo à rota autenticada!" });
});

app.get("/admin", authenticateToken, (req, res) => {
  if (req.user.role !== "admin") {
    res.status(403).json({ message: "Acesso negado!" });
  }
  res.status(200).json({ message: "Bem vindo à área administrativa!" });
});

app.listen(PORT, () => {
  console.log("Servidor online!");
});
