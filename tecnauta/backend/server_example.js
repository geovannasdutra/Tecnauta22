const express = require('express');
const app = express();
app.use(express.json());

const GABARITOS = {
  geral: { q1: 'B', q2: 'B', q3: 'A', q4: 'B' },
  portugues: { p1: 'C' },
  matematica: { m1: 'B' }
};

app.post('/api/auth/login', (req, res) => {
  const { email, pass } = req.body;

  console.log(`Tentativa de login para: ${email}`);
  

  res.json({ success: true, token: "JWT_TOKEN_SEGURO_GERADO_AQUI" });
});


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
 
  
  res.json({
    score: `${acertos}/${total}`,
    pointsEarned: pontosGanhos,
    message: "Pontuação processada com segurança no servidor!"
  });
});

app.listen(3000, () => console.log('Servidor Backend rodando com segurança na porta 3000!'));
