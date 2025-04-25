
import { setPosts } from "@/Redux/PostSlice"
import axios from "axios"
import { useEffect } from "react"
import { useDispatch } from "react-redux"


const userGetAllPost = ()=>{
    const dispatch = useDispatch()
    const token = localStorage.getItem("token")
    useEffect(() => {
        const fetchAllPost = ()=>{
             axios
                  .get("http://localhost:3000/feed", {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  })
                  .then((res) => {
                    console.log(res.data.posts);
                    dispatch(setPosts(res.data.posts));
                    
                  })
                  .catch((err) => {
                    console.log(err);
                  });
        }
        fetchAllPost()
    }, [])
    
}

export default userGetAllPost