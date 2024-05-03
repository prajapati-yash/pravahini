import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CommentSection } from 'react-comments-section';
import 'react-comments-section/dist/index.css';
import Cookies from "js-cookie";
import { authorizationInstance } from "../components/Contract";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import axios from 'axios';
import './comment.css'

function Comment() {
    const { address } = useAccount();
    const [userName, setUserName] = useState(null);
    const [img, setImg] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [singleData, setSingleData] = useState([]);
    const [id, setId] = useState(null);
    const location = useLocation();
    const [comments, setComments] = useState([]);
    const [showCount, setShowCount] = useState(7); // Initial number of comments to show
    const [showAll, setShowAll] = useState(false); 
      
    const toggleShowAll = () => {
        setShowAll(!showAll);
        setShowCount(showAll ? 7 : singleData.length); // Show only 7 comments when toggling to "View Less"
    };
    const visibleComments = showAll ? singleData : singleData.slice(0, showCount);

    const dataset = location.state ? location.state.data : "";
    const DatasetId = dataset.length > 11 && dataset[11] && dataset[11]._hex
  ? parseInt(dataset[11]._hex, 16)
  : null;

    const token = Cookies.get("jwtToken");
    const tokenHeaders = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

//comment store
    const sendUserDataToBackend = async (userData) => {
        try {
            let response;
            // console.log(userData)
            if (window.location.pathname === "/model-marketplace/single-model") {
                response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/model/comment`,userData,tokenHeaders);
            } else {
                response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/dataset/comment`, userData,tokenHeaders);
            }
            console.log('User data saved successfully');
        } catch (error) {
            console.error('Error saving user data:', error);
        }
    };

//reply 
    const postReply = async (newReply) => {
        // console.log(data.repliedToCommentId);
       

        if (window.location.pathname === "/model-marketplace/single-model") {
            axios.put(`${process.env.REACT_APP_BACKEND_URL}/model/comment/reply`, newReply,tokenHeaders).then(response => {
                // Handle the response from the server
                // console.log(response.data);
            })
                .catch(error => {
                    // Handle any errors
                    console.error(error);
                });
        } else {
           
            axios.put(`${process.env.REACT_APP_BACKEND_URL}/dataset/comment/reply`, newReply,tokenHeaders).then(response => {
                // Handle the response from the server
                // console.log(response.data);
            })
                .catch(error => {
                    // Handle any errors
                    console.error(error);
                });
        }
    }

//delete
    const handleDeleteComment = async (commentId) => {
        // console.log("CommentId",commentId)
        try {
            // Make a DELETE request to your backend API
            // console.log("Token Headers",tokenHeaders);
            let response;
            if (window.location.pathname === "/model-marketplace/single-model") {
                
                response = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/model/comment/delete`,commentId,tokenHeaders);

            } else {
                // console.log("CMt",commentId)
                response = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/dataset/comment/delete`, {
                    data: { commentId },
                },tokenHeaders);
            }

            // console.log(response.data.message);
            // Handle successful delete, e.g., update the UI
        } catch (error) {
            console.error(error);
            // Handle error
        }
    };
//Edit
    const handleEditComment = async (data) => {
        try {
            let response;

            // console.log("Edit headers");
            // Make a PUT request to your backend API
            if (window.location.pathname === "/model-marketplace/single-model") {
                response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/model/comment/edit`, data,tokenHeaders);
            } else {
                response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/dataset/comment/edit`, data,tokenHeaders);
            }

            // console.log(response.data.message);
            // Handle successful edit, e.g., update the UI
        } catch (error) {
            console.error(error);
            // Handle error
        }
    };
//get 
    useEffect(() => {
        const fetchComments = async () => {
            try {
                let response;
                if (window.location.pathname === "/dataset-marketplace/single-dataset") {
                    response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/dataset/comments`);
                    setComments(response.data);
                   
                } else {
                    response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/model/comments`);
                    // console.log(response.data)
                    setComments(response.data);
                }
            } catch (error) {
                console.error('Error retrieving comments:', error);
            }
        };
        fetchComments();
    }, []);

    // useEffect(() => {
    //     const datasetComment = comments.find(obj => obj._id === DatasetId)?.comments || [];
    //     setSingleData([...datasetComment]);
    // }, [DatasetId, comments]);
    useEffect(() => {
        // console.log(DatasetId)
        const datasetComment = comments.find(obj => obj._id === DatasetId)?.comments ||[];
        // console.log(datasetComment)
        setSingleData(datasetComment);
      }, [DatasetId, comments]);
   
    useEffect(() => {
        const getUserAccountDetails = async () => {
            try {
                const { ethereum } = window;
                if (ethereum) {
                    const provider = new ethers.providers.Web3Provider(ethereum);
                    const signer = provider.getSigner();
                    if (!provider) {
                        console.log("Metamask is not installed, please install!");
                    }
                    const con = await authorizationInstance();
                    const userData = await con.getUser(address);
                    // console.log(userData);
                    setUserName(userData[0]);
                    setImg(userData[4]);
                    setIsLoading(false);
                    setId(parseInt(dataset[11]._hex, 16))
                }
            } catch (error) {
                console.log(error);
                setIsLoading(false);
            }
        };

        getUserAccountDetails();
    }, [address]);
    if (isLoading) {
        return <p>Loading user data...</p>;
    }

    return (
        <>
            <div style={{ background: '#D7E6FD', border: '2px solid white', borderRadius: '50px', marginRight: "50px" }}>
                <CommentSection
                className="react-responsive-modal-modal"

                    currentUser={{
                        currentUserId: id,
                        currentUserImg: `https://gateway.lighthouse.storage/ipfs/${img}`,
                        currentUserFullName: userName,
                    }}

                    commentData={visibleComments}
                    onSubmitAction={async (data) => {
                            const newData = [data, ...singleData]; // Prepend new comment to the existing comments
                            setSingleData(newData); // Update the state with the new comments
                            await sendUserDataToBackend({ data }); // Send the new comment to the backend
                    }}
                    onReplyAction={(data) => { postReply(data) }}
                    currentData={(data) => { console.log("Data", data); }}
                    onDeleteAction={handleDeleteComment}
                    onEditAction={handleEditComment}
                    overlayStyle={{
                        color: 'black'
                    }}
                    replyInputStyle={{ borderBottom: '1px solid black', color: 'black' }}
                    titleStyle={{ marginLeft: '20px', position: 'left', width: 'fit-content' }}
                />

                <button onClick={toggleShowAll} style={{
                    backgroundColor: '#6977FE',
                    border: 'none',
                    color: 'white',
                    padding: '7px 32px',
                    textAlign: 'center',
                    textDecoration: 'none',
                    display: 'inline-block',
                    fontSize: '16px',
                    margin: '4px 2px',
                    cursor: 'pointer',
                    borderRadius: '10px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    animation: 'fadeIn 0.5s ease-in-out',
                    transition: 'background-color 0.3s, box-shadow 0.3s',
                }}
                    onMouseOver={(e) => {
                        e.target.style.backgroundColor = '#6977FF'; 
                        e.target.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)';
                    }}
                    onMouseOut={(e) => {
                        e.target.style.backgroundColor = '#6977FF'; 
                        e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
                    }}
                >
                    {showAll ? 'View Less' : 'View More'}
                </button>

            </div>
        </>
    );
}

export default Comment;
