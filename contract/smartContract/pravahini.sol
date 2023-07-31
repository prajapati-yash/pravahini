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
        // Mark the user as registered
        isRegistered[msg.sender] = true;
    }

    // Function to retrieve user information based on the given address
    function getUser(address _address) public view returns (User memory) {
        return registeredUserMapping[_address];
    }

    // Modifier to check whether user is Authorized or not
    modifier onlyAuthorized() {
        require(isRegistered[msg.sender], "User is not Registered!");
        _;
    }
    // Function to set Dataset
    mapping(uint256 => Dataset) private datasets;
    uint256 private nextDatasetId;
    uint256[] private allDatasetIds;

    // Mapping to store the owner's address for each dataset
    mapping(uint256 => address) private datasetOwners;

    // Mapping of Dataset Owners with the Dataset
    mapping(address => uint256[]) private ownersToDatasetMapping;

    // Mapping of Address with the datasetId 
    mapping(address => uint256[]) private userSubscriptions;

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
        // Check if the user is already registered or not
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

        // Set the dataset owner as the creator of the dataset
        datasetOwners[datasetId] = msg.sender;

        // Owners to Dataset Mapping
        ownersToDatasetMapping[msg.sender].push(datasetId);

        // Add the Dataset Id in the allDatasetIds array
        allDatasetIds.push(datasetId);
        // Increment the nextDatasetId for the next dataset
        nextDatasetId++;
    }

    // Function to set a dataset as public
    function setDatasetPublic(uint256 datasetId) public {
        require(datasetOwners[datasetId] == msg.sender, "Sorry! you're not the owner of this Dataset!");
        Dataset storage dataset = datasets[datasetId];
        dataset.isPublic = true;
        dataset.isPrivate = false;
        dataset.isForSale = false;
        dataset.datasetPrice = 0; // Reset datasetPrice if the dataset is not for sale
    }

    // Function to set a dataset as private
    function setDatasetPrivate(uint256 datasetId) public {
        require(datasetOwners[datasetId] == msg.sender, "Sorry! you're not the owner of this Dataset!");
        Dataset storage dataset = datasets[datasetId];
        dataset.isPublic = false;
        dataset.isPrivate = true;
        dataset.isForSale = false;
        dataset.datasetPrice = 0; // Reset datasetPrice if the dataset is not for sale
    }

    // Function to set a dataset as for sale with a given price per data
    function setDatasetForSale(uint256 datasetId, uint256 datasetPrice) public {
        require(datasetOwners[datasetId] == msg.sender, "Sorry! you're not the owner of this Dataset!");
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


    // Function to search Datasets by Title
    function searchDatasetByTitle(string memory keyword) public view returns(uint256[] memory){
        uint256[] memory searchResults;
        uint256 count = 0;
        for(uint256 i=0; i<nextDatasetId-1;i++){
            Dataset memory dataset = datasets[i];
            // Check if the dataset title contains the keyword
            if(contains(dataset.title, keyword)){
                searchResults[count]=i; //Store datasets Id in searchResults array
                count++;
            }
        }

        //Resize the searchResults array to remove any unused elements

        uint256[] memory result = new uint256[](count);
        for(uint256 i=0; i<count;i++){
            result[i] =searchResults[i];
        }

        return result;
    }

    // Check whether the specific keywoord contains a specific keyword

    function contains(string memory _str, string memory _keyword) internal pure returns (bool){
        bytes memory strBytes = bytes(_str);
        bytes memory keywordBytes = bytes(_keyword);
        uint256 keywordLength = keywordBytes.length;
        if(strBytes.length < keywordLength){
            return false;
        }

        for(uint256 i=0; i < strBytes.length - keywordLength; i++){
            bool found= true;

            for(uint256 j=0; j < keywordLength;j++){
                if(strBytes[i+j] != keywordBytes[j]){
                    found=false;
                    break;
                }
            }
 
            if(found){
                return true;
            }
        }
        return false;
    }

    // Function to purchase the Dataset

    // Event to indicate the dataset purchase
    event DatasetPurchased(uint256 indexed datasetId, address indexed buyer, address indexed owner, uint256 price);

    // Function to Purchase the Dataset
    function purchaseDataset(uint256 datasetId) public payable{
        Dataset storage dataset = datasets[datasetId];
        require(dataset.isForSale, "Dataset is not For Sale");
        require(msg.value == dataset.datasetPrice, "Insufficient Payment");

       // Transfer payment to the dataset owner
        address ownerAddress = datasetOwners[datasetId];
        payable(ownerAddress).transfer(msg.value);

        userSubscriptions[msg.sender].push(datasetId);

        // Emit an event to indicate the dataset purchase
        emit DatasetPurchased(datasetId, msg.sender, ownerAddress, msg.value);
    }

    // Get all Datasets
    function getAllDatasets() public view returns(Dataset[] memory){
        Dataset[] memory allDatasets = new Dataset[](allDatasetIds.length);
        for(uint256 i =0; i < allDatasetIds.length;i++){
            allDatasets[i] = datasets[allDatasetIds[i]];
        }
        return allDatasets;
    }

    // Get all Datasets of a user
    function getAllDatasetsOfUser() public view returns(Dataset[] memory){
        Dataset[] memory allDatasets = new Dataset[](ownersToDatasetMapping[msg.sender].length);
        uint256[] memory userDatasets = ownersToDatasetMapping[msg.sender];
        for(uint256 i =0; i < userDatasets.length;i++){
            allDatasets[i] = datasets[userDatasets[i]];
        }
        return allDatasets;
    }

    // Get all Subscriptions  of a user
    function getAllDatasetsSubscriptionOfUser() public view returns(Dataset[] memory){
        Dataset[] memory allDatasets = new Dataset[](userSubscriptions[msg.sender].length);
        uint256[] memory userSubscriptionsDatasets = userSubscriptions[msg.sender];
        for(uint256 i =0; i < userSubscriptionsDatasets.length;i++){
            allDatasets[i] = datasets[userSubscriptionsDatasets[i]];
        }
        return allDatasets;
    }

}
