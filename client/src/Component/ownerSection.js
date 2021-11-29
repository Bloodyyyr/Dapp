import React, { Component } from "react";
import WhiteListed from "./whiteListed"

class OwnerSection extends Component {

	state = {
		myOwner: this.props.owner,
		myAccounts: this.props.accounts,
		myContract: this.props.contract,
		voterRegister: this.props.voter,
		myWaitRegistered: this.props.wait,
		myEtat: this.props.etat,
		
	}
	
	

	// Enregistrement des votant
	registerVoter = async () => {

		const  { myAccounts, myContract, voterRegister, myWaitRegistered} = this.state
		const address = document.getElementById("on").value;

		await myContract.methods.registerVoter(address).send({from: myAccounts[0]});
		myWaitRegistered.pop();
		voterRegister.push(address);
		
		this.setState({ voterRegister, myWaitRegistered })
	}

	// Debut de la session de proposition
	startProposal = async () => {

		const { myContract, myAccounts } = this.state;
	
		await myContract.methods.startProposalRegistrationSession().send({from: myAccounts[0]});

		let status = await myContract.methods.voirEnumParString().call();
		
		
		this.setState({ myEtat: status })
	  }

	  //Fin de la Session de proposition 
  	endProposal = async () => {

    	const { myContract, myAccounts } = this.state;

    	await myContract.methods.endProposalRegistrationSession().send({from: myAccounts[0]})

		let status =   await myContract.methods.voirEnumParString().call(); 

		this.setState({ myEtat: status })
  	}

	  //Début de la session de vote 
	startVotingSession = async () => {

    	const { myContract, myAccounts } = this.state;

    	await myContract.methods.startVotingSession().send({from: myAccounts[0]})

		let status =  await myContract.methods.voirEnumParString().call();

		this.setState({ myEtat: status })
  	}

  	//Fin de la Session de vote
  	endVotingSession = async () => {

    	const { myContract, myAccounts } = this.state;

    	await myContract.methods.endVotingSession().send({from: myAccounts[0]})
		let status =  await myContract.methods.voirEnumParString().call();

		this.setState({ myEtat: status })
 	}
	
	// Calcul de la proposition gagnante
  	comptage = async () => {

		const { myContract, myAccounts } = this.state;
	
		await myContract.methods.tallyVotes().send({from: myAccounts[0]})

		let status =  await myContract.methods.voirEnumParString().call();

		this.setState({ myEtat: status })
  	}
	
	
	
	render() {
		

		const { myOwner, myContract, myAccounts, voterRegister, myWaitRegistered, myEtat }= this.state

		

		if(this.state.myAccounts == this.state.myOwner){
	
		return(
			
			<div>
				<h1> Systeme de vote </h1>
      			<p>Etat du contract: { myEtat }</p>
				<WhiteListed owner={ myOwner }
				contract={ myContract }
				accounts={ myAccounts }
				wait={ myWaitRegistered }
				myEtat={ myEtat }
				/>
				
				<p> Session proprietaire du contract Enregistre les votant </p>
				<input type="text" placeholder="Entrée votre adresse Ethereum" id="on"></input>
            	<button name="boutton d'enregistrement" type="button" onClick={ this.registerVoter } > Validation a la blockchain</button>
				{ voterRegister.map((chiff) => { return (  <div>{chiff}</div> )}) }
				<br></br>
				<p>Session d'enregistrement des proposition</p>
				<button name="Debut session proposition" onClick={ this.startProposal }>Début</button>
				<button name="fin de la session proposition" onClick={ this.endProposal }>Fin</button>
				<br></br>
				<p>Session de Vote</p>
				<button name="Debut de la session vote" onClick={ this.startVotingSession }>Début</button>
      			<button name="Fin de la session de vote" onClick={ this.endVotingSession }>Fin</button>
				<br></br>
				<button name="Choix de la proposition gagnante" onClick={ this.comptage }>Compte</button>
				<hr></hr>
			</div>
		)}else{
			return(<div>
			<h1> Systeme de vote </h1>
      			<p>Etat du contract: { myEtat }</p>
			<WhiteListed/>
				<h1>Acces Proprietaire</h1>
				<hr></hr>
			</div>)
		}

		}

}

export default OwnerSection;