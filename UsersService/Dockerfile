# #build stage
# FROM node:20.10.0-alpine AS build
# WORKDIR /app
# COPY ./package*.json ./
# RUN npm install --silent --production=false
# COPY . .
# RUN npm run build

# #production stage
# FROM node:20.10.0-alpine
# COPY --from=build /app/package*.json ./
# RUN npm install --silent --production
# COPY --from=build /app/dist /dist
# EXPOSE 7000
# CMD ["npm", "start"]


# userservice Dockerfile
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
EXPOSE 6050

# הפעלת השרת
CMD ["npm", "start"]