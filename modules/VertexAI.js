const { PredictionServiceClient } = require('@google-cloud/aiplatform').v1;
const fs = require('fs');
const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile);
const imgUrl = require('./uploadImage')


async function classifyImage(projectId, location, modelId, imagePath) {
  // Create a client for the Vertex AI
  const clientOptions = { apiEndpoint: `${location}-aiplatform.googleapis.com` };
  const client = new PredictionServiceClient(clientOptions);

  // Load the image and encode it as base64
  const imageBuffer = await readFileAsync(imagePath);
  const encodedImage = imageBuffer.toString('base64');

  // Create the prediction request
  const instance = {
    content: encodedImage,
  };

  const request = {
    endpoint: `projects/${projectId}/locations/${location}/endpoints/${modelId}`,
    instances: [instance],
  };

  const [response] = await client.predict(request);

  // Extract and return the predicted class
  const predictions = response.predictions;
  const predictedClass = predictions[0].displayNames[0];

  return predictedClass;
}

// Set your project ID, model location, model ID, and image file path
const projectId = 'trashsort-388213';
const location = 'asia-southeast2';
const modelId = 'your-model-id';
const imagePath = imgUrl.getPublicUrl();

// Call the classification function
classifyImage(projectId, location, modelId, imagePath)
  .then((predictedClass) => {
    // Print the predicted class
    console.log('Predicted class:', predictedClass);
  })
  .catch((err) => {
    console.error('Error:', err);
  });