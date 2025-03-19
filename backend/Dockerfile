# Backend Dockerfile
FROM node:20-alpine

# קביעת תיקיית העבודה
WORKDIR /app

# העתקת קבצי התצורה והקוד
COPY package.json ./
COPY tsconfig.json ./
# COPY .env ./
COPY .npmrc ./
COPY src ./src

# התקנת התלויות
RUN npm install && npm run build

# חשיפת הפורט
EXPOSE 5000

# הפעלת השרת
CMD ["npm", "start"]
