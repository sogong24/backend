FROM node:20
LABEL authors="minbros"
WORKDIR /app
COPY package*.json .
RUN npm install \
    && apt-get update \
    && apt-get -y install poppler-data poppler-utils \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*
COPY . .
EXPOSE 3000
# scripts/seedCourses.js를 실행해서 데이터베이스에 courses를 추가.
CMD ["sh", "-c", "node scripts/seedCourses.js && npm start"]