import User from "../model/user.model.js";
import Post from "../model/posts.model.js";

export const feedController = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const posts = await Post.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "posts",
          as: "author",
        },
      },
      {
        $unwind: {
          path: "$author",
        },
      },
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "post",
          as: "comments",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "comments.user",
          foreignField: "_id",
          as: "commentAuthors",
        },
      },
      {
        $addFields: {
          comments: {
            $map: {
              input: "$comments",
              as: "comment",
              in: {
                _id: "$$comment._id",
                text: "$$comment.text",
                createdAt: "$$comment.createdAt",
                user: {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: "$commentAuthors",
                        as: "author",
                        cond: { $eq: ["$$author._id", "$$comment.user"] },
                      },
                    },
                    0,
                  ],
                },
              },
            },
          },
        },
      },
      {
        $project: {
          commentAuthors: 0, // Remove temporary field
        },
      },
    ]).sort({ createdAt: -1 });
    res.status(200).json({ message: "User feed data found", posts, user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const userProfileController = async (req, res) => {
  try {

    const id = req.params.id
    const posts = await Post.getAuthorPosts(id);
    const user = await User.findById(id).lean();
    const selfData = await User.findById(req.user._id).lean()
    console.log(selfData);
    
    res.status(200).json({ message: "user data found", userData: user, posts  , selfData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
