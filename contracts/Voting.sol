// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

//@title Systeme de Vote
//@notice Enregister les votant, les proposition ainsi que le vote
contract Voting is Ownable {

    
    struct Voter {
        bool waitRegister;
        bool isRegistered;
        bool hasVoted;
        uint votedProposalId;
    }
    
    
    struct Proposal {
        string description;
        uint voteCount;
    }
    
    
    enum WorkflowStatus {
        RegisteringVoters,
        ProposalsRegistrationStarted,
        ProposalsRegistrationEnded,
        VotingSessionStarted,
        VotingSessionEnded,
        VotesTallied
    }


    event VoterRegistered(address voterAddress);
    event ProposalsRegistrationStarted();
    event ProposalsRegistrationEnded();
    event ProposalRegistered(uint proposalId);
    event VotingSessionStarted();
    event VotingSessionEnded();
    event Voted (address voter, uint proposalId);
    event VotesTallied();
    event WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus
        newStatus);
    
   
    
    mapping(address=> Voter) public voters;
    mapping(uint=> Proposal) public proposals;
   
    uint public winningProposalID;
    
    uint public maxIndex;
    
    address[] public addressWaitRegistration;
    
    
    WorkflowStatus status = WorkflowStatus.RegisteringVoters;
    
    
    
    
    modifier isRightWorkflowStatus(WorkflowStatus _expectedStatus){
        require(status == _expectedStatus);
        _;
    }
    
    function tailleDuTableau() public view returns(uint){
        return addressWaitRegistration.length;
    }
    
    function attenteDenregistrement(address _voterAddress) public isRightWorkflowStatus(WorkflowStatus.RegisteringVoters){
        require(voters[_voterAddress].waitRegister == false);
        
        addressWaitRegistration.push(_voterAddress);
        voters[_voterAddress].waitRegister = true;
    }
    
    
    function voirEnumParString() public view returns(string memory){
        
        if(WorkflowStatus.RegisteringVoters == status) return "Enregistrement des votant";
        if(WorkflowStatus.ProposalsRegistrationStarted == status) return "Enregistrement des proposition";
        if(WorkflowStatus.ProposalsRegistrationEnded == status) return "Fin de la session des proposition";
        if(WorkflowStatus.VotingSessionStarted == status) return "Session de vote";
        if(WorkflowStatus.VotingSessionEnded == status) return "Fin de la session de vote";
        if(WorkflowStatus.VotesTallied == status) return "Comptage";
    }
    
    
    
    //@title Enregistrement
    //@notice Enregistre les adresse des votant et les passe en enregistré 
    //@param Verifie si l'adresse est bien en False sur enregistrement avant de la passé en vrai si elle ne l'ai pas 
    function registerVoter(address _voterAddress) public onlyOwner isRightWorkflowStatus(WorkflowStatus.RegisteringVoters){
    
        require(voters[_voterAddress].isRegistered == false);
        require(voters[_voterAddress].waitRegister == true);
        voters[_voterAddress].isRegistered = true;
        emit VoterRegistered(_voterAddress);
        
    }
    
    
    
    //@title changement de statut  
    //@notice Change le statut pour progressé dans la session de vote 
    //@param Verifie le statut actuel et le change pour le statut suivant 
    function startProposalRegistrationSession() public onlyOwner isRightWorkflowStatus(WorkflowStatus.RegisteringVoters){
        
        status = WorkflowStatus.ProposalsRegistrationStarted;
        
        emit WorkflowStatusChange(WorkflowStatus.RegisteringVoters, status);
        emit ProposalsRegistrationStarted();
    }
    
    //@title Enregistrement des proposition 
    //@notice Enregistre les proposition des votant enregistré , ainsi que leurs description
    function registerProposal(address _voter, uint _proposalId, string memory _description) isRightWorkflowStatus(WorkflowStatus.ProposalsRegistrationStarted) public {
        
        require(voters[_voter].isRegistered == true);
        
        proposals[_proposalId].description = _description;
        maxIndex = maxIndex + 1;
        
        emit ProposalRegistered(_proposalId);
    }
    
    //@title Fin des Propositions 
    //@notice Verifie le statut actuel et le change pour le suivant 
    function endProposalRegistrationSession() onlyOwner isRightWorkflowStatus(WorkflowStatus.ProposalsRegistrationStarted) public {
      
        status = WorkflowStatus.ProposalsRegistrationEnded;
        
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationStarted, status);
        emit ProposalsRegistrationEnded();
    }
    
    //@title Debut de la session de vote 
    //@notice VErifie le statut actuel et le change pour le suivant 
    function startVotingSession() onlyOwner isRightWorkflowStatus(WorkflowStatus.ProposalsRegistrationEnded) public{
        
        status = WorkflowStatus.VotingSessionStarted;
        
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationEnded, status);
        emit VotingSessionStarted();
    }
    
    //@title Debut des votes 
    //@notice Verifie que l'adresse votant n'est pas deja voté , Le fais voté et enrigistre sont vote 
    function doTheVote(address _voter, uint _proposalId) isRightWorkflowStatus(WorkflowStatus.VotingSessionStarted) public{
        
        require(voters[_voter].hasVoted == false);
        
        require(bytes(proposals[_proposalId].description).length != 0);
        
        voters[_voter].hasVoted = true;
        proposals[_proposalId].voteCount = proposals[_proposalId].voteCount + 1;
        voters[_voter].votedProposalId = _proposalId;
        
        emit Voted(_voter, _proposalId);
    }
    
    //@title fin de la session de vote 
    //@notice Verifie le statut actuel et le change pour le suivant 
    function endVotingSession() onlyOwner isRightWorkflowStatus(WorkflowStatus.VotingSessionStarted) public{
        
        status = WorkflowStatus.VotingSessionEnded;
        
        emit WorkflowStatusChange(WorkflowStatus.VotingSessionEnded, status);
        emit VotingSessionEnded();
    }
    
    //@title Compte des vote 
    //@notice Compte les vote et enregistre la proposition avec le plus de voie
    function tallyVotes() public{
        uint winningVoteCount = 0;

        status = WorkflowStatus.VotesTallied;
        
        for(uint pos = 0; pos < maxIndex; pos++){
        
            if (proposals[pos].voteCount > winningVoteCount){
                winningVoteCount = proposals[pos].voteCount;
                winningProposalID = pos;
                
            }

            }
            
            emit WorkflowStatusChange(WorkflowStatus.VotingSessionEnded, status);
            emit VotesTallied();
            
        }
}