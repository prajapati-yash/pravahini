// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract pravahini {
    // Struct to store user information
    struct User {
        string name;
        string occupation;
        string organization;
        string location;
        string image;
    }

    //Struct to store the dataset
    struct Dataset {
        string title;
        string description;
        uint256 datasetPrice;
        string uploadLicense;
        string uploadDataset;
        string uploadImage;
        bool isPublic;
        bool isPrivate;
        bool isForSale;
    }

    // Mapping to associate each user's address with their User struct
    mapping(address => User) private registeredUserMapping;

    // Mapping to keep track of registered users
    mapping(address => bool) public isRegistered;

    // Function to set user information
    function setUser(
        string memory _name,
        string memory _occupation,
        string memory _organization,
        string memory _location,
        string memory _image
    ) public {
        // Check if the user is already registered or not
        require(!isRegistered[msg.sender], "User is already Registered!");

        // Store user information in the registeredUserMapping
        registeredUserMapping[msg.sender] = User(
            _name,
            _occupation,
            _organization,
            _location,
            _image
        );
        
        isRegistered[msg.sender] = true; // Mark the user as registered
    }

    // Function to retrieve user information based on the given address
    function getUser(address _address) public view returns (User memory) {
        return registeredUserMapping[_address];
    }

    // Function to Create Dataset
    mapping(uint256 => Dataset) private datasets;
    uint256 private nextDatasetId;
    uint256[] private allDatasetIds;

    // Mapping to store the owner's address for each dataset
    mapping(uint256 => address) private datasetOwners;

    // Mapping of Dataset Owners with the Dataset
    mapping(address => uint256[]) private ownersToDatasetMapping;

    // Function to create a new dataset
    function createDataset(
        string memory _title,
        string memory _description,
        string memory _uploadLicense,
        string memory _uploadDataset,
        string memory _uploadImage,
        uint256 _price,
        bool _isPublic,
        bool _isPrivate,
        bool _isForSale
    ) public {
        // Check if the user is registered or not
        require(isRegistered[msg.sender], "User is not Registered!");
        uint256 datasetId = nextDatasetId;

        // Create a new dataset and store it in the datasets mapping
        datasets[datasetId] = Dataset(
            _title,
            _description,
            _price, 
            _uploadLicense,
            _uploadDataset,
            _uploadImage,
            _isPublic, 
            _isPrivate, 
            _isForSale  
        );

        datasetOwners[datasetId] = msg.sender; // Set the dataset owner as the creator of the dataset
        ownersToDatasetMapping[msg.sender].push(datasetId); // Owners to Dataset Mapping
        allDatasetIds.push(datasetId); // Add the Dataset Id in the allDatasetIds array
        nextDatasetId++; // Increment the nextDatasetId for the next dataset
    }

    // Function to set a dataset as public
    function setDatasetPublic(uint256 datasetId) public {
        Dataset storage dataset = datasets[datasetId];
        dataset.isPublic = true;
        dataset.isPrivate = false;
        dataset.isForSale = false;
        dataset.datasetPrice = 0; // Reset datasetPrice if the dataset is not for sale
    }

    // Function to set a dataset as private
    function setDatasetPrivate(uint256 datasetId) public {
        Dataset storage dataset = datasets[datasetId];
        dataset.isPublic = false;
        dataset.isPrivate = true;
        dataset.isForSale = false;
        dataset.datasetPrice = 0; // Reset datasetPrice if the dataset is not for sale
    }

    // Function to set a dataset as for sale with a given price per data
    function setDatasetForSale(uint256 datasetId, uint256 datasetPrice) public {
        Dataset storage dataset = datasets[datasetId];
        dataset.isPublic = false;
        dataset.isPrivate = false;
        dataset.isForSale = true;
        dataset.datasetPrice = datasetPrice;
    }

    // Function to retrieve dataset information based on the given datasetId
    function getDataset(uint256 datasetId) public view returns (Dataset memory) {
        return datasets[datasetId];
    }

}