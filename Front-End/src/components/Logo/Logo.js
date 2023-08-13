import React from "react";
import Tilt from "react-parallax-tilt";
import "./Logo.css";
import brain from "./brain.png";

const Logo = () => {
	return (
		<div className="ma4 mt0">
			<Tilt
				className="Tilt-inner b2 shadow-2"
				style={{
					margin: "0",
					padding: "0",
					height: "150px",
					width: "150px",
				}}>
				<div>
					<img style={{ paddingTop: "25px" }} src={brain} alt="logo" />
				</div>
			</Tilt>
		</div>
	);
};

export default Logo;
