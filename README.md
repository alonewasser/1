<<<<<<< HEAD
# revisorvision
=======
# revisorvision

# создать таблицу в базе данных с schema.prisma

 > prisma db pull

# выполнить миграцию в базу данных

 >  npx prisma migrate dev --name first

# запуск сервера

 > npm run start



Все доступные роуты:

http://localhost:5000/auth/register        // POST    

http://localhost:5000/auth/login          // POST

http://localhost:5000/task               // POST

http://localhost:5000/auth/me           // GET

http://localhost:5000/task/{id}        // DELETE

http://localhost:5000/task/{id}       // PATCH

>>>>>>> 34d4650 (Мой первый коммит)
