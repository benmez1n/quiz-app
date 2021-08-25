let categories = Array.from(document.querySelectorAll(".quiz-categories button")),
    categorySelected = document.getElementById("category-name"),
    bullets = document.querySelector(".bullets .spans"),
    count = document.querySelector(".count span"),
    quizArea = document.querySelector(".quiz-area"),
    submitBtn = document.querySelector(".submit-button"),
    answersArea = document.querySelector(".answers-area"),
    results = document.querySelector(".results"),
    countdownElement = document.querySelector(".countdown");

let category="",
    currentIndex=0,
    score=0,
    i=0,
    countdownInterval;

//Categories 
categories[0].addEventListener("click",()=>{
    category= "Sports";
    clear();
    getQuestions();
    countdown(30);
    categories[0].classList.add("active")
});

categories[1].addEventListener("click",()=>{
    category= "Games";
    clear();
    getQuestions();
    countdown(30);
    categories[1].classList.add("active");
    reloadPage();
});
categories[2].addEventListener("click",()=>{
    category= "Mathematics";
    clear();
    getQuestions();
    countdown(30);
    categories[2].classList.add("active");
    reloadPage();
});
categories[3].addEventListener("click",()=>{
    category= "History";
    clear();
    getQuestions();
    countdown(30);
    categories[3].classList.add("active");
    reloadPage();
});
categories[4].addEventListener("click",()=>{
    category= "Science => Computers";
    clear();
    getQuestions();
    countdown(30);
    categories[4].classList.add("active");
    reloadPage();
});

//Get questions from API using AJAX & JSON
function getQuestions (){
    let  myRequest = new XMLHttpRequest();
    myRequest.onreadystatechange = ()=>{
        if(myRequest.readyState === 4 && myRequest.status === 200){
            let questionsObject = JSON.parse(myRequest.responseText);
            categorySelected.textContent = category;
            createBullets();
            addData(questionsObject,currentIndex);
            submitBtn.addEventListener("click",()=>{
                if(currentIndex<9){
                    clearInterval(countdownInterval);
                    countdown(30);
                    if(currentIndex==8)submitBtn.innerHTML = "Show Result"
                    let correct = questionsObject.results[currentIndex].correct_answer; 
                    currentIndex++;
                    checkAnswers(correct);
                    quizArea.textContent = ""
                    answersArea.textContent = ""
                    addData(questionsObject,currentIndex);  
                    nextQuestion(currentIndex);              
                }
                else if(currentIndex==9){
                    clearInterval(countdownInterval);
                    showResult();
                    countdownElement.innerHTML = "END"  
                }
                else clear();
            });
        }
    }
    if(category ==="Sports") myRequest.open("GET", "https://opentdb.com/api.php?amount=10&category=21&type=multiple",true);
    else if(category==="Games")myRequest.open("GET", "https://opentdb.com/api.php?amount=10&category=15&type=multiple",true);
    else if(category==="Mathematics")myRequest.open("GET","https://opentdb.com/api.php?amount=10&category=19&type=multiple",true);
    else if(category==="History")myRequest.open("GET","https://opentdb.com/api.php?amount=10&category=23&type=multiple",true);
    else myRequest.open("GET", "https://opentdb.com/api.php?amount=10&category=18&type=multiple",true);
    myRequest.send();
}

createBullets = ()=>{
    for(let i = 0 ; i < 10 ; i++){
        let bullet = document.createElement("span");
        if(i===0)bullet.className = "on" 
        bullets.appendChild(bullet);
    }
    count.innerHTML = 10;
}

//create the question with answers elements
addData = (object,i)=>{
    if(i<object.results.length){
        let answersArray = [object.results[i].correct_answer,...object.results[i].incorrect_answers];
        let arr = randomAnswersOrder(answersArray);
        let question = document.createElement("h2"),
        questionText = document.createTextNode(object.results[i].question);
        question.appendChild(questionText);
        quizArea.appendChild(question);
        for(let i=0;i<answersArray.length;i++){
            let answerMain = document.createElement("div"),
                label = document.createElement("label"),
                answer = document.createTextNode(arr[i]),
                radioInput = document.createElement("input");
            answerMain.className = "answer";
            radioInput.type = "radio";
            radioInput.name="question";
            radioInput.id=`answer${i}`;
            label.appendChild(answer);
            answerMain.appendChild(radioInput);
            answerMain.appendChild(label);
            answersArea.appendChild(answerMain);
            if(i==0)radioInput.check =true;
        }
    }
    else{
        return;
    }
}

//change the order of the four answers 
randomAnswersOrder = (array)=>{
    let current = array.length-1,
        temp,
        random;
    while(current>0){
        random = Math.floor(Math.random()*current);
        temp = array[current];
        array[current] = array[random];
        array[random] = temp;
        current--;
    }
    return array;
}
//check user answer 
checkAnswers = (correct)=>{
    let answers = document.getElementsByName("question");
    let choosenAnswer;
    for (let i = 0; i < answers.length; i++) {
      if (answers[i].checked)choosenAnswer = answers[i].parentElement.childNodes[1].textContent;
    }
    if(choosenAnswer == correct)score++;
}

nextQuestion = (count)=>{
    let currentBullet = Array.from(document.querySelectorAll(".bullets .spans span"));
    if(count<10)currentBullet[count].className = "on"
}
//display result with note
showResult = ()=>{
    if(score==10)results.innerHTML =`<span class=perfect>Perfect : ${score}</span>`;
    else if (score>=8 && score<10) results.innerHTML =`<span class=good>Good : ${score}</span>`;
    if(score>=5 && score<8)results.innerHTML =`<span class=medium >Medium: ${score}</span>`;
    else results.innerHTML =`<span class=bad>Bad : ${score}</span>`; 
}
countdown = (duration) =>{
    if (currentIndex>=0 && currentIndex<10) {
      let minutes, seconds;
      countdownInterval = setInterval(()=>{
        seconds = parseInt(duration % 60);
        seconds = seconds < 10 ? `0${seconds}` : seconds;
        countdownElement.innerHTML = `00:${seconds}`;
  
        if (--duration < 0) {
          clearInterval(countdownInterval);
          submitBtn.click();
        }
      },1000);
    }
}
clear = ()=>{
    categories.forEach(element=>{element.classList.remove("active");})
    quizArea.textContent = "";
    answersArea.textContent = "";
    bullets.textContent = "";
    results.textContent="";
    submitBtn.innerHTML = "Submit Answer";
    currentIndex=0; 
    score=0; 
}
reloadPage = ()=>{
    if(i==0)i++;
    else location.reload();
}