# system Dockerfile
FROM node:20-alpine

# קביעת תיקיית העבודה
WORKDIR /app

# העתקת קבצי התצורה והקוד
COPY package.json package-lock.json ./
COPY tsconfig.json ./
# COPY .env ./
COPY src ./src

# התקנת התלויות
RUN npm install && npm run build

# חשיפת הפורט
EXPOSE 8000

# הפעלת השרת
CMD ["npm", "start"]