async function submit() {
  const inputText = document.querySelector('.js-input').value;
  const response = await fetch("http://127.0.0.1:8000/entity-info-check/", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ text : inputText }),
  });
  const json = await response.json();
  let output = "";
  for (const entity of json.sentences) {
    output += `${entity.text} `;
  }

  const textareaOut = document.querySelector('.js-output');
  textareaOut.value = output;
}

const showResult = function(jsonObject){
    console.log(jsonObject);
    document.getElementsByClassName('js-output').value = jsonObject.report;
}

document.addEventListener('DOMContentLoaded', function(){
    console.log('DOM geladen');

    document.querySelector('.js-extract').addEventListener('click', async function(){
        //var text = document.querySelector('.js-input').value;
        //console.log(text);

        //const extractedText = await getExtract(text);
        //for (let t in extractedText.report){
            //document.querySelector('.js-output').value += t;
        //}
        //document.querySelector('.js-output').value = extractedText.report;
        //console.log(extractedText.report)
        
        await submit()
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

        const pauseBtn = document.querySelector('.js-pause');
        pauseBtn.addEventListener('click', async function(){
            recognition.stop();
            await submit();
        });
    })
    .catch(console.error);
});