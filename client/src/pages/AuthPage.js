import React, {useState} from "react"

export const AuthPage = () => {
	const [form, setForm] = useState({email: "", password: ""})
	const changeHandler = e => {
		setForm({...form, [e.target.name]: e.target.value})
		console.log(e.target.value)
	}

	return (
		<div className="row">
			<div className="col s6 offset-s3"></div>
			<h1>Сократи ссылку</h1>

			<div className="card blue darken-1">
				<div className="card-content white-text">
					<span className="card-title">Авторизация</span>
					<div>
						<div className="input-field s6">
							<input id="email" type="text" className="yellow-input validate" onChange={changeHandler} />
							<label htmlFor="email">Email</label>
						</div>
						<div className="input-field s6">
							<input id="password" type="text" className="yellow-input" onChange={changeHandler} />
							<label htmlFor="password">Пароль</label>
						</div>
					</div>
				</div>
				<div className="card-action">
					<a className="btn" href="#">
						This is a link
					</a>
					<a className="btn" href="#">
						This is a link
					</a>
				</div>
			</div>
		</div>
	)
}
