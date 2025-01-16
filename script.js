const startButton = document.getElementById("startBtn");
const outputDiv = document.getElementById("output");

let synth = window.speechSynthesis;

if ("webkitSpeechRecognition" in window) {
    const recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US"; // Set the language to English

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

        // Check for the specific word ("hello") in the final transcript
        if (finalTranscript.toLowerCase().includes("hello")||finalTranscript.toLowerCase().includes("hi")||finalTranscript.toLowerCase().includes("hey")) {
            let greetings = [
                "Hello! How can I help you?",
                "Hey I'm ChatBot! How can I help you?",
                "Howdy! What's on your mind?",
                "Hi there! I'm here to assist you.",
                "Hey, hey, hey! What brings you here?",
                "Hello! Got any questions? I’ve got answers!"
            ];
            let greeting = greetings[Math.floor(Math.random() * greetings.length)];

            let utterance = new SpeechSynthesisUtterance(greeting);

            utterance.lang = 'en-US';
            utterance.pitch = 1;
            utterance.rate = 1;

            synth.speak(utterance);
            outputDiv.innerHTML = `
                What you said: ${finalTranscript} <br>
                ChatBot Response: ${greeting}
                
            `;
        } else {
            outputDiv.innerHTML = `
                What you said: ${finalTranscript}
            `;
        }
    };

    recognition.onend = () => {
        recognition.start(); // Restart recognition immediately when it ends
    };

    // Start recognition immediately
    recognition.start();
} else {
    outputDiv.textContent = "Web Speech API not supported in this browser.";
}
