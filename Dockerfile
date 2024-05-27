FROM amd64/node:18-alpine
WORKDIR /app
COPY . .
RUN npm i
RUN npx next build
EXPOSE 3000
CMD [ "npm", "start" ]