/********************************************************
 * HTML Root for sending and recieving messages
 * 
 * Messages array and mapping
 * 
 ********************************************************/
import React, { useState, useRef } from 'react';
import Message from './message';
import {loadLayersModel, tensor2d} from '@tensorflow/tfjs';
import porterStemmer from 'porter-stemmer';
import intents from './nlp/json/intents_enthusiastic.json';

// const tokenizer = new natural.WordTokenizer();
// import getResponse from './nlp/chat.js';




function App() {
  const [inputColor, setInputColor] =useState("#84b9ee");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      user: "Bot",
      message: "Hello"
    }
  ]);

  const chatContainerRef = useRef(null);




  var trainMethods = {
    tokenize: function (sentence) {
        return sentence.toLowerCase().split(/\W+/);
    },
  
    stem: function (word) {
        return porterStemmer.stemmer(word.toLowerCase());
    },
  
    bagOfWords: function (tokenizedSentence, words) {
        let bag = Array(words.length).fill(0);
        tokenizedSentence.forEach(word => {
            const stemmedWord = trainMethods.stem(word);
            const index = words.indexOf(stemmedWord);
            if (index > -1) {
                bag[index] = 1;
            }
        });
        return bag;
    },
  }
  
  function interpretPrediction(prediction, tags) {
    // Convert prediction to array and get the highest probability's index
    const probabilities = prediction.arraySync()[0];
    const predictedIndex = probabilities.indexOf(Math.max(...probabilities));
    const predictedTag = tags[predictedIndex];
  
    // Filter intents for the predicted tag and select a random response
    const filteredIntents = intents.intents.filter(intent => intent.tag === predictedTag);
  
    if (filteredIntents.length > 0 && filteredIntents[0].responses.length > 0) {
        const responses = filteredIntents[0].responses;
        const response = responses[Math.floor(Math.random() * responses.length)];
        return response;
    } else {
        return "I do not understand...";
    }
  }
  
  // Function to get a response
  async function getResponse(inputText) {
  
    let allWords = [];
    let tags = [];
    let xy = [];

    intents['intents'].forEach(intent => {
      let tag = intent['tag'];
      tags.push(tag);
      intent['patterns'].forEach(pattern => {
        let w = trainMethods.tokenize(pattern);
        allWords.push(...w);
        xy.push({ pattern: w, tag: tag });
      });
    });

    const ignoreWords = ['?', '.', '!'];
    allWords = allWords
      .filter(word => !ignoreWords.includes(word))
      .map(word => trainMethods.stem(word));

    allWords = [...new Set(allWords)].sort();
    tags = [...new Set(tags)].sort();

    function preprocessInput(inputText) {
      const tokenizedInput = trainMethods.tokenize(inputText);
      const bag = trainMethods.bagOfWords(tokenizedInput, allWords); // Make sure to define yourVocabularyArray based on your training data
      console.log(bag.length);
      const inputTensor = tensor2d([bag], [1, bag.length]); // Convert to tensor
      return inputTensor;
  }

    // Load the model
    const model = await loadLayersModel(`${process.env.PUBLIC_URL}/model/model.json`);
    const inputTensor = preprocessInput(inputText); // Convert to tensor
    const prediction = model.predict(inputTensor);
    const response = interpretPrediction(prediction, tags);
    
    return response // Implement randomChoice to select a random response
  }

  // Runs send message when enter is pressed
  function handleKeyPress(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      sendMessage();
    }
  }

  function onTextChange(event) {
    setMessage(event.target.value);
    setInputColor(event.target.value === '' ? "#84b9ee" : "blue");
  }

  function sendMessage() {
    if (message !== '' && !loading) {
      // Append new message from the user
      setMessages(currentMessages => [...currentMessages, { user: "Me", message: message }]);
      
      // Clear the message input field and indicate loading
      setMessage('');
      setLoading(true);
  
      // Get the bot's response and append it
      getResponse(message).then((response) => {
        setMessages(currentMessages => [...currentMessages, { user: "Bot", message: response }]);
        if (chatContainerRef.current) {
          // Use setTimeout to ensure this runs after React updates the DOM
          setTimeout(() => chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight, 0);
        }
        setLoading(false);
      });
    }
  }
  

  return (
    <div className="App">
      <body>
        <h1>My-GPT</h1>
        <div class="center-container">
            <div id="chat-container" class="chat-container" ref={chatContainerRef}>
            {messages.map((msg, index) => (
              // Create a new Message component for each message in the messages array
              < Message key={index} message={msg.message} user={msg.user} />
            ))}
            </div>
        </div>

        <div class="center-container">
            <div class="input-container">
                <input type="text" value={message} id="message-input" placeholder="Type your message" onChange={onTextChange} onKeyDown={handleKeyPress} />
                <input type="submit" value="send" style={{"background-color": inputColor}} onClick={sendMessage}/>
            </div>
        </div>
      </body>
    </div>
  );
}

export default App;
