//SPDX-License-Identifier:MIT
pragma solidity ^0.8.0;
import "./UserAuthorization.sol";

contract AIAgentMarketplace{

    struct AIAgent{
        string title;
        string description;
        string category;
        uint256 AIAgentPrice;
        string uploadLicense;
        string uploadAIAgent;
        string uploadUsageDocumentation;
        bool isPublic;
        bool isPrivate;
        bool isForSale;
        uint256 modelId;
    }

    UserAuthorization public auth;
    constructor(address _authorizationAddress){
        auth = UserAuthorization(_authorizationAddress);
    } 

    modifier onlyAuthorized() {
        require(auth.isRegistered(msg.sender), "User is not Registered!");
        _;
    }

    // Function to create Model
    mapping(uint256 => AIAgent) private agents;
    uint256 private nextAIAgentId;
    uint256[] private allAIAgentIds;

    // Mapping to store the owner's address for each dataset
    mapping(uint256 => address) private AIAgentOwners;

    // Mapping of Dataset Owners with the Dataset
    mapping(address => uint256[]) private ownersToAIAgentMapping;

    // Mapping of Address with the datasetId 
    mapping(address => uint256[]) private userAIAgentSubscriptions;

    // Mapping of purchased model with specific model Id and user address 
    mapping (address => mapping(uint256 => bool)) private purchaseMapping;

    function createAIAgent (
        string memory _title,
        string memory _description,
        string memory _category,
        uint256 _AIAgentPrice,
        string memory _uploadLicense,
        string memory _uploadAIAgent,
        string memory _uploadUsageDocumentation,
        bool _isPublic,
        bool _isPrivate,
        bool _isForSale 
    ) public onlyAuthorized(){
        uint256 AIAgentId = nextAIAgentId;

        agents[AIAgentId] = AIAgent(
            _title,
            _description,
            _category,
            _AIAgentPrice,
            _uploadLicense,
            _uploadAIAgent,
            _uploadUsageDocumentation,
            _isPublic,
            _isPrivate,
            _isForSale,
            AIAgentId
        );

        // Set the modelOwner as the creator of the Model
        AIAgentOwners[AIAgentId] = msg.sender;

        // Owners to Model Mapping
        ownersToAIAgentMapping[msg.sender].push(AIAgentId);

        // Add the Model Id to the all Models array
        allAIAgentIds.push(AIAgentId);

        // Increment the next model Id
        nextAIAgentId++;
    }   

    // Only owner Modifier
    modifier onlyAIAgentOwner(uint256 AIAgentId){
        require(AIAgentOwners[AIAgentId]==msg.sender,"You're not the owner of this model");
        _;
    }


    // Function create Model Public 

    function setAIAgentPublic(uint256 AIAgentId) public onlyAIAgentOwner(AIAgentId){
        AIAgent storage agent = agents[AIAgentId];
        agent.isPublic = true; //Set Model Public as true
        agent.isPrivate = false;
        agent.isForSale = false;
        agent.AIAgentPrice = 0; //Set Model Pice to zero
    }

    function setAIAgentPrivate(uint256 AIAgentId) public onlyAIAgentOwner(AIAgentId){
        AIAgent storage agent = agents[AIAgentId];
        agent.isPublic = false;
        agent.isPrivate = true; // Set Model Private as true
        agent.isForSale = false;
        agent.AIAgentPrice = 0; //Set the Model Price to Zero
    } 

    function setAIAgentForSale(uint256 AIAgentId, uint256 _price) public onlyAIAgentOwner(AIAgentId){
        AIAgent storage agent = agents[AIAgentId];
        agent.isPublic = false;
        agent.isPrivate = false;
        agent.isForSale = true; //Set Model for Sale as true
        agent.AIAgentPrice = _price; //Set the Model Price as per the input of the user
    }

    // Event to indicate the Model purchase
    event AIAgentPurchased(uint256 indexed AIAgentId, address indexed buyer, address indexed owner, uint256 price);

    function  purchaseAIAgent(uint256 AIAgentId) public payable onlyAuthorized{
        AIAgent storage agent = agents[AIAgentId];
        require(agent.isForSale,"Model is not for Sale");   
        

         // Transfer payment to the Model owner
        address ownerAddress = AIAgentOwners[AIAgentId];
        require(ownerAddress != msg.sender,"You are the owner of this Model, so you can't buy this model.");
        require(msg.value  >= agent.AIAgentPrice, "Insufficient Amount");

         // Check if the user has already bought this dataset
        uint256[] storage userSubscribedAIAgent = userAIAgentSubscriptions[msg.sender];
        for (uint256 i = 0; i < userSubscribedAIAgent.length; i++) {
            require(userSubscribedAIAgent[i] != AIAgentId, "You have already bought this dataset.");
        }
        
        payable(ownerAddress).transfer(msg.value);
        purchaseMapping[msg.sender][AIAgentId]=true;

        userAIAgentSubscriptions[msg.sender].push(AIAgentId);

        // Emit an event to indicate the dataset purchase
        emit AIAgentPurchased(AIAgentId, msg.sender, ownerAddress, msg.value);
    }

    function getPurchaseStatus(uint256 AIAgentId, address userAddress) public view returns (uint256) {
        if(purchaseMapping[userAddress][AIAgentId]){
            return 1;
        } else{
            return 0;
        }
    }

      function getAllAIAgents() public view returns(AIAgent[] memory){
        AIAgent[] memory allAIAgents = new AIAgent[](allAIAgentIds.length);
        for(uint256 i =0; i<allAIAgentIds.length;i++){
            allAIAgents[i] = agents[allAIAgentIds[i]];
        }
        return allAIAgents;
    }

    function getAllAIAgentsOfUser() public view returns(AIAgent[] memory){
        AIAgent[] memory allAIAgents = new AIAgent[](ownersToAIAgentMapping[msg.sender].length);
        uint256[] memory userAIAgents = ownersToAIAgentMapping[msg.sender];
        for(uint256 i =0; i<userAIAgents.length;i++){
            allAIAgents[i] =  agents[userAIAgents[i]];
        }
        return allAIAgents;
    }

    function getAllAIAgentsSubscriptionOfUser() public view returns(AIAgent[] memory){
        AIAgent[] memory allAIAgents = new AIAgent[](userAIAgentSubscriptions[msg.sender].length);
        uint256[] memory userSubscriptionAIAgents = userAIAgentSubscriptions[msg.sender];
        for(uint256 i = 0;i<userSubscriptionAIAgents.length; i++){
            allAIAgents[i] = agents[userSubscriptionAIAgents[i]]; 
        }
        return allAIAgents;
    }

    // Function to get the creator (owner) of an AI agent by its ID
        function getAIAgentOwner(uint256 AIAgentId) public view returns (address) {
            return AIAgentOwners[AIAgentId];
        }

}