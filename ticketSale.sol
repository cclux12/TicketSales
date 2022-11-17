pragma solidity ^0.8.17;

contract ticketSale { 
 
    // <contract_variables> 


    address public manager;
    address payable[] public attendee;
    uint public totalTickets;
    uint public cost;
    

    mapping(address => uint) public ticketOwners;
    mapping(uint => bool) public isSold;
    mapping(uint => bool) public isValid;
    mapping(address => address) public swappers;

    
    
    
 
    // </contract_variables> 
 
    constructor(uint numTickets, uint price) public { 
        // TODO 
      manager = msg.sender;
      totalTickets  = numTickets ;
      cost = price;

    } 
    
    function buyTicket(uint ticketId) public payable returns(string memory, bool , bytes memory) { 
        // TODO

        bytes memory data;
        bool success;
        string memory message;

    
        // check if enough ether supplied
        require(msg.value == cost, "amount of Ether not enough.");

        //check if owner is already in the ticketowner array
        require(ticketOwners[msg.sender] == 0, "User already has a ticket");

        //check if the ticket is already sold
        require(!isSold[ticketId], "Ticket already sold");

        //check if the ticket is valid
        //require(isValid[ticketId], "Ticket not valid");
        require(ticketId <= totalTickets, "Ticket not valid" );
       

        //All the conditions are met, now we will perform the transaction

        //Send ether from sender to manager
        (success, data)= manager.call{value: cost}("");
        message = " Your purchase is successful";

        //Mark the ticket as sold
        isSold[ticketId] = true;

        //Assign ticketID to that buyer
        ticketOwners[msg.sender] = ticketId;
        return(message, success, data);

    }

    
    function getTicketOf(address person) public view returns (uint) { 
        // TODO 
        return ticketOwners[person];
    } 
 
    function offerSwap(address partner) public { 
        // TODO 

        //Check if sender has ticket
        require(ticketOwners[msg.sender] != 0, "Sender does not have a ticket");
        require(ticketOwners[partner] != 0, "Receiver does not have a ticket");

        swappers[msg.sender] = partner;
        
    } 
 
    function acceptSwap(address partner) public { 
        // TODO 

        //Validate that they have already made that arrangement
        require(swappers[partner] == msg.sender);

        //Swap the ticketID
        uint tempID = ticketOwners[msg.sender];

        ticketOwners[msg.sender] = ticketOwners[partner];
        ticketOwners[partner] = tempID;

        //delete the swapoffer
        delete swappers[msg.sender];
    } 
}

    
    
    
 