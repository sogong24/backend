FROM node:20
LABEL authors="minbros"
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
EXPOSE 3000
# scripts/seedCourses.js를 실행해서 데이터베이스에 courses를 추가.
CMD ["sh", "-c", "node scripts/seedCourses.js && npm start"]