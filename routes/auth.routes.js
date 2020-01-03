const {Router} = require("express")
const {check, validationResult} = require("express-validator") // (npm i express-validator)
const bcrypt = require("bcryptjs") // (npm i bcryptjs)
const jwt = require("jsonwebtoken") // (npm i jsonwebtoken)
const User = require("../models/User")
const config = require("config")

const router = Router()

// Обрабатываем запросы
//  /api/auth/register
router.post(
	"/register",
	[
		//вставляем массив middleware валидацию из библ.(express-validator)
		check("email", "Некоррекстный email").isEmail(),
		check("password", "Минимальная длина пароля 6 сиволов").isLength({min: 6}),
	],
	async (req, res) => {
		try {
			let errors = validationResult(req) // Отправляем входящие поля в валидатор и обрабатываем ошибки
			if (!errors.isEmpty()) {
				return res.status(400).json({
					errors: errors.array(),
					message: "Некорректные данные при регистрации",
				})
			}
			const {email, password} = req.body

			// Проверяем юзера в БД
			//(return нужен, что бы скрипт останавливался и дальше не выполнялся)
			const candidate = await User.findOne({email})
			if (candidate) {
				return res.status(400).json({message: "Такой пользователь уже существует"})
			}
			// Криптуем пароль юзера при помощи билб.(bcryptjs, ВНИМАНИЕ! Не перепутать библиотеку с bcrypt!!!)
			const hashedPassword = await bcrypt.hash(password, 12) // Криптуем пароль
			const user = new User({email, password: hashedPassword}) // Создаем нового юзера с (email и захешированным паролем)

			await user.save() // Ждем когда юзер сохранится
			res.status(201).json({message: "Пользователь создан"})
		} catch (err) {
			res.status(500).json({message: "Что то пошло не так"})
		}
	}
)

//   /api/auth/register
router.post(
	"/login",
	[check("email", "Введите коррекстный email").isEmail(), check("password", "Введите пароль").exists()],

	async (req, res) => {
		try {
			let errors = validationResult(req)
			if (!errors.isEmpty()) {
				return res.status(400).json({
					errors: errors.array(),
					message: "Некорректные данные при регистрации",
				})
			}
			const {email, password} = req.body

			// Проверяем юзера в БД
			//(return нужен, что бы скрипт останавливался и дальше не выполнялся)
			const user = await User.findOne({email})
			if (!user) {
				return res.status(400).json({message: "Пользователь не найден"})
			}
			const isMatch = await bcrypt.compare(password, user.password)
			if (!isMatch) {
				return res.status(400).json({message: "Неверный пароль, попробуйте снова"})
			}

			// Создаем Json Web Token для авторизации при помощи библ.(jsonwebtoken)
			// В первый параметр передаем данные, которые будет зашифрованы в токене {userId: user.id, ...}
			// Вторым параметром передаем секретную строку (берем из конфига)
			// Третий параметр - время существования токена
			const token = jwt.sign({userId: user.id}, config.get("jwtSecret"), {expiresIn: "1h"})

			// Отвечаем юзеру
			res.json({token, userId: user.id})

			// Криптуем пароль юзера при помощи билб.(bcryptjs, ВНИМАНИЕ! Не перепутать библиотеку с bcrypt!!!)
			const hashedPassword = await bcrypt.hash(password, 12) // Криптуем пароль
			user = new User({email, password: hashedPassword}) // Создаем нового юзера с (email и захешированным паролем)

			await user.save() // Ждем когда юзер сохранится
			res.status(201).json({message: "Пользователь создан"})
		} catch (err) {
			res.status(500).json({message: "Что то пошло не так"})
		}
	}
)

module.exports = router
