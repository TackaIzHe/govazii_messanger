# Говяжий Месанджер
---
### Маршруты
+ User
	 1.  `GET /user/:id ` - Получить пользователя по id
	 2.  `GET /user/` - Получить всех пользователей
	 3.  `POST /user/register` - Регистрация пользователя
	    + Request: `Body:{name:string, email:string, password:string}`
	    + Response: `status: 201, json: "Пользователь зареган"`
	 4.  `POST /user/loggin` - Авторизация пользователя
	    + Request `Body: {email:string, password:string}`
	    + Response `coockie: Session Время жизни 2 часа`
	 5.  `POST /user/chang_password` - Изменение пароля пользователя
	    + Request `Body: {oldPassword:string, newPasswdord:string} Coockie: Session`
	    + Response `status: 200, json: "Пароль изменён"`