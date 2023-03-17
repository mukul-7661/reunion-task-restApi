const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");

//create a post

router.post("/", async (req, res) => {
  const newPost = new Post({
    userId: req.user._id,
    title: req.body.title,
    desc: req.body.desc,
    img: req.body.img,
  });
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

//delete a post

router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      res.status(400).json("there is not post with this id");
    } else {
      if (post.userId === req.user._id) {
        await post.deleteOne();
        res.status(200).json("the post has been deleted");
      } else {
        res.status(403).json("you can delete only your post");
      }
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//like a post

router.put("/like/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.user._id)) {
      console.log("hey");
      await post.updateOne({ $push: { likes: req.user._id } });
      res.status(200).json("The post has been liked");
    } else {
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
    if (!post.likes.includes(req.user._id)) {
      res.status(200).json("The post is not liked. So, it cannot be disliked");
    } else {
      await post.updateOne({ $pull: { likes: req.user._id } });
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

    const commentId =
      Math.floor(Math.random() * 1000000000000) + "-" + req.user._id;

    await post.updateOne({
      $push: {
        comment: {
          userId: req.user._id,
          comment: req.body.comment,
          _id: commentId,
        },
      },
    });

    res.status(200).json({ commentId });
  } catch (err) {
    res.status(500).json("Error detected");
  }
});

//get all posts

router.get("/all_posts", async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);
    const userPosts = await Post.find({ userId: currentUser._id });

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
