import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  Button, 
  Card, 
  Avatar, 
  Badge,
  TextInput,
  Alert,
  Progress
} from 'flowbite-react';
import { 
  HiHeart,
  HiChat,
  HiShare,
  HiDotsVertical,
  HiReply,
  HiFlag,
  HiEmojiHappy,
  HiPhotograph,
  HiX
} from 'react-icons/hi';

import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';

const CommunityPost = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector(state => state.user);
  const {language} = useSelector(state => state.language) || 'en';

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState({
    content: '',
    contentUrdu: '',
    images: []
  });
  const [showReportModal, setShowReportModal] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);

  useEffect(() => {
    fetchPostDetails();
  }, [postId]);

  const fetchPostDetails = async () => {
    try {
      setLoading(true);
      // Fetch post details
      const postResponse = await fetch(`/api/community/posts/${postId}`, {
        headers: currentUser ? {
          'Authorization': `Bearer ${currentUser.token}`
        } : {}
      });
      
      if (!postResponse.ok) throw new Error('Post not found');
      
      const postData = await postResponse.json();
      setPost(postData);

      // Fetch comments
      const commentsResponse = await fetch(`/api/community/posts/${postId}/comments`, {
        headers: currentUser ? {
          'Authorization': `Bearer ${currentUser.token}`
        } : {}
      });
      
      const commentsData = await commentsResponse.json();
      setComments(commentsData.comments);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!currentUser) {
      navigate('/login', { state: { from: `/community/post/${postId}` } });
      return;
    }

    try {
      await fetch(`/api/community/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentUser.token}`
        }
      });

      setPost(prev => ({
        ...prev,
        likes: prev.likes + 1,
        isLiked: true
      }));
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      navigate('/login', { state: { from: `/community/post/${postId}` } });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('content', newComment.content);
      formData.append('contentUrdu', newComment.contentUrdu);
      if (replyingTo) {
        formData.append('parentId', replyingTo);
      }
      newComment.images.forEach(image => {
        formData.append('images', image);
      });

      const response = await fetch(`/api/community/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentUser.token}`
        },
        body: formData
      });

      if (!response.ok) throw new Error('Failed to post comment');

      const newCommentData = await response.json();
      setComments(prev => [newCommentData, ...prev]);
      setNewComment({ content: '', contentUrdu: '', images: [] });
      setReplyingTo(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleReport = async (reason) => {
    try {
      await fetch(`/api/community/posts/${postId}/report`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentUser.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason })
      });

      setShowReportModal(false);
      // Show success message
    } catch (err) {
      setError(err.message);
    }
  };

  const Comment = ({ comment, depth = 0 }) => {
    const [showReplies, setShowReplies] = useState(false);
    const replies = comments.filter(c => c.parentId === comment.id);
    const maxDepth = 3;

    return (
      <div className={`${depth > 0 ? 'ml-8' : ''} mb-4`}>
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Avatar img={comment.author.avatar} alt={comment.author.name} />
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {comment.author.name}
                </h4>
                <p className="text-sm text-gray-500">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            {currentUser && (
              <Button.Group>
                <Button 
                  color="gray" 
                  size="sm"
                  onClick={() => setReplyingTo(comment.id)}
                >
                  <HiReply className="w-4 h-4" />
                </Button>
                <Button
                  color="gray"
                  size="sm"
                  onClick={() => handleLike(comment.id)}
                >
                  <HiHeart className={`w-4 h-4 ${comment.isLiked ? 'text-red-500' : ''}`} />
                </Button>
              </Button.Group>
            )}
          </div>

          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {language === 'ur' ? comment.contentUrdu : comment.content}
          </p>

          {comment.images?.length > 0 && (
            <div className="grid grid-cols-2 gap-2 mb-4">
              {comment.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Comment image ${index + 1}`}
                  className="rounded-lg object-cover w-full h-32"
                />
              ))}
            </div>
          )}

          {replies.length > 0 && depth < maxDepth && (
            <div>
              <Button
                color="gray"
                size="sm"
                onClick={() => setShowReplies(!showReplies)}
              >
                {showReplies 
                  ? (language === 'ur' ? 'جوابات چھپائیں' : 'Hide Replies')
                  : `${language === 'ur' ? 'جوابات دکھائیں' : 'Show Replies'} (${replies.length})`
                }
              </Button>
              {showReplies && (
                <div className="mt-4">
                  {replies.map(reply => (
                    <Comment 
                      key={reply.id} 
                      comment={reply} 
                      depth={depth + 1}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    );
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert color="failure">
          {error}
        </Alert>
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Main Post */}
          <Card className="mb-8">
            {/* Post Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Avatar img={post.author.avatar} alt={post.author.name} />
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {post.author.name}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge color="purple">
                  {language === 'ur' ? post.categoryUrdu : post.category}
                </Badge>
                {currentUser && (
                  <Button
                    color="gray"
                    size="sm"
                    onClick={() => setShowReportModal(true)}
                  >
                    <HiDotsVertical className="w-5 h-5" />
                  </Button>
                )}
              </div>
            </div>

            {/* Post Content */}
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">
              {language === 'ur' ? post.contentUrdu : post.content}
            </p>

            {/* Post Images */}
            {post.images?.length > 0 && (
              <div className="grid grid-cols-2 gap-4 mb-6">
                {post.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Post image ${index + 1}`}
                    className="rounded-lg object-cover w-full h-64"
                  />
                ))}
              </div>
            )}

            {/* Post Actions */}
            <div className="flex items-center justify-between border-t dark:border-gray-700 pt-4">
              <Button.Group>
                <Button
                  color="gray"
                  onClick={handleLike}
                >
                  <HiHeart className={`w-5 h-5 mr-2 ${post.isLiked ? 'text-red-500' : ''}`} />
                  {post.likes}
                </Button>
                <Button
                  color="gray"
                  onClick={() => {
                    document.getElementById('comment-input').focus();
                  }}
                >
                  <HiChat className="w-5 h-5 mr-2" />
                  {comments.length}
                </Button>
                <Button
                  color="gray"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                  }}
                >
                  <HiShare className="w-5 h-5" />
                </Button>
              </Button.Group>
            </div>
          </Card>

          {/* Comment Form */}
          {currentUser && (
            <Card className="mb-8">
              <form onSubmit={handleComment}>
                {replyingTo && (
                  <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-2 rounded-lg mb-4">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {language === 'ur' ? 'جواب دے رہے ہیں:' : 'Replying to:'} {
                        comments.find(c => c.id === replyingTo)?.author.name
                      }
                    </span>
                    <Button
                      color="gray"
                      size="xs"
                      onClick={() => setReplyingTo(null)}
                    >
                      <HiX className="w-4 h-4" />
                    </Button>
                  </div>
                )}
                <div className="mb-4">
                  <TextInput
                    id="comment-input"
                    type="text"
                    placeholder={
                      language === 'ur' 
                        ? 'اپنا تبصرہ یہاں لکھیں...'
                        : 'Write your comment here...'
                    }
                    value={language === 'ur' ? newComment.contentUrdu : newComment.content}
                    onChange={(e) => setNewComment(prev => ({
                      ...prev,
                      [language === 'ur' ? 'contentUrdu' : 'content']: e.target.value
                    }))}
                    required
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    color="gray"
                    size="sm"
                    onClick={() => document.getElementById('comment-images').click()}
                  >
                    <HiPhotograph className="w-5 h-5" />
                  </Button>
                  <input
                    id="comment-images"
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setNewComment(prev => ({
                      ...prev,
                      images: [...prev.images, ...e.target.files]
                    }))}
                  />
                  <Button
                    type="submit"
                    gradientDuoTone="purpleToBlue"
                  >
                    {language === 'ur' ? 'تبصرہ شائع کریں' : 'Post Comment'}
                  </Button>
                </div>

                {newComment.images.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mt-4">
                    {Array.from(newComment.images).map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Preview ${index + 1}`}
                          className="rounded-lg object-cover w-full h-20"
                        />
                        <button
                          type="button"
                          onClick={() => setNewComment(prev => ({
                            ...prev,
                            images: prev.images.filter((_, i) => i !== index)
                          }))}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full"
                        >
                          <HiX className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </form>
            </Card>
          )}

          {/* Comments Section */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              {language === 'ur' 
                ? `تبصرے (${comments.length})` 
                : `Comments (${comments.length})`}
            </h2>

            {comments.length === 0 ? (
              <div className="text-center py-12">
                <HiChat className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {language === 'ur' ? 'کوئی تبصرہ نہیں' : 'No Comments Yet'}
                </h3>
                <p className="text-gray-500">
                  {language === 'ur' 
                    ? 'پہلا تبصرہ کرنے والے بنیں'
                    : 'Be the first to comment'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {comments
                  .filter(comment => !comment.parentId)
                  .map(comment => (
                    <Comment key={comment.id} comment={comment} />
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Report Modal */}
      <Modal
        show={showReportModal}
        onClose={() => setShowReportModal(false)}
        title={language === 'ur' ? 'پوسٹ کی رپورٹ کریں' : 'Report Post'}
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            {language === 'ur' 
              ? 'اس پوسٹ کو رپورٹ کرنے کی وجہ منتخب کریں'
              : 'Select the reason for reporting this post'}
          </p>
          
          {[
            {
              id: 'inappropriate',
              label: 'Inappropriate Content',
              labelUrdu: 'نامناسب مواد'
            },
            {
              id: 'spam',
              label: 'Spam or Misleading',
              labelUrdu: 'سپیم یا گمراہ کن'
            },
            {
              id: 'harassment',
              label: 'Harassment or Bullying',
              labelUrdu: 'ہراسانی یا غنڈہ گردی'
            },
            {
              id: 'other',
              label: 'Other',
              labelUrdu: 'دیگر'
            }
          ].map(reason => (
            <Button
              key={reason.id}
              color="gray"
              className="w-full text-left"
              onClick={() => handleReport(reason.id)}
            >
              {language === 'ur' ? reason.labelUrdu : reason.label}
            </Button>
          ))}

          <div className="flex justify-end mt-4">
            <Button
              color="gray"
              onClick={() => setShowReportModal(false)}
            >
              {language === 'ur' ? 'منسوخ کریں' : 'Cancel'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Share Menu */}
      <Modal
        show={showShareMenu}
        onClose={() => setShowShareMenu(false)}
        title={language === 'ur' ? 'پوسٹ شیئر کریں' : 'Share Post'}
      >
        <div className="space-y-4">
          <Button
            color="gray"
            className="w-full"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              setShowShareMenu(false);
            }}
          >
            {language === 'ur' ? 'لنک کاپی کریں' : 'Copy Link'}
          </Button>
          
          {/* Social share buttons */}
          <div className="grid grid-cols-2 gap-4">
            <Button
              color="blue"
              onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`)}
            >
              Facebook
            </Button>
            <Button
              color="cyan"
              onClick={() => window.open(`https://twitter.com/intent/tweet?url=${window.location.href}`)}
            >
              Twitter
            </Button>
            <Button
              color="green"
              onClick={() => window.open(`https://wa.me/?text=${window.location.href}`)}
            >
              WhatsApp
            </Button>
            <Button
              color="pink"
              onClick={() => window.open(`https://t.me/share/url?url=${window.location.href}`)}
            >
              Telegram
            </Button>
          </div>
        </div>
      </Modal>

      {/* Success Notification */}
      {showNotification && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
          {notificationMessage}
        </div>
      )}
    </div>
  );
};

export default CommunityPost;