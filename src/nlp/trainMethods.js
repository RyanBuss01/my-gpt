const tf =  require('@tensorflow/tfjs-node');
const fs = require('fs');
const porterStemmer = require('porter-stemmer');



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

    loadData: function (filePath) {
        let rawData = fs.readFileSync(filePath);
        return JSON.parse(rawData);
    },

    loadDataFetch: async function (filePath) {
        fetch(filePath)
            .then(response => response.json())
            .then(data => {
                return tokenizer.tokenize(data);
            });
    },

    createModel: function (inputSize, hiddenSize, outputSize) {
        const model = tf.sequential();
        model.add(tf.layers.dense({inputShape: [inputSize], units: hiddenSize, activation: 'relu'}));
        model.add(tf.layers.dense({units: hiddenSize, activation: 'relu'}));
        model.add(tf.layers.dense({units: outputSize, activation: 'softmax'}));

        return model;
    },

    trainModel: async function (model, XTrain, YTrain, numEpochs) {
        model.compile({
            optimizer: tf.train.adam(0.001),
            loss: 'categoricalCrossentropy',
            metrics: ['accuracy'],
        });

        await model.fit(XTrain, YTrain, {
            epochs: numEpochs,
            batchSize: 8,
        });
    },

    saveModel: async function (model, modelName) {
        await model.save(`file://path/to/save/${modelName}`);
    }
}
module.exports= trainMethods;