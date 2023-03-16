const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");

//create a post

router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    const postId = savedPost._id;

    const newPostResponse = await Post.findById(postId).select(
      "-likes -comment -userId -updatedAt -__v"
    );
    res.status(200).json(newPostResponse);
  } catch (err) {
    res.status(500).json(err);
  }
});

//update a post

// router.put("/:id", async (req, res) => {
//   try {
//     const post = await Post.findById(req.params.id);
//     if (post.userId === req.body.userId) {
//       await post.updateOne({ $set: req.body });
//       res.status(200).json("the post has been updated");
//     } else {
//       res.status(403).json("you can update only your post");
//     }
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

//delete a post

router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.deleteOne();
      res.status(200).json("the post has been deleted");
    } else {
      res.status(403).json("you can delete only your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
//like a post

router.put("/like/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      // console.log("hey");
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("The post has been liked");
    } else {
      // await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("The post has been already liked");
    }
  } catch (err) {
    res.status(500).json("Error detected");
  }
});

// dislike a post

router.put("/dislike/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      // console.log("hey");
      // await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("The post is not liked. So, it cannot be disliked");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("The post has been disliked");
    }
  } catch (err) {
    res.status(500).json("Error detected");
  }
});

//comment on a post

router.put("/comment/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    // if (!post.likes.includes(req.body.userId)) {

    const commentId =
      Math.floor(Math.random() * 1000000000000) + "-" + req.body.userId;

    await post.updateOne({
      $push: {
        comment: {
          userId: req.body.userId,
          comment: req.body.comment,
          _id: commentId,
        },
      },
    });

    res.status(200).json({ commentId });
    // } else {
    //   await post.updateOne({ $pull: { likes: req.body.userId } });
    //   res.status(200).json("The post has been disliked");
    // }
  } catch (err) {
    res.status(500).json("Error detected");
  }
});

//get timeline posts

router.get("/all_posts", async (req, res) => {
  try {
    const currentUser = await User.findById(req.body.userId);
    const userPosts = await Post.find({ userId: currentUser._id });
    // const friendPosts = await Promise.all(
    //   currentUser.followings.map((friendId) => {
    //     return Post.find({ userId: friendId });
    //   })
    // );

    res.json(userPosts.concat(...userPosts));
  } catch (err) {
    res.status(500).json(err);
  }
});

//get a post

router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).select(
      "-title -createdAt -userId -updatedAt -__v"
    );

    res
      .status(200)
      .json({ _id: post._id, likes: post.likes.length, comment: post.comment });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
