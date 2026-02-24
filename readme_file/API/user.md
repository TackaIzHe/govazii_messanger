#### Получить пользователя по id
Method: `GET`

Path: `/user/:id`

Response:

	`status: 200`
``` json
	json:
	{
		id:number,
		name:string,
		ava:string,
		reviews:Array<Reviews>
	}
```
Errors:

	`badData: {status: 406, json: "Bad Data!!!!"}`
	`notFound: {status: 404, json: "Not found"}`
	`serverError: {status: 500, json: "Internal server error!!!!"}`
- - -
#### Получить всех пользователей
Method: `GET`

Path: `/user/`

Response:

	`status: 200`
``` json
	json:
	[
		{
			id:number,
			name:string,
			ava:string,
			reviews:Array<Reviews>
		}, 
		...
	]
```
Errors:

	`notFound: {status: 404, json: "Not found"}`
	`serverError: {status: 500, json: "Internal server error!!!!"}`
- - -
#### Регистрация пользователя
Method: `POST`

Path: `/user/register`

Request:
``` JSON
	Body:
	{
		name:string,
		email:string,
		password:string
	}
```
Response:

	`status: 201, json: "Пользователь зареган"`
Errors:

	`badData: {status: 406, json: "Bad Data!!!!"}`
	`emailExist: {status: 404, json: "Email exist"}`
	`serverError: {status: 500, json: "Internal server error!!!!"}`
- - -
#### Авторизация пользователя
Method: `POST`

Path: `/user/loggin`

Request:
``` JSON
	Body:
	{
		email:string,
		password:string
	}
```
Response:

	`status: 200, json: "Авторизован"`
	`coockie: {Session: token} Время жизни 2 часа`
Errors:
	
	`badData: {status: 406, json: "Bad Data!!!!"}`
	`notFound: {status: 404, json: "Not found"}`
	`badTryLogIn: {status: 404, json: "Куда лезим"}`
	`serverError: {status: 500, json: "Internal server error!!!!"}`
- - -
#### Изменение пароля пользователя
Method: `POST`

Path: `/user/chang_password`

Request:
``` JSON
	Body:
	{
		oldPassword:string,
		newPassword:string
	}
```
	`cookie: {Session: token}`
Response:

	`status: 200, json: "Пароль изменён"`
Errors:

	`badData: {status: 406, json: "Bad Data!!!!"}`
	`serverError: {status: 500, json: "Internal server error!!!!"}`
- - -
### Удаление акаунта
Method: `DELETE`

Path: `/user/`

Request:

	`cookie: {Session: token}`
Response:

	`status: 200, json: "Ак удалён"`
Errors:

	`badData: {status: 406, json: "Bad Data!!!!"}`
	`notFound: {status: 404, json: "Not found"}`
	`serverError: {status: 500, json: "Internal server error!!!!"}`
- - -
### Изменение имени
Method: `PUT`

Path: `/user/set_name`

Request:
``` JSON
	Body:
	{
		name:string
	}
```
	`cookie: {Session: token}`
Response:

	`status: 200, json: "Имя изменино"`
Errors:

	`badData: {status: 406, json: "Bad Data!!!!"}`
	`notFound: {status: 404, json: "Not found"}`
	`serverError: {status: 500, json: "Internal server error!!!!"}`
- - -
### Изменение аватарки
Method: `PUT`

Path: `/user/set_ava`

Request:
``` JSON
	Body:
	{
		ava:<form-data>File
	}
```
	`coockie: {Session: token}`
Response:

	`status:200, json: "Ава изменина"`
Errors:

	`badData: {status: 406, json: "Bad Data!!!!"}`
	`notFound: {status: 404, json: "Not found"}`
	`serverError: {status: 500, json: "Internal server error!!!!"}`
- - -