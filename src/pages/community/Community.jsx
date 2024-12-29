import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Button, 
  Card, 
  Tabs,
  TextInput,
  Avatar,
  Badge,
  Progress,
  Alert
} from 'flowbite-react';
import { 
  HiUserGroup,
  HiHeart,
  HiChat,
  HiShare,
  HiPencil,
  HiOutlineFilter,
  HiPhotograph,
  HiSearch,
  HiCalendar,
  HiTrendingUp
} from 'react-icons/hi';

import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';

const Community = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector(state => state.user);
  const {language} = useSelector(state => state.language) || 'en';

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('feed');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPost, setNewPost] = useState({
    content: '',
    contentUrdu: '',
    images: [],
    category: ''
  });

  // Filter states
  const [filters, setFilters] = useState({
    category: '',
    sort: 'latest'
  });

  const categories = [
    { id: 'success_stories', label: 'Success Stories', labelUrdu: 'کامیابی کی کہانیاں' },
    { id: 'questions', label: 'Questions', labelUrdu: 'سوالات' },
    { id: 'ideas', label: 'Business Ideas', labelUrdu: 'کاروباری خیالات' },
    { id: 'resources', label: 'Resources', labelUrdu: 'وسائل' }
  ];

  useEffect(() => {
    fetchPosts();
  }, [filters]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams(filters);
      const response = await fetch(`/api/community/posts?${queryParams}`, {
        headers: currentUser ? {
          'Authorization': `Bearer ${currentUser.token}`
        } : {}
      });
      
      const data = await response.json();
      setPosts(data.posts);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!currentUser) {
      navigate('/login', { state: { from: '/community' } });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('content', newPost.content);
      formData.append('contentUrdu', newPost.contentUrdu);
      formData.append('category', newPost.category);
      newPost.images.forEach(image => {
        formData.append('images', image);
      });

      const response = await fetch('/api/community/posts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentUser.token}`
        },
        body: formData
      });

      if (!response.ok) throw new Error('Failed to create post');

      setShowCreatePost(false);
      setNewPost({ content: '', contentUrdu: '', images: [], category: '' });
      fetchPosts();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLike = async (postId) => {
    if (!currentUser) {
      navigate('/login', { state: { from: '/community' } });
      return;
    }

    try {
      await fetch(`/api/community/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentUser.token}`
        }
      });

      setPosts(posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            likes: post.likes + 1,
            isLiked: true
          };
        }
        return post;
      }));
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const PostCard = ({ post }) => (
    <Card className="mb-4">
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
        <Badge color="purple">
          {language === 'ur' 
            ? categories.find(c => c.id === post.category)?.labelUrdu 
            : categories.find(c => c.id === post.category)?.label}
        </Badge>
      </div>

      {/* Post Content */}
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        {language === 'ur' ? post.contentUrdu : post.content}
      </p>

      {/* Post Images */}
      {post.images?.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mb-4">
          {post.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Post image ${index + 1}`}
              className="rounded-lg object-cover w-full h-48"
            />
          ))}
        </div>
      )}

      {/* Post Actions */}
      <div className="flex items-center justify-between border-t dark:border-gray-700 pt-4">
        <Button.Group>
          <Button
            color="gray"
            onClick={() => handleLike(post.id)}
          >
            <HiHeart className={`w-5 h-5 mr-2 ${post.isLiked ? 'text-red-500' : ''}`} />
            {post.likes}
          </Button>
          <Button
            color="gray"
            onClick={() => navigate(`/community/post/${post.id}`)}
          >
            <HiChat className="w-5 h-5 mr-2" />
            {post.comments}
          </Button>
          <Button
            color="gray"
            onClick={() => {
              navigator.clipboard.writeText(
                `${window.location.origin}/community/post/${post.id}`
              );
            }}
          >
            <HiShare className="w-5 h-5" />
          </Button>
        </Button.Group>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">
              {language === 'ur' 
                ? 'کمیونٹی میں شامل ہوں'
                : 'Join Our Community'}
            </h1>
            <p className="text-xl text-white/90 mb-8">
              {language === 'ur'
                ? 'دوسرے کاروباری خواتین سے جڑیں، تجربات شیئر کریں اور سیکھیں'
                : 'Connect, share experiences, and learn from other women entrepreneurs'}
            </p>
            <Button
              gradientDuoTone="pinkToOrange"
              size="xl"
              onClick={() => setShowCreatePost(true)}
            >
              <HiPencil className="w-5 h-5 mr-2" />
              {language === 'ur' ? 'پوسٹ شیئر کریں' : 'Share a Post'}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Filters */}
          <Card className="mb-6">
            <div className="flex flex-wrap gap-4 items-center">
              <TextInput
                icon={HiSearch}
                placeholder={
                  language === 'ur' 
                    ? 'پوسٹس تلاش کریں...' 
                    : 'Search posts...'
                }
                className="flex-1"
              />
              <select
                value={filters.category}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                className="rounded-lg border-gray-300 dark:border-gray-600"
              >
                <option value="">
                  {language === 'ur' ? 'تمام زمرے' : 'All Categories'}
                </option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {language === 'ur' ? category.labelUrdu : category.label}
                  </option>
                ))}
              </select>
              <select
                value={filters.sort}
                onChange={(e) => setFilters(prev => ({ ...prev, sort: e.target.value }))}
                className="rounded-lg border-gray-300 dark:border-gray-600"
              >
                <option value="latest">
                  {language === 'ur' ? 'تازہ ترین' : 'Latest'}
                </option>
                <option value="popular">
                  {language === 'ur' ? 'مقبول' : 'Popular'}
                </option>
              </select>
            </div>
          </Card>

          {/* Posts Feed */}
          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <Alert color="failure">
              {error}
            </Alert>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <HiUserGroup className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {language === 'ur' ? 'کوئی پوسٹ نہیں' : 'No Posts Yet'}
              </h3>
              <p className="text-gray-500">
                {language === 'ur' 
                  ? 'پہلی پوسٹ شیئر کرنے والے بنیں'
                  : 'Be the first to share a post'}
              </p>
            </div>
          ) : (
            <div>
              {posts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Post Modal */}
      {showCreatePost && (
        <Modal
          title={language === 'ur' ? 'نئی پوسٹ شیئر کریں' : 'Create New Post'}
          show={showCreatePost}
          onClose={() => setShowCreatePost(false)}
        >
          <div className="space-y-4">
            <div>
              <select
                value={newPost.category}
                onChange={(e) => setNewPost(prev => ({ ...prev, category: e.target.value }))}
                className="w-full rounded-lg border-gray-300 dark:border-gray-600"
                required
              >
                <option value="">
                  {language === 'ur' ? 'زمرہ منتخب کریں' : 'Select Category'}
                </option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {language === 'ur' ? category.labelUrdu : category.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <textarea
                placeholder={
                  language === 'ur'
                    ? 'اپنے خیالات یہاں شیئر کریں...'
                    : 'Share your thoughts here...'
                }
                value={language === 'ur' ? newPost.contentUrdu : newPost.content}
                onChange={(e) => setNewPost(prev => ({
                  ...prev,
                  [language === 'ur' ? 'contentUrdu' : 'content']: e.target.value
                }))}
                rows={4}
                className="w-full rounded-lg border-gray-300 dark:border-gray-600"
                required
              />
            </div>

            <div>
              <Button
                color="gray"
                onClick={() => document.getElementById('post-images').click()}
              >
                <HiPhotograph className="w-5 h-5 mr-2" />
                {language === 'ur' ? 'تصاویر شامل کریں' : 'Add Images'}
              </Button>
              <input
                id="post-images"
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => setNewPost(prev => ({
                  ...prev,
                  images: [...prev.images, ...e.target.files]
                }))}
              />
            </div>

            {newPost.images.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {Array.from(newPost.images).map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Preview ${index + 1}`}
                      className="rounded-lg object-cover w-full h-32"
                    />
                    <button
                      onClick={() => setNewPost(prev => ({
                        ...prev,
                        images: prev.images.filter((_, i) => i !== index)
                      }))}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end gap-2 mt-4">
              <Button
                color="gray"
                onClick={() => setShowCreatePost(false)}
              >
                {language === 'ur' ? 'منسوخ کریں' : 'Cancel'}
              </Button>
              <Button
                gradientDuoTone="purpleToBlue"
                onClick={handleCreatePost}
              >
                {language === 'ur' ? 'پوسٹ شیئر کریں' : 'Share Post'}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Community Guidelines */}
      <section className="bg-white dark:bg-gray-800 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
              {language === 'ur' ? 'کمیونٹی رہنما اصول' : 'Community Guidelines'}
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: HiHeart,
                  title: language === 'ur' ? 'احترام' : 'Be Respectful',
                  description: language === 'ur'
                    ? 'دوسروں کے ساتھ احترام سے پیش آئیں'
                    : 'Treat everyone with respect and kindness'
                },
                {
                  icon: HiChat,
                  title: language === 'ur' ? 'مددگار بنیں' : 'Be Helpful',
                  description: language === 'ur'
                    ? 'اپنے تجربات شیئر کر کے دوسروں کی مدد کریں'
                    : 'Share your experiences to help others grow'
                },
                {
                  icon: HiShield,
                  title: language === 'ur' ? 'محفوظ رہیں' : 'Stay Safe',
                  description: language === 'ur'
                    ? 'ذاتی معلومات کو محفوظ رکھیں'
                    : 'Keep personal information private and secure'
                }
              ].map((guideline, index) => (
                <Card key={index} className="text-center">
                  <guideline.icon className="w-8 h-8 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {guideline.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {guideline.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trending Topics */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
              {language === 'ur' ? 'ٹرینڈنگ موضوعات' : 'Trending Topics'}
            </h2>
            <div className="flex flex-wrap gap-4 justify-center">
              {[
                'Business Growth',
                'Marketing Tips',
                'Success Stories',
                'Local Markets',
                'Digital Skills',
                'Funding Options'
              ].map((topic, index) => (
                <Badge
                  key={index}
                  color="purple"
                  size="lg"
                  className="cursor-pointer"
                  onClick={() => setFilters(prev => ({ ...prev, search: topic }))}
                >
                  # {topic}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Join CTA */}
      {!currentUser && (
        <section className="bg-gradient-to-r from-purple-600 to-blue-600 py-16">
          <div className="container mx-auto px-4 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              {language === 'ur' 
                ? 'آج ہی کمیونٹی میں شامل ہوں'
                : 'Join Our Community Today'}
            </h2>
            <p className="text-xl mb-8">
              {language === 'ur'
                ? 'دوسری کامیاب خواتین کاروباری حضرات سے جڑیں'
                : 'Connect with other successful women entrepreneurs'}
            </p>
            <Button
              size="xl"
              onClick={() => navigate('/signup')}
              className="bg-white text-purple-600 hover:bg-gray-100"
            >
              {language === 'ur' ? 'ابھی شامل ہوں' : 'Join Now'}
            </Button>
          </div>
        </section>
      )}

      {/* Download App CTA */}
      <section className="bg-white dark:bg-gray-800 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {language === 'ur' 
                ? 'ہماری موبائل ایپ ڈاؤن لوڈ کریں'
                : 'Download Our Mobile App'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {language === 'ur'
                ? 'کہیں بھی، کبھی بھی کمیونٹی سے جڑے رہیں'
                : 'Stay connected with the community anywhere, anytime'}
            </p>
            <div className="flex justify-center gap-4">
              <Button
                color="dark"
                size="lg"
                className="flex items-center gap-2"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M17.9 5c-.1.6-.3 1.2-.5 1.7-.9 2-2.4 3.2-4.3 3.2-1.8 0-2.7-.9-4.1-.9-1.4 0-2.4.9-4.1.9-1.8 0-3.2-1.1-4.1-3-.6-1.2-1-2.6-1-4.1C2.7.4 4.1 0 5.5 0c1.4 0 2.4.9 4.1.9 1.8 0 2.7-.9 4.1-.9.9 0 1.8.2 2.6.6-.8 1.1-1.2 2.4-1.2 3.9 0 .7.1 1.3.2 1.9-.6-.1-1.2-.2-1.8-.2-1.8 0-2.7.9-4.1.9s-2.4-.9-4.1-.9c-.6 0-1.2.1-1.8.2.1-.6.2-1.2.2-1.9 0-1.5-.4-2.8-1.2-3.9.8-.4 1.7-.6 2.6-.6 1.4 0 2.4.9 4.1.9 1.8 0 2.7-.9 4.1-.9 1.4 0 2.8.4 3.8 1.2zm-2.7 11.2c0 1.1.9 2 2 2s2-.9 2-2-.9-2-2-2-2 .9-2 2zm-7.9 0c0 1.1.9 2 2 2s2-.9 2-2-.9-2-2-2-2 .9-2 2zM12 16c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4z"/>
                </svg>
                App Store
              </Button>
              <Button
                color="dark"
                size="lg"
                className="flex items-center gap-2"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M3 20.5v-17c0-.8.7-1.5 1.5-1.5h15c.8 0 1.5.7 1.5 1.5v17c0 .8-.7 1.5-1.5 1.5h-15c-.8 0-1.5-.7-1.5-1.5zm16.5-17h-15v17h15v-17z"/>
                  <path fill="currentColor" d="M17.3 11l-6.8-6.8c-.4-.4-1-.4-1.4 0-.4.4-.4 1 0 1.4l5.4 5.4-5.4 5.4c-.4.4-.4 1 0 1.4.2.2.5.3.7.3.3 0 .5-.1.7-.3l6.8-6.8c.4-.4.4-1 0-1.4z"/>
                </svg>
                Google Play
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Community;