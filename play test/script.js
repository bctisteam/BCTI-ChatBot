const startButton = document.getElementById("startBtn");
const outputDiv = document.getElementById("output");
const pipe = new Audio('pipe.mp3');

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
        if (finalTranscript.toLowerCase().includes("hello")) {
            outputDiv.innerHTML = `
                GET PIPED <br>
                Interim: ${interimTranscript} <br>
                Final: ${finalTranscript}
            `;
            pipe.play();
        } else {
            outputDiv.innerHTML = `
                Interim: ${interimTranscript} <br>
                Final: ${finalTranscript}
            `;
        }
    };

    recognition.onend = () => {
        startButton.textContent = "Start Recording";
    };

    startButton.addEventListener("click", () => {
        // Check if recognition is already started and stop if necessary
        if (recognition.recognizing) {
            recognition.stop();
        } else {
            recognition.start();
        }
    });
} else {
    outputDiv.textContent = "Web Speech API not supported in this browser.";
}
