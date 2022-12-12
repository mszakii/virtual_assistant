let input = document.getElementById("command");
let send = document.getElementById("send");
let box = document.getElementById("box");

// Speech
function speak(sentence) {
  let textSpeak = new SpeechSynthesisUtterance(sentence);

  textSpeak.rate = 1;
  textSpeak.pitch = 1;

  window.speechSynthesis.speak(textSpeak);
}
// create message

let date = new Date();

function createMsg(text, response, parent, url) {
  // Get time
  let time = "";
  if (date.getHours() > 12) {
    if (date.getHours() < 10) {
      time = `${date.getHours() - 12}:${date.getMinutes()}PM`;
    } else {
      time = `0${date.getHours() - 12}:${date.getMinutes()}PM`;
    }
  } else {
    if (date.getHours() < 10) {
      time = `${date.getHours()}:${date.getMinutes()}AM`;
    } else {
      time = `0${date.getHours()}:${date.getMinutes()}AM`;
    }
  }
  // create elements
  let cardEl = document.createElement("div");
  cardEl.className = "card";

  // time
  let timeDiv = document.createElement("div");
  timeDiv.appendChild(document.createTextNode(time));
  timeDiv.className = "time";
  cardEl.appendChild(timeDiv);

  // text
  let textDiv = document.createElement("div");
  textDiv.appendChild(document.createTextNode(text));
  textDiv.className = "text";
  if (url) {
    textDiv.style = "cursor: pointer;text-decoration: underline;";
    textDiv.onclick = function () {
      window.open(url);
    };
  }
  cardEl.appendChild(textDiv);

  // response
  let resDiv = document.createElement("div");
  resDiv.innerHTML = response;
  resDiv.className = "response";
  cardEl.appendChild(resDiv);

  // push to parent
  parent.prepend(cardEl);
}

function sendMsg(x) {
  if (x.length > 0) {
    let val = x.toLowerCase();
    if (val.includes("date")) {
      createMsg(val, `The date is ${date.toString().slice(0, 15)}`, box);
      speak(`The date is ${date.toString().slice(0, 15)}`);
    } else if (val.includes("timer")) {
      console.log(val.split(" "));
      createMsg(
        val,
        `Setting the timer ${val.split(" ")[-2]} ${val.split(" ")[-1]}`,
        box
      );
      speak(`Setting the timer ${val.split(" ")[-2]} ${val.split(" ")[-1]}`);
      window.open(
        `https://www.google.com/q=${val.split(" ")[-2]} ${val.split(" ")[-1]}`
      );
    } else if (val.includes("time")) {
      createMsg(val, `The time is ${date.toTimeString().slice(0, 5)}`, box);
      speak(`The time is ${date.toTimeString().slice(0, 5)}`);
    } else if (
      val.startsWith("search") ||
      (val.startsWith("google") && val.length > 7)
    ) {
      createMsg(val, `Ok searching on ${val.slice(7)}`, box);
      speak(`Ok searching on ${val.slice(7)}`);
      window.open(`https://www.google.com/search?q=${val.slice(7)}`);
    } else if (val.startsWith("search") && val.length <= 7) {
      createMsg(val, `Opening google`, box);
      speak(`Opening google`);
      window.open(`https://www.google.com/`);
    } else if (val.startsWith("open google") || val.startsWith("google")) {
      createMsg(val, `Opening google`, box);
      speak(`Opening google`);
      window.open(`https://www.google.com/`);
    } else if (
      val.includes("hello") ||
      val.includes("good afternoon") ||
      val.includes("good morning")
    ) {
      createMsg(val, `Hello, how can I help you?`, box);
      speak(`Hello, how can I help you?`);
    } else if (val.includes("price")) {
      // money price
      var myHeaders = new Headers();
      myHeaders.append("apikey", "roYgS49H19u1tjwiHdTtUFzwxRFQ70BD");

      var requestOptions = {
        method: "GET",
        redirect: "follow",
        headers: myHeaders,
      };

      fetch(
        `https://api.apilayer.com/exchangerates_data/convert?to=EGP&from=${val
          .split(" ")[1]
          .toUpperCase()}&amount=${+val.split(" ")[0]}`,
        requestOptions
      )
        .then((response) => response.text())
        .then((result) => {
          createMsg(
            val,
            `${+val.split(" ")[0]} ${val.split(" ")[1].toUpperCase()} equal ${
              JSON.parse(result).result
            } EGP`,
            box
          );
          speak(
            `${+val.split(" ")[0]} ${val
              .split(" ")[1]
              .toUpperCase()} equal ${Math.round(
              JSON.parse(result).result
            )} EGP`
          );
        })
        .catch((error) => console.log("error", error));
    } else if (val.startsWith("wiki")) {
      async function wikiwiki(searchQuery) {
        const endpoint = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=20&srsearch=${searchQuery}`;
        const response = await fetch(endpoint);
        if (!response.ok) {
          throw Error(response.statusText);
        }
        const json = await response.json();

        const url = `https://en.wikipedia.org/?curid=${json.query.search[0].pageid}`;

        console.log(url);

        createMsg(val, `${json.query.search[0].snippet}`, box, url);
      }
      wikiwiki(val.slice(val.split(" ")[0].length + 2));
      speak(`ِAccording to wikipedia here is something`);
    } else if (val.startsWith("calc")) {
      if (val.split(" ")[2] == "+") {
        createMsg(val, `${+val.split(" ")[1] + +val.split(" ")[3]}`, box);
        speak(`The result is ${+val.split(" ")[1] + val.split(" ")[3]}`);
      } else if (val.split(" ")[2] == "-") {
        console.log(parseInt(val.split(" ")[1]));
        createMsg(val, `${+val.split(" ")[1] - +val.split(" ")[3]}`, box);
        speak(`The result is ${+val.split(" ")[1] - +val.split(" ")[3]}`);
      } else if (val.split(" ")[2] == "/") {
        createMsg(val, `${+val.split(" ")[1] / +val.split(" ")[3]}`, box);
        speak(`The result is ${+val.split(" ")[1] / +val.split(" ")[3]}`);
      } else if (val.split(" ")[2] == "*") {
        createMsg(val, `${+val.split(" ")[1] * +val.split(" ")[3]}`, box);
        speak(`The result is ${+val.split(" ")[1] * +val.split(" ")[3]}`);
      } else if (val.split(" ")[2] == "%") {
        createMsg(val, `${+val.split(" ")[1] % +val.split(" ")[3]}`, box);
        speak(`The result is ${+val.split(" ")[1] % +val.split(" ")[3]}`);
      } else if (val.split(" ")[2] == "**") {
        createMsg(val, `${(+val.split(" ")[1]) ** +val.split(" ")[3]}`, box);
        speak(`The result is ${(+val.split(" ")[1]) ** +val.split(" ")[3]}`);
      }
    } else if (val.includes("pomo")) {
      window.open("https://mszakii.github.io/pomodoro");
      createMsg(val, `Opening pomodoro timer...`, box);
      speak(`Opening pomodoro timer`);
    } else if (val.includes("todo")) {
      window.open("https://mszakii.github.io/todo-app");
      createMsg(val, `Opening todo...`, box);
      speak(`Opening todo`);
    } else if (val.includes("pass")) {
      window.open("https://mszakii.github.io/password");
      createMsg(val, `Opening pasword generator...`, box);
      speak(`Opening password generator`);
    } else if (val.includes("gmail")) {
      window.open("https://gmail.com");
      createMsg(val, `Opening gmail...`, box);
      speak(`Opening gmail`);
    } else if (val.includes("translate")) {
      window.open("https://translate.google.com");
      createMsg(val, `Opening tranlate...`, box);
      speak(`Opening translate`);
    } else if (val == "about you") {
      createMsg(
        val,
        `I am a virtul assistant. I made by Mohamed Elsayed Zaky. I made to help you.`,
        box
      );
      speak(
        `I am a virtul assistant. I made by Mohamed Elsayed Zaky. I made to help you.`
      );
    } else {
      createMsg(val, `Sorry, I can't recognize you`, box);
      speak(`Sorry, I can't recognize you`);
    }
  }
  input.value = "";
}

send.onclick = function () {
  sendMsg(input.value);
};
this.onkeypress = (e) => {
  e.key === "Enter" ? sendMsg(input.value) : "";
};

// speech recognition
let mic = document.getElementById("voice");

let SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = new SpeechRecognition();

recognition.onresult = function (event) {
  let current = event.resultIndex;
  let transcript = event.results[current][0].transcript;

  sendMsg(transcript);
};

mic.addEventListener("click", () => {
  recognition.start();
});

// greetings

let greet = document.getElementById("greet");

if (date.getHours() > 12) {
  greet.textContent = "Good afternoon";
  if (!localStorage.greeted) {
    speak("Good afternoon, How can I help you today");
  }
  localStorage.greeted = 1;
} else {
  greet.textContent = "Good morning";
  if (!localStorage.greeted) {
    speak("Good morning, How can I help you today");
  }
  localStorage.greeted = 1;
}
