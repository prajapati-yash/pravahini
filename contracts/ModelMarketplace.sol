//SPDX-License-Identifier:MIT
pragma solidity ^0.8.0;

import "./UserAuthorization.sol";

contract ModelMarketplace is UserAuthorization{

    struct Model{
        string title;
        string description;
        string category;
        uint256 modelPrice;
        string uploadLicense;
        string uploadModel;
        string uploadUsageDocumentation;
        bool isPublic;
        bool isPrivate;
        bool isForSale;

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


    function createModel(
        string memory _title,
        string memory _description,
        string memory _category,
        string memory _uploadLicense,
        string memory _uploadModel,
        string memory _uploadUsageDocumentation,
        uint256 _modelPrice,
        bool _isPublic,
        bool _isPrivate,
        bool _isForSale 
    ) public onlyAuthorized{
        uint256 modelId = nextModelId;

        models[modelId] = Model(
            _title,
            _description,
            _category,
            _modelPrice,
            _uploadLicense,
            _uploadModel,
            _uploadUsageDocumentation,
            _isPublic,
            _isPrivate,
            _isForSale
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
        require(msg.value  >= model.modelPrice, "Insufficient Amount");

         // Transfer payment to the Model owner
        address ownerAddress = modelOwners[modelId];
        require(ownerAddress != msg.sender,"You are the owner of this Model, so you can't buy this model.");
        payable(ownerAddress).transfer(msg.value);

        userModelSubscriptions[msg.sender].push(modelId);

        // Emit an event to indicate the dataset purchase
        emit ModelPurchased(modelId, msg.sender, ownerAddress, msg.value);
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