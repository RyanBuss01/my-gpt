const trainMethods = require('./trainMethods');
const tf = require('@tensorflow/tfjs-node');
const numEpochs = 80;
const batchSize = 8;
const hiddenSize = 8;

// Retrieve Training data
const intents = trainMethods.loadData('src/nlp/json/intents_enthusiastic.json');

// Preprocess data
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
// Create training data
const X_train = [];
const y_train = [];
xy.forEach(pair => {
  let bag = trainMethods.bagOfWords(pair.pattern, allWords);
  X_train.push(bag);
  let label = tags.indexOf(pair.tag);
  y_train.push(label);
});

const inputSize = X_train[0].length;
const outputSize = tags.length;

console.log(allWords.length)
console.log(inputSize)
// Create model
const model = tf.sequential();
model.add(tf.layers.dense({ inputShape: [inputSize], units: hiddenSize, activation: 'relu' }));
model.add(tf.layers.dense({ units: outputSize, activation: 'softmax' }));

model.compile({
  optimizer: 'adam',
  loss: 'categoricalCrossentropy',
  metrics: ['accuracy'],
});

// Convert X_train and y_train to tensors
const x_train_tensor = tf.tensor2d(X_train, [X_train.length, inputSize]);
const y_train_tensor = tf.oneHot(tf.tensor1d(y_train, 'int32'), outputSize);


model.fit(x_train_tensor, y_train_tensor, {
  epochs: numEpochs,
  batchSize: batchSize,
  callbacks: {
    onEpochEnd: (epoch, logs) => {
      console.log(`Epoch ${epoch}: loss = ${logs.loss}, accuracy = ${logs.acc}`);
    },
  },
}).then(info => {
  const modelSavePath = path.resolve(__dirname, '../public/model');
  model.save('file://../ai-chatbot/public/model').then(() => {
    console.log('Model saved.');
  });
});