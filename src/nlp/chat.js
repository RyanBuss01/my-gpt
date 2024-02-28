import tf from '@tensorflow/tfjs-node';
import trainMethods  from './trainMethods';

const intents = trainMethods.loadDataFetch('./data/json/intents_enthusiastic.json');

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

// Function to tokenize and preprocess the text
function preprocessInput(inputText) {
    const tokenizedInput = trainMethods.tokenize(inputText);
    const bag = trainMethods.bagOfWords(tokenizedInput, allWords); // Make sure to define yourVocabularyArray based on your training data
    const inputTensor = tf.tensor2d([bag], [1, bag.length]); // Convert to tensor
    return inputTensor;
}

function interpretPrediction(prediction) {
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

    // Load the model
    const model = await tf.loadLayersModel('file://./js/models/model/model.json');

    const inputTensor = preprocessInput(inputText);

    const prediction = model.predict(inputTensor);

    // Find the corresponding tag in your intents JSON and choose a random response
    // Assuming you have a way to interpret the prediction to get the actual response text
    const response = interpretPrediction(prediction);

    console.log(response);
    
    return response // Implement randomChoice to select a random response
}


export default getResponse;
