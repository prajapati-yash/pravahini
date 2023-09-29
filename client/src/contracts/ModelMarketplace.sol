//SPDX-License-Identifier:MIT
pragma solidity ^0.8.0;
import "./UserAuthorization.sol";

contract ModelMarketplace{

    struct Model{
        string title;
        string description;
        string category;
        string keywords;
        uint256 modelPrice;
        string uploadLicense;
        string uploadModel;
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
    mapping(uint256 => Model) private models;
    uint256 private nextModelId;
    uint256[] private allModelIds;

    // Mapping to store the owner's address for each dataset
    mapping(uint256 => address) private modelOwners;

    // Mapping of Dataset Owners with the Dataset
    mapping(address => uint256[]) private ownersToModelMapping;

    // Mapping of Address with the datasetId 
    mapping(address => uint256[]) private userModelSubscriptions;

    // Mapping of purchased model with specific model Id and user address 
    mapping (address => mapping(uint256 => bool)) private purchaseMapping;

    function createModel(
        string memory _title,
        string memory _description,
        string memory _category,
        string memory _keywords,
        uint256 _modelPrice,
        string memory _uploadLicense,
        string memory _uploadModel,
        string memory _uploadUsageDocumentation,
        bool _isPublic,
        bool _isPrivate,
        bool _isForSale 
    ) public onlyAuthorized(){
        uint256 modelId = nextModelId;

        models[modelId] = Model(
            _title,
            _description,
            _category,
            _keywords,
            _modelPrice,
            _uploadLicense,
            _uploadModel,
            _uploadUsageDocumentation,
            _isPublic,
            _isPrivate,
            _isForSale,
            modelId
        );

        // Set the modelOwner as the creator of the Model
        modelOwners[modelId] = msg.sender;

        // Owners to Model Mapping
        ownersToModelMapping[msg.sender].push(modelId);

        // Add the Model Id to the all Models array
        allModelIds.push(modelId);

        // Increment the next model Id
        nextModelId++;
    }   

    // Only owner Modifier
    modifier onlyModelOwner(uint256 modelId){
        require(modelOwners[modelId]==msg.sender,"You're not the owner of this model");
        _;
    }


    // Function create Model Public 

    function setModelPublic(uint256 modelId) public onlyModelOwner(modelId){
        Model storage model = models[modelId];
        model.isPublic = true; //Set Model Public as true
        model.isPrivate = false;
        model.isForSale = false;
        model.modelPrice = 0; //Set Model Pice to zero
    }

    function setModelPrivate(uint256 modelId) public onlyModelOwner(modelId){
        Model storage model = models[modelId];
        model.isPublic = false;
        model.isPrivate = true; // Set Model Private as true
        model.isForSale = false;
        model.modelPrice = 0; //Set the Model Price to Zero
    } 

    function setModelForSale(uint256 modelId, uint256 _price) public onlyModelOwner(modelId){
        Model storage model = models[modelId];
        model.isPublic = false;
        model.isPrivate = false;
        model.isForSale = true; //Set Model for Sale as true
        model.modelPrice = _price; //Set the Model Price as per the input of the user
    }

    // Event to indicate the Model purchase
    event ModelPurchased(uint256 indexed modelId, address indexed buyer, address indexed owner, uint256 price);

    function  purchaseModel(uint256 modelId) public payable onlyAuthorized{
        Model storage model = models[modelId];
        require(model.isForSale,"Model is not for Sale");   
        

         // Transfer payment to the Model owner
        address ownerAddress = modelOwners[modelId];
        require(ownerAddress != msg.sender,"You are the owner of this Model, so you can't buy this model.");
        require(msg.value  >= model.modelPrice, "Insufficient Amount");

         // Check if the user has already bought this dataset
        uint256[] storage userSubscribedModels = userModelSubscriptions[msg.sender];
        for (uint256 i = 0; i < userSubscribedModels.length; i++) {
            require(userSubscribedModels[i] != modelId, "You have already bought this dataset.");
        }
        
        payable(ownerAddress).transfer(msg.value);
        purchaseMapping[msg.sender][modelId]=true;

        userModelSubscriptions[msg.sender].push(modelId);

        // Emit an event to indicate the dataset purchase
        emit ModelPurchased(modelId, msg.sender, ownerAddress, msg.value);
    }

    function getPurchaseStatus(uint256 modelId, address userAddress) public view returns (uint256) {
        if(purchaseMapping[userAddress][modelId]){
            return 1;
        } else{
            return 0;
        }
    }

    function getAllModels() public view returns(Model[] memory){
        Model[] memory allModels = new Model[](allModelIds.length);
        for(uint256 i =0; i<allModelIds.length;i++){
            allModels[i] = models[allModelIds[i]];
        }
        return allModels;
    }

    function getAllModelsOfUser() public view returns(Model[] memory){
        Model[] memory allModels = new Model[](ownersToModelMapping[msg.sender].length);
        uint256[] memory userModels = ownersToModelMapping[msg.sender];
        for(uint256 i =0; i<userModels.length;i++){
            allModels[i] =  models[userModels[i]];
        }
        return allModels;
    }

    function getAllModelsSubscriptionOfUser() public view returns(Model[] memory){
        Model[] memory allModels = new Model[](userModelSubscriptions[msg.sender].length);
        uint256[] memory userSubscriptionModels = userModelSubscriptions[msg.sender];
        for(uint256 i = 0;i<userSubscriptionModels.length; i++){
            allModels[i] = models[userSubscriptionModels[i]]; 
        }
        return allModels;
    }
}