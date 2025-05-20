import  { useState, useEffect } from "react";

import { useParams } from "react-router-dom";

import axios from "axios";

const UserProfile = () => {


  const {userId} = useParams()
     
  
  const [userData, setUserData] = useState(null);
  const [posts, setposts] = useState([]);
  const [selfData, setSelfData] = useState(null)
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(`http://localhost:3000/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setposts(res.data.posts);
        setSelfData(res.data.selfData);
        setUserData(res.data.userData);
        
    })
    .catch((err) => {
        console.log(err);
    });
}, []);


  const followUnfollowHandler = (updateUserId)=>{
    axios.patch(`http://localhost:3000/users/follow/${updateUserId}`, {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res)=>{
        setSelfData(res.data.selfData);      
        setUserData(res.data.postData);
      })
      .catch((err)=>{
        console.log(err);
      })
  }

  return (
    <div className="w-full min-h-screen">
    
      {/* Profile Section */}
      {userData && (
        <div className="flex-1 flex flex-col items-center p-8">
          {/* Profile Header */}
          <div className="flex items-center gap-12 w-[60%] relative">
            <img
              src={userData.profilePicture}
              alt="Profile Pic"
              className="h-36 w-36 rounded-full border-4 border-gray-600 object-cover"
            />
            <div>
              <div className="flex items-center gap-6">
                <h2 className="text-2xl font-semibold">{userData.username}</h2>
               {userData?.followers?.includes(selfData?._id) ? 
                <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-1 rounded-md transition duration-300"
                onClick={()=>followUnfollowHandler(userData?._id)}
                >
                 following
                </button> :
                 <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-1 rounded-md transition duration-300"
                 onClick={()=>followUnfollowHandler(userData?._id)}
                 >
                   follow
                 </button>
                }
              </div>
              <div className="flex gap-8 mt-4 text-lg">
                <span>{posts?.length} posts</span>
                <span>{userData?.followers?.length} followers</span>
                <span>{userData?.following?.length} following</span>
              </div>
              <p className="mt-2 text-gray-400">{userData.bio}</p>
            </div>
          </div>

          {/* Highlights */}
          <div className="flex gap-6 mt-8 border-t border-gray-700 pt-6">
            {userData?.highlights?.map((highlight, index) => (
              <div key={index} className="flex flex-col items-center">
                <img
                  src={highlight.image}
                  alt="Highlight"
                  className="w-16 h-16 rounded-full border-2 border-gray-500 object-cover"
                />
                <p className="text-sm text-gray-400 mt-1">{highlight.title}</p>
              </div>
            ))}
          </div>

          {/* Posts Section */}
          <div className="border-t border-gray-700 mt-8 w-[60%]">
            <div className="flex justify-center gap-10 py-4">
              <span className="border-b-2 border-white pb-2 cursor-pointer">Posts</span>
              <span className="text-gray-500 cursor-pointer">Reels</span>
              <span className="text-gray-500 cursor-pointer">Tagged</span>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-4">
              {posts?.map((post, index) => (
                <div key={index} className="relative group overflow-hidden items-center flex justify-center">
                  <img
                    src={post.media.url}
                    alt="Post"
                    className="aspect-square object-cover object-center transition duration-300 transform group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-70 opacity-0 group-hover:opacity-80 flex justify-center items-center transition duration-300">
                    <p className="text-white text-center font-medium">{post.caption}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;