let currentQuestion = 0;
let questions = [];
let allCorrect = false; // Indicador de todas as respostas corretas


fetch('questions.json').then(response => {
  if (!response.ok) {
    throw new Error('Resposta foi um sucesso  ' + response.statusText);
  }
  return response.json();
}).then(data => {
  questions = data;
  showQuestion();
})
  .catch(error => {
    console.error('Tem um problema ao se conectar:', error);
  });
function delay(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

async function showQuestion() {
  const questionEl = document.getElementById('question');
  const optionsEl = document.getElementById('options');
  const nextBtn = document.getElementById('next_btn');
  nextBtn.disabled = true;
  if (questionEl && optionsEl && nextBtn) {
    const question = questions[currentQuestion];
    questionEl.textContent = question.question;
    optionsEl.innerHTML = '';
    question.options.forEach(option => {
      const button = document.createElement('button');
      button.textContent = option;
      button.classList.add('option');
      button.addEventListener('click', () => selectOption(button, question.answer,question.tent));
      optionsEl.appendChild(button);
    });
  } else {
    console.error('Elemento não encontrado.');
  }
}

async function selectOption(button, correctAnswer,tent) {
  const options = document.querySelectorAll('.option');
  options.forEach(option => option.disabled = true);

  if (button.textContent === correctAnswer) {
    button.style.background = 'green';
    const nextBtn = document.getElementById('next_btn');
    nextBtn.disabled = false;
    if (currentQuestion === questions.length - 1) { // Se for a última pergunta
      if (nextBtn) {
        nextBtn.style.display = 'none';
      }
      allCorrect = true; // Define o indicador de todas as respostas corretas 
      await delay(5000); // Aguarda 20 segundos 
      window.location.href = `final.html?allCorrect=${allCorrect}`;
    }
  } else {
    //Quando estiver errado
    button.style.background = 'red';
    const pista = document.getElementById('pista')
    pista.innerText = tent; 
    await delay(5000); // Aguarda 2 segundos
    options.forEach(option => option.disabled = false); button.style.background = '';
    pista.innerText = '';
  }
}




document.addEventListener('DOMContentLoaded', (event) => {
  const nextBtn = document.getElementById('next_btn');
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentQuestion++;
      if (currentQuestion < questions.length) {
        showQuestion();
      }
      else {
        alert('Quiz Finalizado! Parabéns!');
      }
    });
  } else {
    console.error('Elemento "next-btn" não encontrado.');
  }
});
