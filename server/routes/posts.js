const express = require("express");
const router = express.Router();
const data = require("../data");
const postData = data.posts;
const { ObjectId } = require("mongodb");
const helpers = require("../helpers");

router
  .route("/")
  .post(async (req, res) => {
    let { title, text } = req.body;
    let userThatPosted = req.session.user;
    try {
      title = helpers.stringInputHandler(title, "Title");
      helpers.senseValidation(title, "Title");
      text = helpers.stringInputHandler(text, "Post text");
      helpers.senseValidation(text, "Post text");
      userThatPosted = helpers.sessionValidation(userThatPosted);
    } catch (e) {
      return res.status(400).json({ error: e });
    }
    try {
      const newPost = await postData.createPost(title, text, userThatPosted);
      return res.json(newPost);
    } catch (e) {
      return res.status(500).json({ error: e });
    }
  })
  .get(async (req, res) => {
    try {
      const allPosts = await postData.getAllPosts();
      res.status(200).json(allPosts);
    } catch (e) {
      if (e.status) {
        return res.status(e.status).json({ error: e.error });
      } else {
        return res.status(400).json({ error: e });
      }
    }
  });

router
  .route("/:id")
  .get(async (req, res) => {
    let postId;
    try {
      postId = helpers.stringInputHandler(req.params.id, "Post ID");
      if (!ObjectId.isValid(postId)) throw "Error: Post Object ID is not valid";
    } catch (e) {
      return res.status(400).json({ error: e });
    }
    try {
      const post = await postData.getPostById(postId);
      return res.json(post);
    } catch (e) {
      if (e === "Error: No post with that id.") {
        return res.status(404).json({ error: e });
      } else {
        return res.status(500).json({ error: e });
      }
    }
  })
  .patch(async (req, res) => {
    let postId;
    let thisUser;
    try {
      postId = helpers.stringInputHandler(req.params.id, "Post ID");
      if (!ObjectId.isValid(postId)) throw "Error: Post Object ID is not valid";
      thisUser = helpers.sessionValidation(req.session.user);
    } catch (e) {
      return res.status(400).json({ error: e });
    }

    let newInfo = req.body;
    // Object key counting from https://www.programiz.com/javascript/examples/key-value-object
    if (Object.keys(newInfo).length === 0) {
      return res
        .status(400)
        .json({
          error: "Error: PATCH must be called with at least one key to update.",
        });
    }
    try {
      // Object key checking from https://stackoverflow.com/questions/455338/how-do-i-check-if-an-object-has-a-key-in-javascript
      if (newInfo.hasOwnProperty("title")) {
        newInfo.title = helpers.stringInputHandler(newInfo.title, "Title");
        helpers.senseValidation(newInfo.title, "Title");
      }
      if (newInfo.hasOwnProperty("text")) {
        newInfo.text = helpers.stringInputHandler(newInfo.text, "Post text");
        helpers.senseValidation(newInfo.text, "Post text");
      }
    } catch (e) {
      return res.status(400).json({ error: e });
    }

    let oldPost = {};
    try {
      oldPost = await postData.getPostById(postId);
    } catch (e) {
      if (e === "Error: No post with that id.") {
        return res.status(404).json({ error: e });
      } else {
        return res.status(500).json({ error: e });
      }
    }
    if (!helpers.sessionComparator(thisUser, oldPost.userThatPosted)) {
      return res
        .status(403)
        .json({ error: "Error: User cannot update post by a different user." });
    }
    const params = {
      title: oldPost.title,
      text: oldPost.text,
    };
    let changes = false;
    for (let param in params) {
      if (newInfo.hasOwnProperty(param)) {
        if (newInfo[param] !== params[param]) {
          params[param] = newInfo[param];
          changes = true;
        }
      }
    }
    if (!changes)
      return res
        .status(400)
        .json({
          error: "Error: Post PATCH route called with no changes to the post.",
        });

    try {
      const updatedPost = await postData.updateRecipe(
        postId,
        params.title,
        params.text,
        thisUser
      );
      return res.json(updatedPost);
    } catch (e) {
      return res.status(500).json({ error: e });
    }
  });

router
  .route("/:id/comments")
  .post(async (req, res) => {
    let postId;
    let thisUser;
    let comment;
    try {
      postId = helpers.stringInputHandler(req.params.id, "Post ID");
      if (!ObjectId.isValid(postId)) throw "Error: Post Object ID is not valid";
      thisUser = helpers.sessionValidation(req.session.user);
      comment = helpers.stringInputHandler(req.body.comment, "Comment content");
      helpers.senseValidation(comment, "Comment content");
    } catch (e) {
      return res.status(400).json({ error: e });
    }
    try {
      const post = await postData.getPostById(postId);
    } catch (e) {
      if (e === "Error: No post with that id.") {
        return res.status(404).json({ error: e });
      } else {
        return res.status(500).json({ error: e });
      }
    }
    try {
      const updatedPost = await postData.addCommentToPost(
        postId,
        thisUser,
        comment
      );
      return res.json(updatedPost);
    } catch (e) {
      return res.status(500).json({ error: e });
    }
  })
  .get(async (req, res) => {
    let postId;
    let comments;
    try {
      postId = helpers.stringInputHandler(req.params.id, "Post ID");
      if (!ObjectId.isValid(postId)) throw "Error: Post Object ID is not valid";
      comments = await postData.getCommentsByPostId(postId);
      res.status(200).json(comments);
    } catch (e) {
      if(error.error){
        return res.status(error.status).json({error: error.error})
      }else {
        return res.status(400).json({ error: error }); 
      }
      
    }
  });

router.route("/:postId/:commentId").delete(async (req, res) => {
  let postId;
  let commentId;
  let thisUser;
  try {
    postId = helpers.stringInputHandler(req.params.postId, "Post ID");
    if (!ObjectId.isValid(postId)) throw "Error: Post Object ID is not valid";
    commentId = helpers.stringInputHandler(req.params.commentId, "Comment ID");
    if (!ObjectId.isValid(commentId))
      throw "Error: Comment Object ID is not valid";
    thisUser = helpers.sessionValidation(req.session.user);
  } catch (e) {
    return res.status(400).json({ error: e });
  }
  let post;
  try {
    post = await postData.getPostById(postId);
  } catch (e) {
    if (e === "Error: No post with that id.") {
      return res.status(404).json({ error: e });
    } else {
      return res.status(500).json({ error: e });
    }
  }
  try {
    let commentFound = false;
    for (let comment of post.comments) {
      if (comment._id === commentId) {
        if (
          helpers.sessionComparator(thisUser, comment.userThatPostedComment)
        ) {
          commentFound = true;
          break;
        } else {
          throw "Error: User cannot delete comment posted by a different user.";
        }
      }
    }
    if (!commentFound)
      throw "Error: No comment found with the input comment ID.";
  } catch (e) {
    if (e === "Error: User cannot delete comment posted by a different user.") {
      return res.status(403).json({ error: e });
    } else if (e === "Error: No comment found with the input comment ID.") {
      return res.status(404).json({ error: e });
    } else {
      return res.status(500).json({ error: e });
    }
  }
  try {
    const updatedPost = await postData.deleteComment(
      postId,
      commentId,
      thisUser
    );
    return res.json(updatedPost);
  } catch (e) {
    return res.status(500).json({ error: e });
  }
});

module.exports = router;
