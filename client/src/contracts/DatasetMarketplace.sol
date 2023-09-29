// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./UserAuthorization.sol";

contract DatasetMarketplace {
    // Define the structure of a dataset
    struct Dataset {
        string title;
        string description;
        uint256 datasetPrice;
        string uploadLicense;
        string uploadDataset;
        string uploadDemoDataset;
        string uploadImage;
        string category;
        bool isPublic;
        bool isPrivate;
        bool isForSale;
        uint256 datasetId;
    }

    UserAuthorization public auth;
    constructor(address _authorizationAddress){
        auth = UserAuthorization(_authorizationAddress);
    } 

    modifier onlyAuthorized() {
        require(auth.isRegistered(msg.sender), "User is not Registered!");
        _;
    }


    // Function to set Dataset
    // Mapping to store datasets with their IDs
    mapping(uint256 => Dataset) private datasets;

    // Variable to keep track of the next available dataset ID
    uint256 private nextDatasetId;

    // Array to store all dataset IDs for easy retrieval
    uint256[] private allDatasetIds;

    // Mapping to store the owner's address for each dataset
    mapping(uint256 => address) private datasetOwners;

    // Mapping of Dataset Owners with their datasets
    mapping(address => uint256[]) private ownersToDatasetMapping;

    // Mapping of User Address with the subscribed datasets' IDs
    mapping(address => uint256[]) private userDatasetsSubscriptions;

     // Mapping of purchased dataset with specific dataset Id and user address
    mapping (address => mapping(uint256 => bool)) private purchaseMapping;

    // Function to create a new dataset
    function createDataset(
        string memory _title,
        string memory _description,
        uint256 _price,
        string memory _uploadLicense,
        string memory _uploadDataset,
        string memory _uploadDemoDataset,
        string memory _uploadImage,
        string memory _category,
        bool _isPublic,
        bool _isPrivate,
        bool _isForSale
    ) public onlyAuthorized() {
        uint256 datasetId = nextDatasetId;
        // Create a new dataset and store it in the datasets mapping
        datasets[datasetId] = Dataset(
            _title,
            _description,
            _price,
            _uploadLicense,
            _uploadDataset,
            _uploadDemoDataset,
            _uploadImage,
            _category,
            _isPublic,
            _isPrivate,
            _isForSale,
            datasetId
        );

        // Set the dataset owner as the creator of the dataset
        datasetOwners[datasetId] = msg.sender;

        // Update the owner's dataset mapping with the new dataset ID
        ownersToDatasetMapping[msg.sender].push(datasetId);

        // Add the Dataset ID in the allDatasetIds array for easy retrieval
        allDatasetIds.push(datasetId);
        // Increment the nextDatasetId for the next dataset
        nextDatasetId++;
    }

    // Modifier to ensure only the dataset owner can perform certain actions
    modifier onlyDatasetOwner(uint256 datasetId) {
        require(datasetOwners[datasetId] == msg.sender, "Sorry! you're not the owner of this Dataset!");
        _;
    }

    // Function to set a dataset as public
    function setDatasetPublic(uint256 datasetId) public onlyDatasetOwner(datasetId) {
        // Retrieve the dataset from storage
        Dataset storage dataset = datasets[datasetId];

        // Update dataset visibility and sale status
        dataset.isPublic = true;
        dataset.isPrivate = false;
        dataset.isForSale = false;
        dataset.datasetPrice = 0; // Reset datasetPrice to 0 if the dataset is not for sale
    }

    // Function to set a dataset as private
    function setDatasetPrivate(uint256 datasetId) public onlyDatasetOwner(datasetId) {
        // Retrieve the dataset from storage
        Dataset storage dataset = datasets[datasetId];

        // Update dataset visibility and sale status
        dataset.isPublic = false;
        dataset.isPrivate = true;
        dataset.isForSale = false;
        dataset.datasetPrice = 0; // Reset datasetPrice to 0 if the dataset is not for sale
    }

    // Function to set a dataset as for sale with a given price per data
    function setDatasetForSale(uint256 datasetId, uint256 datasetPrice) public onlyDatasetOwner(datasetId) {
        // Retrieve the dataset from storage
        Dataset storage dataset = datasets[datasetId];
        // Update dataset visibility and sale status
        dataset.isPublic = false;
        dataset.isPrivate = false;
        dataset.isForSale = true;
        dataset.datasetPrice = datasetPrice; // Set the datasetPrice to the given price for sale
    }

    // Function to retrieve dataset information based on the given datasetId
    function getDataset(uint256 datasetId) public view returns (Dataset memory) {
        return datasets[datasetId];
    }

    // Event to indicate the dataset purchase
    event DatasetPurchased(uint256 indexed datasetId, address indexed buyer, address indexed owner, uint256 price);

    // Function to Purchase the Dataset
    function purchaseDataset(uint256 datasetId) public payable onlyAuthorized {
        // Retrieve the dataset from storage
        Dataset storage dataset = datasets[datasetId];
        require(dataset.isForSale, "Dataset is not For Sale");

        // Transfer payment to the dataset owner
        address ownerAddress = datasetOwners[datasetId];

        // Ensure the buyer is not the owner of this Dataset
        require(ownerAddress != msg.sender, "You are the owner of this Dataset, so you can't buy this dataset.");
        require(msg.value >= dataset.datasetPrice, "Insufficient Payment");

         // Check if the user has already bought this dataset
        uint256[] storage userSubscribedDatasets = userDatasetsSubscriptions[msg.sender];
        for (uint256 i = 0; i < userSubscribedDatasets.length; i++) {
            require(userSubscribedDatasets[i] != datasetId, "You have already bought this dataset.");
        }

        payable(ownerAddress).transfer(msg.value);
        purchaseMapping[msg.sender][datasetId]=true;

        // Add the purchased dataset ID to the buyer's subscription list
        userDatasetsSubscriptions[msg.sender].push(datasetId);

        // Emit an event to indicate the dataset purchase
        emit DatasetPurchased(datasetId, msg.sender, ownerAddress, msg.value);
    }

    function getPurchaseStatus(uint256 datasetId, address userAddress) public view returns (uint256) {
        if(purchaseMapping[userAddress][datasetId]){
            return 1;
        } else{
            return 0;
        }
    }

    // Function to get all Datasets
    function getAllDatasets() public view returns (Dataset[] memory) {
        Dataset[] memory allDatasets = new Dataset[](allDatasetIds.length);
        for (uint256 i = 0; i < allDatasetIds.length; i++) {
            allDatasets[i] = datasets[allDatasetIds[i]];
        }
        return allDatasets;
    }

    // Function to get all Datasets of a user
    function getAllDatasetsOfUser() public view returns (Dataset[] memory) {
        // Retrieve the dataset IDs owned by the user
        uint256[] memory userDatasets = ownersToDatasetMapping[msg.sender];
        Dataset[] memory allDatasets = new Dataset[](userDatasets.length);
        for (uint256 i = 0; i < userDatasets.length; i++) {
            allDatasets[i] = datasets[userDatasets[i]];
        }
        return allDatasets;
    }

    // Function to get all Subscriptions of a user
    function getAllDatasetsSubscriptionOfUser() public view returns (Dataset[] memory) {
        // Retrieve the subscribed dataset IDs of the user
        uint256[] memory userSubscriptionsDatasets = userDatasetsSubscriptions[msg.sender];
        Dataset[] memory allDatasets = new Dataset[](userSubscriptionsDatasets.length);
        for (uint256 i = 0; i < userSubscriptionsDatasets.length; i++) {
            allDatasets[i] = datasets[userSubscriptionsDatasets[i]];
        }
        return allDatasets;
    }
}