import  { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { FaRegHeart, FaRegComment, FaHeart } from "react-icons/fa";
import { RiTelegram2Line } from "react-icons/ri";
import { FaRegBookmark } from "react-icons/fa6";

import { DialogTrigger,Dialog, DialogContent } from "@/components/ui/dialog";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import CommentsDialog from "@/components/CommnetDialog/CommentsDialog";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "@/Redux/PostSlice";

const Feed = () => {
  const Navigate = useNavigate();
  const [user, setUser] = useState({});
  const token = localStorage.getItem("token");
  const [text, setText] = useState('')
  const [commentOpen, setCommentOpen] = useState(false)


  const {posts} =  useSelector((store)=>store.post)
  console.log(posts);
  const dispatch = useDispatch()
  console.log(posts);
  

  useEffect(() => {
    if (!token) {
      Navigate("/");
    }

    axios
      .get("http://localhost:3000/feed", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setPosts(res?.data?.posts);
        setUser(res.data.user);
        console.log(res.data.posts);
        
      })
      .catch((err) => {
        console.log(err);
      });
  }, [Navigate]);


  const commentHandler = (e) => {
    const inputText = e.target.value;
    if(inputText.trim()){
      setText(inputText)
    }else{
      setText('')
    }
  }

  const likesHandler = (postId) => {
    axios
      .patch(
        `http://localhost:3000/post/update/${postId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        dispatch(setPosts(posts.map((post) =>
            post._id === postId ? { ...post, likes: res.data.postData.likes } : post
          )
        ));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const followUnfollowHandler = (updateUserId)=>{
    axios.patch(`http://localhost:3000/users/follow/${updateUserId}`, {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res)=>{
        console.log(res);
        
        dispatch(setPosts(
          posts.map((post) =>
            post.author._id === updateUserId
              ? { ...post, author: { ...post.author, followers: res.data.postData.followers } } // Only updating author fields
              : post
          )
        ))
        console.log(posts);
        
      })
      .catch((err)=>{
        console.log(err);
      })
  }
  const calculateHoursAgo = (createdAt) => {
    if (!createdAt) return "Unknown";
    const postDate = new Date(createdAt);
    if (isNaN(postDate.getTime())) return "Invalid Date";
    const currentDate = new Date();
    const differenceInMs = currentDate - postDate;
    const differenceInHours = Math.floor(differenceInMs / (1000 * 60 * 60));
  
    if (differenceInHours < 1) {
      const differenceInMinutes = Math.floor(differenceInMs / (1000 * 60));
      return differenceInMinutes < 1 ? "Just now" : `${differenceInMinutes} min ago`;
    }
  
    if (differenceInHours >= 24) {
      const differenceInDays = Math.floor(differenceInHours / 24);
      return `${differenceInDays} day${differenceInDays > 1 ? "s" : ""} ago`;
    }
  
    return `${differenceInHours} hour${differenceInHours > 1 ? "s" : ""} ago`;
  };
  

  return (
    // <div className=" flex justify-end relative font-light">
      // <div></div>
      <div className=" overflow-auto flex flex-col justify-center items-center gap-3 pt-8">
        <div className="w-[30rem]">
          {posts?.map((post, index) => (
            <div key={index} className="flex flex-col mb-2 rounded-md p-4">
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between w-full">
                  <div className="flex gap-2 items-center cursor-pointer">
                    <img
                      onClick={() => Navigate(`/user/${post?.author?._id}`)}   
                     src={post?.author?.profilePicture} alt="profilePicture" className="w-9 h-9 rounded-full" />
                    <div className="flex flex-col leading-tight">
                      <h2 className="font-medium">{post?.author?.username}</h2>
                      <p className="text-[0.8em] opacity-70">{calculateHoursAgo(post?.createdAt)}</p>
                    </div>
                    <div className="p-2">
                     
                     {!post.author.followers.includes(user._id) ?
                      <button 
                      onClick={()=>followUnfollowHandler(post?.author?._id)}
                      className="text-blue-500 rounded font-medium cursor-pointer"><span className="text-white">•</span> follow</button> : 
                        <div></div>
                      }
                      
                    </div>
                  </div>
                  <span className="cursor-pointer pr-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <MoreHorizontal className="cursor-pointer"/>
                      </DialogTrigger>
                      <DialogContent>
                        <Button variant='ghost' className='cursor-pointer w-full text-[#ED4956] font-bold'>Unfollow</Button>
                        <Button variant='ghost' className='cursor-pointer w-full '>Add to favorites</Button>
                        <Button variant='ghost' className='cursor-pointer w-full '>Delete</Button>
                      </DialogContent>
                    </Dialog>
                  </span>
                </div>
                <div className="border border-gray-700 mt-2">
                  <img src={post.media.url} alt="post" className="w-full h-[35rem] object-contain" />
                </div>
                <div className="mt-2 flex justify-between">
                  <div className="flex gap-3 text-2xl">
                    <div onClick={() => likesHandler(post._id)} className="cursor-pointer">
                      {post?.likes?.includes(user._id) ? <FaHeart /> : <FaRegHeart />}
                    </div>
                    <FaRegComment
                    onClick={() => setCommentOpen(true)}
                    className="cursor-pointer" />
                    <RiTelegram2Line className="cursor-pointer" />
                  </div>
                  <FaRegBookmark className="text-2xl cursor-pointer" />
                </div>
                <div className="text-sm">
                  <p>{post?.likes?.length} likes</p>
                </div>
                <div className="text-sm">
                  <span className="font-medium mr-1.5">{post?.author?.username}</span>
                  <p className="inline break-words">{post.caption}</p>
                </div>
                <div>
                  <span 
                  onClick={() => setCommentOpen(true)}
                  className="cursor-pointer "
                  >View all 10 comments</span>
                  <CommentsDialog commentOpen={commentOpen} setCommentOpen={setCommentOpen} />
                  <div className="flex gap-2 mt-1">
                    <input type="text"
                    placeholder="Add a comment..."
                    className="w-full bg-transparent border-none outline-none"
                    onChange={commentHandler}
                    value={text}
                    />
                    {
                      text && <span className="cursor-pointer text-[#3BADF8]"> Post </span>
                    }
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    // </div>
  );
};

export default Feed;
