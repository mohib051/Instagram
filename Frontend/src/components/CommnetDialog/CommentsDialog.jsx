import React, { useState } from "react";
import { DialogContent, Dialog } from "../ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Link } from "react-router-dom";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { MoreHorizontal } from "lucide-react";
import { Button } from "../ui/button";

const CommentsDialog = ({ commentOpen, setCommentOpen }) => {
  
    const [text, settext] = useState('')

    const onChangeCommentHandler = (e) => {
        const inputText = e.target.value;
        if(inputText.trim()){
          settext(inputText)
        }else{
          settext('')
        }
    }

    const onSendCommentHandler = () => {
        if(text.trim()){
            console.log(text)
            settext('')
        }
    }
    
  return (
    <Dialog open={commentOpen} onOpenChange={setCommentOpen}>
      <DialogContent className="max-w-5xl p-0 flex flex-col">
        <div className="flex flex-1">
          <div className="w-1/2 ">
            <img
              src="https://images.pexels.com/photos/31074953/pexels-photo-31074953/free-photo-of-young-woman-posing-outdoors-with-arms-raised.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="post"
              className="w-full h-full object-cover rounded-l-lg"
            />
          </div>
          <div className="w-1/2 flex flex-col justify-between">
            <div className="flex items-center justify-between p-4">
              <div className="flex gap-3 items-center">
                <Link>
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link className="font-semibold text-md">username</Link>
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <MoreHorizontal className="cursor-pointer" />
                </DialogTrigger>
                <DialogContent>
                  <Button
                    variant="ghost"
                    className="cursor-pointer w-full text-[#ED4956] font-bold"
                  >
                    Unfollow
                  </Button>
                  <Button variant="ghost" className="cursor-pointer w-full ">
                    Add to favorites
                  </Button>
                </DialogContent>
              </Dialog>
            </div>
            <hr />
            <div className="flex-1 overflow-y-auto max-h-96 p-4">
                comments
            </div>
            <div className="p-2">
                <div className="flex items-center gap-2">
                    <input type="text" 
                    value={text}
                    onChange={onChangeCommentHandler}
                    placeholder="Add a comment..." className="w-full outline-none border border-gray-300 p-1 rounded" />
                    <Button variant='outline' 
                    disabled={!text.trim()}
                    onClick={onSendCommentHandler}
                    className="p-2">Send</Button>
                </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentsDialog;
