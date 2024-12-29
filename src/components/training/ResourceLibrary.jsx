import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  Button, 
  TextInput, 
  Card, 
  Badge,
  Tabs,
  Progress,
  Spinner
} from 'flowbite-react';
import { 
  HiSearch, 
  HiDownload, 
  HiDocumentText,
  HiFilm,
  HiTemplate,
  HiBookOpen,
  HiWifi,
  HiTranslate,
  HiStar
} from 'react-icons/hi';

const ResourceLibrary = ({ resources, isLoading, onDownload }) => {
  const {language} = useSelector(state => state.language) || 'en';
  const { currentUser } = useSelector(state => state.user);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [filteredResources, setFilteredResources] = useState(resources);

  // Resource type definitions
  const resourceTypes = {
    document: {
      icon: HiDocumentText,
      label: language === 'ur' ? 'دستاویزات' : 'Documents',
      color: 'blue'
    },
    video: {
      icon: HiFilm,
      label: language === 'ur' ? 'ویڈیوز' : 'Videos',
      color: 'red'
    },
    template: {
      icon: HiTemplate,
      label: language === 'ur' ? 'ٹیمپلیٹس' : 'Templates',
      color: 'green'
    },
    guide: {
      icon: HiBookOpen,
      label: language === 'ur' ? 'گائیڈز' : 'Guides',
      color: 'purple'
    }
  };

  useEffect(() => {
    let filtered = [...resources];

    // Apply search filter
    if (search) {
      const searchTerm = search.toLowerCase();
      filtered = filtered.filter(resource => 
        resource.title.toLowerCase().includes(searchTerm) ||
        resource.titleUrdu.includes(searchTerm) ||
        resource.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    // Apply tab filter
    if (activeTab !== 'all') {
      filtered = filtered.filter(resource => resource.type === activeTab);
    }

    setFilteredResources(filtered);
  }, [resources, search, activeTab]);

  const ResourceCard = ({ resource }) => {
    const {
      id,
      type,
      title,
      titleUrdu,
      description,
      descriptionUrdu,
      fileSize,
      downloadCount,
      rating,
      languages,
      offlineAccess,
      thumbnail,
      tags
    } = resource;

    const typeConfig = resourceTypes[type];

    return (
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <div className="flex items-start gap-4">
          {thumbnail ? (
            <img 
              src={thumbnail} 
              alt={language === 'ur' ? titleUrdu : title}
              className="w-24 h-24 rounded-lg object-cover"
            />
          ) : (
            <div className="w-24 h-24 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700">
              <typeConfig.icon className="w-8 h-8 text-gray-500 dark:text-gray-400" />
            </div>
          )}

          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <Badge color={typeConfig.color} size="sm" className="mb-2">
                  {typeConfig.label}
                </Badge>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {language === 'ur' ? titleUrdu : title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                  {language === 'ur' ? descriptionUrdu : description}
                </p>
              </div>
              <Button
                color="gray"
                size="sm"
                onClick={() => onDownload(id)}
              >
                <HiDownload className="w-4 h-4 mr-1" />
                <span className="text-xs">
                  {fileSize && `(${fileSize})`}
                </span>
              </Button>
            </div>

            {/* Resource Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center">
                <HiDownload className="w-4 h-4 mr-1" />
                {downloadCount}
              </div>
              <div className="flex items-center">
                <HiStar className="w-4 h-4 mr-1 text-yellow-400" />
                {rating}
              </div>
              <div className="flex items-center">
                <HiTranslate className="w-4 h-4 mr-1" />
                {languages.join(', ')}
              </div>
              {offlineAccess && (
                <div className="flex items-center">
                  <HiWifi className="w-4 h-4 mr-1" />
                  {language === 'ur' ? 'آف لائن' : 'Offline'}
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag, index) => (
                <Badge
                  key={index}
                  color="gray"
                  size="sm"
                  className="text-xs"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {language === 'ur' ? 'وسائل کی لائبریری' : 'Resource Library'}
        </h2>
        {currentUser?.role === 'mentor' && (
          <Button gradientDuoTone="purpleToBlue">
            {language === 'ur' ? 'وسائل شامل کریں' : 'Add Resources'}
          </Button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-1">
          <TextInput
            type="text"
            icon={HiSearch}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={language === 'ur' ? 'وسائل تلاش کریں...' : 'Search resources...'}
          />
        </div>
      </div>

      {/* Resource Type Tabs */}
      <Tabs
        style="underline"
        onActiveTabChange={index => {
          const types = ['all', 'document', 'video', 'template', 'guide'];
          setActiveTab(types[index]);
        }}
      >
        <Tabs.Item
          title={language === 'ur' ? 'تمام' : 'All'}
          active={activeTab === 'all'}
        />
        {Object.entries(resourceTypes).map(([type, config]) => (
          <Tabs.Item
            key={type}
            title={config.label}
            icon={config.icon}
            active={activeTab === type}
          />
        ))}
      </Tabs>

      {/* Resource List */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner size="xl" />
        </div>
      ) : filteredResources.length ? (
        <div className="space-y-4">
          {filteredResources.map(resource => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {language === 'ur' ? 'کوئی وسائل نہیں ملے' : 'No Resources Found'}
          </h3>
          <p className="text-gray-500">
            {language === 'ur' 
              ? 'اپنی تلاش کو وسیع کریں یا دوسری کیٹیگری کو دیکھیں'
              : 'Try broadening your search or checking other categories'}
          </p>
        </div>
      )}
    </div>
  );
};

export default ResourceLibrary;