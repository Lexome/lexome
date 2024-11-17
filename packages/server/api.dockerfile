from node:22-alpine
WORKDIR /app
COPY ./prisma ./prisma
COPY ./src ./src
COPY ./package.json ./package.json
COPY ./tsconfig.json ./tsconfig.json
COPY ./package-lock.json ./package-lock.json
RUN npm install

ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}
ARG DIRECT_URL
ENV DIRECT_URL=${DIRECT_URL}

RUN npx prisma generate
RUN npm run build-api

CMD ["npm", "run", "start-api"]

EXPOSE 8080