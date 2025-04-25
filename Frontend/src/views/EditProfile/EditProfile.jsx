import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import axios from "axios";

const EditProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    fullName: "",
    username: "",
    email: "",
    bio: "",
    link: "",
    profilePicture: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const token = localStorage.getItem("token");

    if (!token) {
      return navigate("/login");
    }

    axios
      .patch("http://localhost:3000/users/editprofile", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        navigate("/profile");
      })
      .catch((err) => {
        console.error("Error updating profile:", err);
      });
  };

  return (
    
      <div className="flex flex-col items-center justify-center py-10">
        <h2 className="text-2xl font-semibold mb-6">Edit Profile</h2>
        <form 
          onSubmit={handleSubmit} 
          className="space-y-4 flex flex-col justify-center items-center border border-gray-300 p-6 rounded-lg shadow-lg w-full max-w-md"
        >
          <div className="flex flex-col items-center w-full">
            <input 
              type="file" 
              accept="image/*" 
              name="profilePicture" 
              placeholder="select your profile Image"
              className="w-full p-2 border rounded"
            />
          </div>
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            className="w-full p-3 border rounded"
          />
          <input
            type="text"
            name="username"
            placeholder="Username"
            className="w-full p-3 border rounded"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-3 border rounded"
          />
          <textarea
            name="bio"
            placeholder="Bio"
            className="w-full p-3 border rounded  resize-none"
          ></textarea>
          <input
            type="text"
            name="link"
            placeholder="Website / Link"
            className="w-full p-3 border rounded"
          />
          <button
            type="submit"
            className="w-full p-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
          >
            Save Changes
          </button>
        </form>
      </div>
  );
};

export default EditProfile;