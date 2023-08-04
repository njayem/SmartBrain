import React, { Component } from "react";

class Register extends Component {
	constructor(props) {
		super(props);
		this.state = {
			email: "",
			password: "",
			name: "",
		};
	}

	onNameChange = (event) => {
		this.setState({ name: event.target.value });
	};

	// We need to create an onEmailChange function
	// that will listen to the onChange event of the email input
	onEmailChange = (event) => {
		this.setState({ signInEmail: event.target.value });
	};

	// We need to create an onPasswordChange function
	// that will listen to the onChange event of the password input
	onPasswordChange = (event) => {
		this.setState({ signInPassword: event.target.value });
	};

	onRegister = () => {
		// Fetch by default makes a GET request
		// We can pass an object as a second parameter and describe the request
		// to change the default GET request to a POST request
		fetch("http://localhost:3000/register", {
			method: "post",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				email: this.state.email,
				password: this.state.password,
				name: this.state.name,
			}),
		})
			.then((response) => response.json())
			.then((user) => {
				if (user) {
					this.props.loadUser(user);
					this.props.onRouteChange("home");
				}
			});
	};

	render() {
		return (
			<article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
				<main className="pa4 black-80">
					<div className="measure">
						<fieldset id="sign_up" className="ba b--transparent ph0 mh0">
							<legend className="f2 fw6 ph0 mh0">Register</legend>
							<div className="mt3">
								<label className="db fw6 lh-copy f6" htmlFor="name">
									Name
								</label>
								<input
									onChange={this.onNameChange}
									className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
									type="text"
									name="name"
									id="name"
								/>
							</div>
							<div className="mt3">
								<label className="db fw6 lh-copy f6" htmlFor="email-address">
									Email
								</label>
								<input
									onChange={this.onEmailChange}
									className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
									type="email"
									name="email-address"
									id="email-address"
								/>
							</div>
							<div className="mv3">
								<label className="db fw6 lh-copy f6" htmlFor="password">
									Password
								</label>
								<input
									onChange={this.onPasswordChange}
									className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
									type="password"
									name="password"
									id="password"
								/>
							</div>
						</fieldset>
						<div className="">
							<input
								className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
								type="submit"
								value="Register"
								onClick={this.onRegister}
							/>
						</div>
					</div>
				</main>
			</article>
		);
	}
}

export default Register;
