
// build docker

const { execSync } = require('child_process');

// import env variables from .env file
require('dotenv').config();

console.log('Building docker image...');
console.log('DATABASE_URL:', process.env.DATABASE_URL);
console.log('DIRECT_URL:', process.env.DIRECT_URL);

const buildDocker = () => {
  let dockerCommand = 'docker build -t lexomeneal/lexome-graphql-server:latest2'

  dockerCommand += ` --build-arg 'DATABASE_URL=${process.env.DATABASE_URL}'`;
  dockerCommand += ` --build-arg 'DIRECT_URL=${process.env.DIRECT_URL}'`;
  dockerCommand += ` --no-cache`;
  dockerCommand += ' .';

  console.log('dockerCommand:', dockerCommand)

  execSync(dockerCommand, { stdio: 'inherit' });
}

buildDocker();