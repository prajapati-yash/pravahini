
//SPDX-License-Identifier:MIT
pragma solidity ^0.8.0;

contract UserAuthorization{
    // Struct to store user information
    struct User {
        string name;
        string occupation;
        string organization;
        string location;
        string image;
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
}