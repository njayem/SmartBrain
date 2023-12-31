import React, { Component } from "react";
import "./Signin.css";

// We need to convert this function into a class
// because we need to use state

// It is okay to have more than 1 smart component in a project
// As long as this state is just concerned with sign in
class Signin extends Component {
	constructor(props) {
		super(props);
		this.state = {
			signInEmail: "",
			signInPassword: "",
		};
	}

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

	onSubmitSignIn = () => {
		// Fetch by default makes a GET request
		// We can pass an object as a second parameter and describe the request
		// to change the default GET request to a POST request
		fetch("http://localhost:3000/signin", {
			method: "post",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				email: this.state.signInEmail,
				password: this.state.signInPassword,
			}),
		})
			.then((response) => response.json())
			.then((user) => {
				if (user.id) {
					this.props.loadUser(user);
					this.props.onRouteChange("home");
				}
			});
	};

	render() {
		const { onRouteChange } = this.props;
		return (
			<article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
				<main className="pa4 black-80 center">
					<div className="measure">
						<fieldset id="sign_up" className="ba b--transparent ph0 mh0">
							<legend className="f2 fw6 ph0 mh0">Sign In</legend>
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
								value="Sign in"
								onClick={this.onSubmitSignIn}
							/>
						</div>
						<div className="lh-copy mt3">
							<p
								className="register f6 link dim black db"
								onClick={() => onRouteChange("register")}>
								Register
							</p>
						</div>
					</div>
				</main>
			</article>
		);
	}
}

export default Signin;
