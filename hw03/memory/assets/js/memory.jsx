import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'reactstrap';
import classnames from 'classnames';

 /* referred from https://github.com/jdlehman/react-memory-game/ */

export default function run_game(root) {
	ReactDOM.render(<Memory />, root);
}

class Memory extends React.Component {

	constructor(props) {
		super(props);
		this.renderCards= this.renderCards.bind(this);
		this.isMatch = this.isMatch.bind(this);
		this.reset = this.reset.bind(this);
		

		this.state = { 
			cards: startCards(),
			openedCard: null,
			matchCount: 0,
			locked : false,
			clickCount: 0
		};
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

		this.isMatch(value,id);
    }

  }


  isMatch(val,id){

  	/* to avoid multiple cards opened at once*/

  	if(this.state.locked)
  		return;

    var cards = this.state.cards;
    cards[id].flipped = true;

    let state = this.state;
	var count = state.clickCount + 1;
	this.setState({clickCount : count});

    this.setState({cards, locked: true});
    /* if there is an openedCard match it*/
    if (this.state.openedCard) {
		
      if (val === this.state.openedCard.character) {
        var matchCount = this.state.matchCount;
        cards[id].matched = true;
        cards[this.state.openedCard.id].matched = true;
        this.setState({cards, openedCard: null, locked: false, matchCount: matchCount + 1});
      } else {

			setTimeout(() => {
			  cards[id].flipped = false;
			  cards[this.state.openedCard.id].flipped = false;
			  this.setState({cards, openedCard: null, locked: false});
			}, 1000);
			}
    } else {

      this.setState({
        openedCard: {id:id, character:val},
        locked: false
      });
    }

  }

  reset() {
    this.setState({
      cards: startCards(),
      openedCard: null,
      locked: false,
      matchCount: 0,
      clickCount : 0
    });
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
					<div className="reset-btn" onClick={this.reset}>
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


function shuffleLetters(lett){
	var swapIndex,temp,i;
	for(i=lett.length;i>0;i--){
	swapIndex = Math.floor(Math.random() * i);
	temp=lett[i-1];
	lett[i-1]=lett[swapIndex];
	lett[swapIndex]=temp;
	}
}


function startCards(){

	var letters = ["A","B","C","D","E","F","G","H","A","B","C","D","E","F","G","H"];
	var randLetters =[];
	var i=0;
	shuffleLetters(letters);

	

	for(i=0; i< letters.length;i++)
	{
		randLetters.push({character : letters[i], flipped: false, matched:false});	
	}

		
	return randLetters;



}


