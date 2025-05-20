/* eslint-disable no-unused-vars */
import  { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useDispatch,  } from "react-redux";
import { setAuthUser } from "@/Redux/AuthSlice";


const Profile = () => {
  const Navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [posts, setposts] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  
  const token = localStorage.getItem("token");

  // const user = useSelector(state => state.auth.user)
  let dispatch = useDispatch()

  const baseUrl = import.meta.env.VITE_BASE_URL

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(baseUrl+"/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setposts(res.data.posts);
        console.log(res);

        setUserData(res.data.userData);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  const closeSettings = () => {
    setShowSettings(false);
  };

  const handleLogout = () => {
    axios.get(baseUrl+"/users/logout",  {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => {
      toast.success(res.data.message)
      localStorage.removeItem("token");
      dispatch(setAuthUser(null))
      Navigate("/login");
    })
    .catch((err) => {
      console.log(err);
      toast.error(err)
    })
  
  };

  return (
    <div className="w-full flex justify-end">
      {/* Profile Section */}
      {userData && (
        <div className="flex-1 flex flex-col items-center p-8 relative">
          {/* Profile Header */}
          <div className="flex items-center gap-12 w-[60%] relative">
            <div className="flex flex-col gap-1.5">
              <img
                src={userData.profilePicture}
                alt="Profile Pic"
                className="h-36 w-36 rounded-full border-4 border-gray-600 object-cover"
              />
              <h2>{userData.fullName}</h2>
            </div>
            <div>
              <div className="flex items-center gap-6">
                <h2 className="text-2xl font-semibold">{userData.username}</h2>
                <button
                  onClick={() => {
                    Navigate("/editprofile");
                  }}
                  className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-1 rounded-md transition duration-300"
                >
                  Edit Profile
                </button>
                <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-1 rounded-md transition duration-300">
                  View Archive
                </button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Settings className="cursor-pointer" />
                  </DialogTrigger>
                  <DialogContent className='flex flex-col gap-1'>
               
                      <Button  variant="ghost" className="cursor-pointer w-full font-bold p-0">
                        Apps and websites
                      </Button>
                      <hr />
                      <Button
                         variant="ghost" className="cursor-pointer w-full font-bold p-0"
                      >
                        Dark theme
                      </Button>
                      <hr />
                      <Button  variant="ghost" className="cursor-pointer w-full font-bold p-0">
                        Notifications
                      </Button>
                      <hr />
                      <Button  variant="ghost" className="cursor-pointer w-full font-bold p-0">
                        Settings and privacy
                      </Button>
                      <hr />
                      <Button  variant="ghost" className="cursor-pointer w-full font-bold p-0">
                        Supervision
                      </Button>
                      <hr />
                      <Button variant="ghost" className="cursor-pointer w-full font-bold p-0">
                        Login activity
                      </Button>
                      <hr />
                      <Button
                       variant="ghost" className="cursor-pointer w-full font-bold p-0"
                        onClick={handleLogout}
                      >
                        Log Out
                      </Button>
                  
                  </DialogContent>
                </Dialog>
              </div>
              <div className="flex gap-8 mt-4 text-lg">
                <span>{posts?.length} posts</span>
                <span>{userData?.followers?.length} followers</span>
                <span>{userData?.following?.length} following</span>
              </div>
              <p className="mt-2 text-gray-400">{userData.bio}</p>
            </div>
          </div>

          {/* Settings Popup */}
          {showSettings && (
            <div className=" p-6 rounded-lg shadow-2xl text-center w-[300px] z-50 absolute right-31 top-22 border border-gray-700 backdrop-blur-xl"></div>
          )}

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
              <span className="border-b-2 border-white pb-2 cursor-pointer">
                Posts
              </span>
              <span className="text-gray-500 cursor-pointer">Saved</span>
              <span className="text-gray-500 cursor-pointer">Tagged</span>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-4">
              {posts?.map((post, index) => (
                <div key={index} className="relative group overflow-hidden">
                  <img
                    src={post.media.url}
                    alt="Post"
                    className="aspect-square object-cover transition duration-300 transform group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-70 opacity-0 group-hover:opacity-80 flex justify-center items-center transition duration-300">
                    <p className="text-white text-center font-medium">
                      {post.caption}
                    </p>
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

export default Profile;
