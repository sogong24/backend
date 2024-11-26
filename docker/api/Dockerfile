FROM node:20
LABEL authors="minbros"
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
EXPOSE 3000
# scripts/seedCourses.js를 실행해서 과목 데이터를 DB에 갱신함
CMD ["sh", "-c", "node scripts/seedCourses.js && npm start"]