const getExtract = async (text) => {
	const url = `http://127.0.0.1:8000/process-text/${text}`;

	let result = await fetch(url)
	.then((response) => response.json())
	.then((data) => data);

	return result;	
};

const textareaIn = document.querySelector('.js-input');
const textareaOut = document.querySelector('.js-output');

async function submit() {
    const inputText = textareaIn.value;
    const response = await fetch("http://127.0.0.1:8000/entity-info", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: inputText }),
    });
    const json = await response.json();
    let output = "";
    for (const sentence of json.sentences) {
      for (const entity of sentence) {
        output += `${entity.text} (${entity.label})\n`;
      }
      output += "\n";
    }
    textareaOut.value = output;
}

const showResult = function(jsonObject){
    console.log(jsonObject);
    document.getElementsByClassName('js-output').value = jsonObject.report;
}

document.addEventListener('DOMContentLoaded', function(){
    console.log('DOM geladen');

    document.querySelector('.js-extract').addEventListener('click', function(){
        //var text = document.querySelector('.js-input').value;
        //console.log(text);

        //const extractedText = await getExtract(text);
        //for (let t in extractedText.report){
            //document.querySelector('.js-output').value += t;
        //}
        //document.querySelector('.js-output').value = extractedText.report;
        //console.log(extractedText.report)
        
        submit()
    });

    let SpeechRecognition = window.webkitSpeechRecognition;
    let recognition = new SpeechRecognition();

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // Verkrijg de toegang tot de microfoon
    navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
        recognition = new window.webkitSpeechRecognition();
        recognition.interimResults = true;
        recognition.continuous = true;
        recognition.start();
    
        // Voeg een event-listener toe voor het 'result' event
        recognition.addEventListener('result', event => {
        const input = document.querySelector('.js-input');
        input.value = event.results[0][0].transcript;
        console.log(event.results[0][0].transcript);
        });
    
        // Voeg een event-listener toe voor het 'end' event
        recognition.addEventListener('end', () => recognition.start());
    
        // Stel de microfoonstream in als de bron van de opname
        const source = new MediaStreamAudioSourceNode(audioContext, { mediaStream: stream });
        source.connect(audioContext.destination);
    
        // Create play and pause buttons
        const playBtn = document.querySelector('.js-play')
        playBtn.addEventListener('click', () => recognition.start());

        const pauseBtn = document.querySelector('.js-pause')

        pauseBtn.addEventListener('click', async function(){
            recognition.stop()
            var text = document.querySelector('.js-input').value;
            const extractedText = await getExtract(text);
            document.querySelector('.js-output').value = extractedText.report;
        });
    })
    .catch(console.error);
});