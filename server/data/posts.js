const mongoCollections = require('../config/mongoCollections');
const posts = mongoCollections.posts;
const {ObjectId} = require('mongodb');
const helpers = require('../helpers');

const createPost = async (
  title,
  text
) => {
  title = helpers.stringInputHandler(title, 'Title');
  helpers.senseValidation(title, 'Title');
  text = helpers.stringInputHandler(text, 'Post text');
  helpers.senseValidation(text, 'Post text');
  // userThatPosted = helpers.sessionValidation(userThatPosted);
  // userThatPosted._id = new ObjectId(userThatPosted._id);

  const postCollection = await posts();
  const newPost = {
    title: title,
    ingredients: text,
    // userThatPosted: userThatPosted, 
    comments: []
  }

  const insertInfo = await postCollection.insertOne(newPost);
  if (!insertInfo.acknowledged || !insertInfo.insertedId)
    throw 'Error: Could not add post';

  const newId = insertInfo.insertedId.toString();

  const post = await getPostById(newId);
  return post;
}

const getAllPosts = async () => {
  const postCollection = await posts();
  let allPosts = await postCollection.find({}).toArray();
  if(!allPosts) throw {status: '404', error: "No posts found"}
  allPosts = allPosts.map(post => {
    post._id = post._id.toString();
    return post
  });
  return allPosts;
}

const getPostById = async (
  postId
) => {
  postId = helpers.stringInputHandler(postId, 'Post ID');
  if (!ObjectId.isValid(postId)) throw 'Error: Post Object ID is not valid';

  const postCollection = await posts();
  const post = await postCollection.findOne({_id: new ObjectId(postId)});
  if (post === null) throw 'Error: No post with that id.';
  post._id = post._id.toString();
  // post.userThatPosted._id = post.userThatPosted._id.toString();
  for (let comment of post.comments){
    comment._id = comment._id.toString();
    // comment.userThatPostedComment._id = comment.userThatPostedComment._id.toString();
  }
  return post;
}

const updatePost = async (
  postId,
  title,
  text,
  userCalling
) => {
  title = helpers.stringInputHandler(title, 'Title');
  helpers.senseValidation(title, 'Title');
  text = helpers.stringInputHandler(text, 'Post text');
  helpers.senseValidation(text, 'Post text');
  userCalling = helpers.sessionValidation(userCalling);

  const postCollection = await posts();
  postId = helpers.stringInputHandler(postId, 'Post ID');
  if (!ObjectId.isValid(postId)) throw 'Error: Post Object ID is not valid';
  const originalPost = await getPostById(postId);
  if (!helpers.sessionComparator(userCalling, originalPost.userThatPosted)) 
    throw 'Error: User cannot update post posted by a different user.';

  originalPost.userThatPosted._id = new ObjectId(originalPost.userThatPosted._id);
  for (let comment of originalPost.comments){
    comment._id = new ObjectId(comment._id);
    comment.userThatPostedComment._id = new ObjectId(comment.userThatPostedComment._id);
  }
  const updatedPost = {
    title: title,
    text: text,
    userThatPosted: originalPost.userThatPosted, 
    comments: originalPost.comments,
  }

  const updatedInfo = await postCollection.updateOne(
    {_id: new ObjectId(postId)},
    {$set: updatedPost}
  );
  if (updatedInfo.modifiedCount === 0) {
    throw 'Error: Could not update the post successfully';
  }

  return await getPostById(postId);
}

const addCommentToPost = async (
  postId,
  userThatPostedComment,
  comment
) => {
  postId = helpers.stringInputHandler(postId, 'Post ID');
  if (!ObjectId.isValid(postId)) throw 'Error: Post Object ID is not valid';
  comment = helpers.stringInputHandler(comment, 'Comment content');
  helpers.senseValidation(comment, 'Comment content');
  
  userThatPostedComment = helpers.sessionValidation(userThatPostedComment);
  userThatPostedComment._id = new ObjectId(userThatPostedComment._id);

  const postCollection = await posts();
  const post = await getPostById(postId);
  const newComment = {
    _id: new ObjectId(),
    userThatPostedComment: userThatPostedComment,
    comment: comment
  }
  const updatedInfo = await postCollection.updateOne(
    {_id: new ObjectId(postId)},
    {$push: {comments: newComment}}
  );
  if (updatedInfo.modifiedCount === 0) {
    throw 'Error: Could not update the post successfully';
  }

  return await getPostById(postId);
}

const getCommentsByPostId = async (postId) => {
  postId = helpers.stringInputHandler(postId, 'Post ID');
  if (!ObjectId.isValid(postId)) throw 'Error: Post Object ID is not valid';

  const post = await getPostById(postId);
  let comments = post.comments;
  if (!comments) throw {status: '404', error: "No comments found for this post"}
  return comments;
}

const deleteComment = async (
  postId,
  commentId,
  userCalling
) => {
  postId = helpers.stringInputHandler(postId, 'Post ID');
  if (!ObjectId.isValid(postId)) throw 'Error: Post Object ID is not valid';
  commentId = helpers.stringInputHandler(commentId, 'Comment ID');
  if (!ObjectId.isValid(commentId)) throw 'Error: Comment Object ID is not valid';
  userCalling = helpers.sessionValidation(userCalling);

  // Verify that the recipe and comment exist (and that the caller and comment poster match)
  const post = await getPostById(postId);
  let commentFound = false;
  for (let comment of post.comments){
    if (comment._id === commentId){
      if (helpers.sessionComparator(userCalling, comment.userThatPostedComment)){
        commentFound = true;
        break;
      } else {
        throw 'Error: User cannot delete comment posted by a different user.';
      }
    }
  }
  if (!commentFound) throw 'Error: No comment found with the input comment ID.';

  const postCollection = await posts();
  const updatedInfo = await postCollection.updateOne({_id: new ObjectId(postId)}, 
    {$pull: {comments: {_id: new ObjectId(commentId)}}});
  if (updatedInfo.modifiedCount === 0) {
    throw 'Error: Could not delete the comment successfully';
  }
  return await getPostById(postId);
}

module.exports = {
  createPost,
  getAllPosts, 
  getPostById, 
  updatePost,
  addCommentToPost, 
  getCommentsByPostId,
  deleteComment
};
