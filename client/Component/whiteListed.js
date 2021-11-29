import React, { Component } from "react";

class WhiteListed extends Component {
    
    state = {

        waitRegister: this.props.wait,
        owner: this.props.owner,
        contract: this.props.contract,
        accounts: this.props.accounts,

    }

    // Enregistrement dans le tabealu d'attente 
    register = async () => {
        const { contract, accounts, waitRegister } = this.state
        // Sélectionner l'élément input et récupérer sa valeur
        var input = document.getElementById("in").value;
        
        waitRegister.push(input);
        
        await contract.methods.AttenteDenregistrement(input).send({from:accounts[0]})
        this.setState({waitRegister})
        
    }
    // Suppréssion des enregister
    supprimeWaitList = () => {
        const { waitRegister } = this.state

        waitRegister.pop()

        this.setState({waitRegister})

    }
    
    

    render(){
        
        
    return(
        <div>
            <p><evidence>Etape 1</evidence>: Indiqué votre adresse Ethereum pour etre enregistrer </p>
            <input type="text" placeholder="Entrée votre adresse Ethereum" id="in"></input>
            <button name="boutton d'enregistrement" type="button" onClick={ this.register }>Enregistrement de votre addresse</button>
            <p>Liste des addresse en attente d'enregistrement</p>
            { this.state.waitRegister.map((tab) => { return (<div>{tab}</div>); }) }
            <button name="Supprimé le dernier element de la liste" onClick={ this.supprimeWaitList }> Supprimé</button>
            <p> Si votre addresse n'est plus dans ce tableau c'est que vous ete enregistrez </p>
            <hr></hr>
		</div>

        
    )
    }
}

export default WhiteListed;