
// build docker

const { execSync } = require('child_process');
const { program } = require('commander');

// import env variables from .env file
require('dotenv').config();

program
  .option('--push', 'Push the image to the registry')

program.parse();

console.log('Building docker image...');
console.log('DATABASE_URL:', process.env.DATABASE_URL);
console.log('DIRECT_URL:', process.env.DIRECT_URL);

const REGION = 'us-central1';
const PROJECT_ID = 'lexome-prod';
const REPOSITORY = 'lexome';
const IMAGE = 'lexome-graphql-server';
const TAG = 'latest';

const fullImageName = `${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPOSITORY}/${IMAGE}:latest`;

const buildDocker = () => {
  let dockerCommand = `docker build -t ${fullImageName}`

  dockerCommand += ` --build-arg 'DATABASE_URL=${process.env.DATABASE_URL}'`;
  dockerCommand += ` --build-arg 'DIRECT_URL=${process.env.DIRECT_URL}'`;
  dockerCommand += ` --no-cache`;
  dockerCommand += ' .';

  console.log('dockerCommand:', dockerCommand)

  execSync(dockerCommand, { stdio: 'inherit' });
}

buildDocker();

if (program.push) {
  const gcloudCommand = `docker push ${fullImageName}`;

  console.log('Pushing docker image...');
  execSync(gcloudCommand, { stdio: 'inherit' });
}