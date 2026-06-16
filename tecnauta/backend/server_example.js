// ==========================================
// EXEMPLO DE MIGRACAO PARA BACKEND REAL (Node.js + Express)
// Ficheiro sugerido: backend/server.js
// ==========================================

const express = require('express');
const app = express();
app.use(express.json());

// Base de dados simulada no servidor (Em produção, usaria MongoDB, MySQL, etc.)
const GABARITOS = {
  geral: { q1: 'B', q2: 'B', q3: 'A', q4: 'B' },
  portugues: { p1: 'C' },
  matematica: { m1: 'B' }
};

// Rota de Autenticação (Login)
app.post('/api/auth/login', (req, res) => {
  const { email, pass } = req.body;
  // Aqui você buscaria no banco de dados: SELECT * FROM users WHERE email = email
  console.log(`Tentativa de login para: ${email}`);
  
  // Resposta mockada de sucesso com Token de sessão temporária
  res.json({ success: true, token: "JWT_TOKEN_SEGURO_GERADO_AQUI" });
});

// Rota Segura para Correção de Provas (O gabarito nunca vaza para o cliente)
app.post('/api/quiz/grade', (req, res) => {
  const { email, quizType, answers } = req.body;
  const gabaritoCorreto = GABARITOS[quizType];
  
  if(!gabaritoCorreto) return res.status(404).json({ error: "Quiz não encontrado" });
  
  let acertos = 0;
  let total = 0;
  
  for(const questao in gabaritoCorreto) {
    total++;
    if(answers[questao] === gabaritoCorreto[questao]) {
      acertos++;
    }
  }
  
  const pontosGanhos = acertos * 10;
  // Aqui você faria um UPDATE no Banco de Dados somando os pontos ao perfil do usuário
  
  res.json({
    score: `${acertos}/${total}`,
    pointsEarned: pontosGanhos,
    message: "Pontuação processada com segurança no servidor!"
  });
});

app.listen(3000, () => console.log('Servidor Backend rodando com segurança na porta 3000!'));
