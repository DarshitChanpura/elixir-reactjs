import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'reactstrap';
import classnames from 'classnames';

 /* referred from https://github.com/jdlehman/react-memory-game/ */

export default function run_game(root, channel) {
	ReactDOM.render(<Memory channel={channel}/>, root);
}
var timer=0;
class Memory extends React.Component {

	constructor(props) {
		super(props);
		this.renderCards= this.renderCards.bind(this);
		//this.isMatch = this.isMatch.bind(this);
		this.resetGame = this.resetGame.bind(this);
		this.channel = props.channel
		this.updateState = this.updateState.bind(this)

		this.state = {
			cards: [],
			openedCard: null,
			matchCount: 0,
			locked: false,
			clickCount: 0,
			mismatch: null
		};

		this.channel.join()
								.receive("ok",this.createState.bind(this))
								.receive("error",resp => "Error while joining")

	}

	createState(st1){
		this.setState(st1.game)
	}

	renderCards(cards,i) {
    return cards.map((card, index) => {
    	if(index >= i && index < i+4){
      return (
      		<Card key={index}
          value={card.character}
          id={index}
          matched={card.matched}
          flipped={card.flipped}
          handleClick = {this.handleClick.bind(this)} />

      );
      }
    });
  }

  handleClick(flipped,id,value) {


    if (!flipped) {
			clearTimeout(timer);
			//this.isMatch(value,id);
			this.channel.push("click", {id: id, value: value}).receive("ok", resp =>{this.updateState(resp.game,id,value)})
    }

  }

	updateState(stNew, id, val){
		//console.log("a;msdamsd");
		//console.log(stNew.mismatch);


		if(stNew.mismatch != null){
		 var cards = stNew.cards;
		 var misMatchIds = stNew.mismatch;
		 var matchCount = stNew.matchCount;
     cards[misMatchIds.id1].flipped = true;
     cards[misMatchIds.id2].flipped = true;

		 this.setState({cards: cards,
			 openedCard: stNew.openedCard,
			 locked: true,
			 mismatch: null,
			 matchCount: stNew.matchCount,
			 clickCount: stNew.clickCount});


 			// console.log(this.state);


			 //this.channel.push("update",{game: this.state}).receive("ok", resp => {console.log("Updated", resp)});

		 timer = setTimeout(() => {
			 cards[misMatchIds.id1].flipped = false;
			 cards[misMatchIds.id2].flipped = false;

			 this.setState({cards: cards,
 				openedCard: stNew.openedCard,
 				locked: false,
 				mismatch: null,
 				matchCount: stNew.matchCount,
 				clickCount: stNew.clickCount});
				this.channel.push("update",{game: this.state}).receive("ok", resp => {console.log("Updated", resp)});
 			}, 500);

			// console.log(this.state);
			// //this.channel.push("update",{game: this.state}).receive("ok", resp => {console.log("Updated", resp)})

		}
		else{

			this.setState({cards: stNew.cards,
				openedCard: stNew.openedCard,
				locked: false,
				mismatch: stNew.mismatch,
				matchCount: stNew.matchCount,
				clickCount: stNew.clickCount});

			//console.log(this.state);
			this.channel.push("update",{game: this.state}).receive("ok", resp => {console.log("Updated", resp)})
		}

	}

  // isMatch(val,id){
  //
  // 	/* to avoid multiple cards opened at once*/
  //
  // 	if(this.state.locked)
  // 		return;
  //
  //   var cards = this.state.cards;
  //   cards[id].flipped = true;
  //
  //   let state = this.state;
  // 	var count = state.clickCount + 1;
  // 	this.setState({clickCount : count});
  //
  //   this.setState({cards, locked: true});
  //   /* if there is an openedCard match it*/
  //   if (this.state.openedCard) {
  //
  //     if (val === this.state.openedCard.character) {
  //       var matchCount = this.state.matchCount;
  //       cards[id].matched = true;
  //       cards[this.state.openedCard.id].matched = true;
  //       this.setState({cards, openedCard: null, locked: false, matchCount: matchCount + 1});
  //     } else {
  //
	// 		setTimeout(() => {
	// 		  cards[id].flipped = false;
	// 		  cards[this.state.openedCard.id].flipped = false;
	// 		  this.setState({cards, openedCard: null, locked: false});
	// 		}, 1000);
	// 		}
  //   } else {
  //
  //     this.setState({
  //       openedCard: {id:id, character:val},
  //       locked: false
  //     });
  //   }
  //
  // }

  resetGame() {

    this.channel.push("reset").receive("ok", this.createState.bind(this))
  }



	render() {
		var win = "false";
		var clicks = this.state.clickCount;
	    if (this.state.matchCount === this.state.cards.length / 2) {

	    	win="true";
	    }


		return(
			<div className="container">
				<Win win={win} />
				<div className="row">
					{this.renderCards(this.state.cards,0)}
				</div>
				<div className="row">
					{this.renderCards(this.state.cards,4)}
				</div>
				<div className="row">
					{this.renderCards(this.state.cards,8)}
				</div>
				<div className="row">
					{this.renderCards(this.state.cards,12)}
				</div>

				<div className="row">
					<div className="clicks">
					Attempts : <strong>{clicks}</strong>
	        		</div>
					<div className="reset-btn" onClick={this.resetGame}>
					Reset
	        		</div>
	        	</div>
			</div>

		);

	}
}

function Win(params){
	if(params.win == "true")
	return(
		<div className="alert alert-success">

    		<strong>You Win!</strong>&nbsp;&nbsp;<i>Click Reset to play again.</i>
  		</div>
		);

	return null;
}

function Card(params){

	var classes = classnames(
      'box',
      {'box--flipped': params.flipped},
      {'box--matched': params.matched}
    );
  var cardCharacter = params.flipped ? params.value : '+';


  let fl = params.flipped;
  let id = params.id;
  let v = params.value;



	return (<div className="col-md cardCol">
						<div className={classes} onClick={() => params.handleClick(fl,id,v)}>
						<label className="cardVal">{cardCharacter}</label></div>
					</div>);
}


// function shuffleLetters(lett){
// 	var swapIndex,temp,i;
// 	for(i=lett.length;i>0;i--){
// 	swapIndex = Math.floor(Math.random() * i);
// 	temp=lett[i-1];
// 	lett[i-1]=lett[swapIndex];
// 	lett[swapIndex]=temp;
// 	}
// }


// function startCards(){
//
// 	var letters = ["A","B","C","D","E","F","G","H","A","B","C","D","E","F","G","H"];
// 	var randLetters =[];
// 	var i=0;
// 	shuffleLetters(letters);
//
//
//
// 	for(i=0; i< letters.length;i++)
// 	{
// 		randLetters.push({character : letters[i], flipped: false, matched:false});
// 	}
//
//
// 	return randLetters;
//
//
//
// }
