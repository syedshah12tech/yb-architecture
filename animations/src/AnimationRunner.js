import React, { Component } from 'react';
import './App.css';
import {Constants} from './constants';

var HelperFunctions = require('./HelperFunctions');

const RUN_MODE_CONTINUOUS = "CONTINOUS";

class AnimationRunner extends Component {
	constructor(props) {
		super(props);
		this.onPlayClicked = this.onPlayClicked.bind(this);
		this.onRestartClicked = this.onRestartClicked.bind(this);

		this.state = {
			animationPlaying: false,
		}
	}
	componentDidMount() {
		this.mainTextSect = document.getElementById('main-text-sect');
		// HelperFunctions.delayedNext(this,100);
		setTimeout(() => this.next(), 100);
	}
	changeMainText(text, onComplete) {
		HelperFunctions.setTextWithAnimation(this.mainTextSect, text, onComplete);
	}

	next(){
		this.setState({ animationPlaying: true });

		var promise = this.currentAnimation.onNext();
		promise.then( result => {
			console.log('Result: ' + JSON.stringify(result));
			this.setState({ animationPlaying: false });
			setTimeout(() => {
				if (this.runMode == RUN_MODE_CONTINUOUS ) {
					this.currentAnimation.resume();
					this.next();
				} else {
					this.currentAnimation.pause();
				}
			},
			(result.delay?result.delay:Constants.DEFAULT_DELAY));
		});
	}

	onPlayClicked() {
		this.next();
	}
	onRestartClicked() {
		this.restart();
	}

	restart() {
		window.location.reload();
	}

	render() {
		// In React, names starting with a capital letter will compile to the createComponent method
		// (credit: https://medium.com/@Carmichaelize/dynamic-tag-names-in-react-and-jsx-17e366a684e9)
		// This is done so that we can use animationToRun as a tag in the JSX below
		const Animation = this.props.animationToRun;

		return(
			<div className="animation-runner">
				<div className="control-btns">
					<button className="yb-btn" disabled={this.state.animationPlaying} onClick={this.onPlayClicked}>Play</button>
					<button className="yb-btn" onClick={this.onRestartClicked}>Restart</button>
				</div>
				<Animation ref={n => this.currentAnimation = n}></Animation>
				<div id="main-text-sect">
				</div>
			</div>
		)
	}
}

export default AnimationRunner;
