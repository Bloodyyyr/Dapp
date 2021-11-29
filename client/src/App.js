import React, { Component } from "react";
import VotingContract from "./contracts/Voting.json";
import getWeb3 from "./getWeb3";
import OwnerSection from "./Component/ownerSection";


import "./App.css";

class App extends Component {
  state = { web3: null,
  accounts: null,
  contract: null,
  myOwner: null,
  voterRegister: [],
  numberTotalProposal: 0,
  countproposal: 0,
  proposal: null,
  winnersDescription: null,
  waitRegistered: [],
  proposalArray: [],
  etat: null
  };

  
  // Initialisation a la blockchain
  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = VotingContract.networks[networkId];
      const instance = new web3.eth.Contract(
        VotingContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // let myNumberProposal = await instance.methods.maxIndex().call();
      let myOwner = await instance.methods.owner().call();
      let myEtat = await instance.methods.voirEnumParString().call();
      

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3,
        accounts,
        contract: instance,
        myOwner: myOwner,
        etat: myEtat
        },
        
        );
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };
  //Variable qui compte le nombre de proposition
  count = this.state.countproposal;

  // Enregistration des proposition
  registerProposal = async () => {
    const { contract, accounts, proposalArray, numberTotalProposal } = this.state;
    let description = document.getElementById("propo").value;
    let proposalNumber = this.count ;
    let nombretotaldeproposition = numberTotalProposal

    await contract.methods.registerProposal(accounts[0], proposalNumber, description ).send({from: accounts[0]});

    proposalArray.push(description)
    nombretotaldeproposition ++;
    this.count ++;
    
    this.setState({ countproposal: this.count, proposalArray, numberTotalProposal: nombretotaldeproposition });
    
  }
 

  // Enregistrement des vote 
  voting = async () => {
    const { contract, accounts } = this.state

    let propositionvoté = document.getElementById("vote").value;
    propositionvoté --;
    
    
    await contract.methods.doTheVote(accounts[0], propositionvoté).send({from: accounts[0]});

  }

  //Affichage  de la proposition gagnante 
  propositionGagnante = async () => {
    const { contract } = this.state;

    const getwinneur = await contract.methods.winningProposalID().call();

    const winneur = await contract.methods.voirDescription(getwinneur).call();


    this.setState({ winnersDescription: winneur })



  }

   

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    const { myOwner, contract, accounts, voterRegister, waitRegistered, proposalArray, etat } = this.state

    
    
    console.log()
    
  

    return (
      <div className="App">
    
      
      
      <OwnerSection owner={ myOwner }
      contract= { contract }
      accounts= { accounts }
      voter= { voterRegister }
      wait= { waitRegistered }
      etat= { etat }
      
      />
      

      <br></br>

      <p> <evidence>Etape 2</evidence>: Enregistrer Votre propositon</p>
      <input type="text" placeholder="Entrez votre Proposition" id="propo"></input>
      <button name="Validation proposition" onClick={ this.registerProposal }  >Valider</button>
      <p> Liste des proposition a voté </p>
      { proposalArray.map((tableau) => { return (<div>{tableau}</div>)} ) }
      
      <hr></hr>
      
      <p><evidence>Etape 3</evidence>: Voté pour votre proposition preferé</p>
      <br></br>
      <input name="proposition a voté" id="vote" placeholder="Proposition Numero"></input>
      <button name="Confirmé le vote" onClick={ this.voting }>Voté</button>
      <hr></hr>

      <button name="Affiché le gagnant" onClick={ this.propositionGagnante }>Gagnant</button>
      <p>La proposition gagnante est : { this.state.winnersDescription }</p>
      

      </div>
    );
  }
}

export default App;
