const startButton = document.getElementById("startBtn");
const voiceSelect = document.getElementById("voiceSelect");
const outputDiv = document.getElementById("output");

let synth = window.speechSynthesis;
let voices = [];
let selectedVoiceIndex = 0; // Default to the first voice
let record = false;

if ("webkitSpeechRecognition" in window) {
    const recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
        startButton.textContent = "Recording...";
    };

    recognition.onresult = (event) => {
        let interimTranscript = "";
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalTranscript += transcript + " ";
            } else {
                interimTranscript += transcript;
            }
        }

        if (/hello|hi|hey/i.test(finalTranscript)) {
            const greetings = [
                "Got any questions? I’ve got answers!",
                "I'm ChatBot! How can I help you?",
                "Howdy! What's on your mind?",
                "What's up! I'm here to assist you.",
                "Good day! What brings you here?"
            ];
            const greeting = greetings[Math.floor(Math.random() * greetings.length)];
            const utterance = new SpeechSynthesisUtterance(greeting);
            utterance.lang = 'en-US';
            utterance.pitch = 1;
            utterance.rate = 1;
            utterance.voice = voices[1];

            recognition.stop();
            synth.speak(utterance);

            utterance.onend = () => {
                if (record) {
                    recognition.start();
                }
            };

            outputDiv.innerHTML = `
                What you said: ${finalTranscript} <br>
                ChatBot Response: ${greeting}
            `;
        } else if (finalTranscript.toLowerCase().includes("joke")) {
            const jokeCategory = "programming";
            outputDiv.innerHTML = `
                What you said: ${finalTranscript} <br>
                ChatBot Response: Fetching a joke for you...
            `;
            fetch(`https://official-joke-api.appspot.com/jokes/${jokeCategory}/random`)
                .then(response => response.json())
                .then(data => {
                    const joke = Array.isArray(data) ? data[0] : data;
                    if (joke && joke.setup && joke.punchline) {
                        const jokeText = `${joke.setup} ${joke.punchline}`;
                        const utterance = new SpeechSynthesisUtterance(jokeText);
                        utterance.lang = 'en-US';
                        utterance.pitch = 1;
                        utterance.rate = 1;
                        utterance.voice = voices[1];

                        recognition.stop();
                        synth.speak(utterance);

                        utterance.onend = () => {
                                recognition.start();
                        };

                        outputDiv.innerHTML = `
                            What you said: ${finalTranscript} <br>
                            ChatBot Response: ${jokeText}
                        `;
                    } else {
                        throw new Error("Joke data is missing setup or punchline.");
                    }
                })
                .catch(error => {
                    console.error('Error fetching joke:', error);
                    const fallbackJoke = "Why don’t programmers like nature? It has too many bugs.";
                    const utterance = new SpeechSynthesisUtterance(fallbackJoke);
                    utterance.lang = 'en-US';
                    utterance.pitch = 1;
                    utterance.rate = 1;
                    utterance.voice = voices[1];

                    recognition.stop();
                    synth.speak(utterance);

                    utterance.onend = () => {
                            recognition.start();
                    };

                    outputDiv.innerHTML = `
                        What you said: ${finalTranscript} <br>
                        ChatBot Response: ${fallbackJoke}
                    `;
                });

        } else if (/steam|stem/i.test(finalTranscript)) {
            const stemResponse = "The STEAM Lab is located on the second floor at CTI 215. There are other projects there like PuzzleBot, DrawBot, BuzzMe, and the MPS station.";
            const utterance = new SpeechSynthesisUtterance(stemResponse);
            utterance.lang = 'en-US';
            utterance.pitch = 1;
            utterance.rate = 1;
            utterance.voice = voices[1];

            recognition.stop();
            synth.speak(utterance);

            utterance.onend = () => {
                    recognition.start();
            };

            outputDiv.innerHTML = `
                What you said: ${finalTranscript} <br>
                ChatBot Response: ${stemResponse}
            `;
        } else {
            const nondir = "I'm sorry, what you said is not in my directory. Could you please ask another question?";
            recognition.stop();
            outputDiv.innerHTML = `
                What you said: ${finalTranscript} <br>
                ChatBot Response: ${nondir}
            `;
        }
    };

    recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        outputDiv.innerHTML = "An error occurred with speech recognition. Please try again.";
    };

    startButton.addEventListener("click", () => {
        record = true;
        recognition.start();
        startButton.textContent = "Listening";
    });
} else {
    outputDiv.textContent = "Web Speech API not supported in this browser.";
}
