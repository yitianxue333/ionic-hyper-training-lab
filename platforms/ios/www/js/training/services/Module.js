/**
 * Modules Service
 * @description Modules services provide all services for module management
 * @author Kanchana Yapa
 * @since 22/09/16
 */
angular.module('hyper.training').factory('Module', function($resource, Config, _) {

    /**
     * Creating resource instance
     */
    var resource = $resource(Config.API_TRAINING_URL + '/:op/:id', {}, {
        getModuleList: { method: 'GET', params:{ op: 'user/training/module' } }
    });

    function get(id) {
        return resource.getModuleList({ id : id }).$promise;
    }
    
    function getModuleList(query) {
        query = query || {};
        return resource.getModuleList(query).$promise;
    }

    function devideModules(modules) {
        modules.forEach(function(module) {
            if(module.type === 'intro') {
            $scope.intro.push(module);
            }
            else if(module.type === 'workout') {
            $scope.workout.push(module)
            }
            else {
            $scope.modules.push(module);
            }
        });
    }

    function processModules(modules, taxonomies, trainers, types, notTypes) {
        const list = [], index = {};
        var module;
        var videoCount = 0;
        
        modules.forEach(function(moduleData) {
            module = processSingleModule(moduleData, taxonomies, trainers);
            if(types) {
                if(types.indexOf(module.type) !== -1) {
                    list.push(module);
                    index[module._id] = module;
                    
                    if(module.videoGroups)
                        videoCount += module.videoGroups.videoCount;
                }
            } else if(notTypes) {
                if(notTypes.indexOf(module.type) === -1) {
                    list.push(module);
                    index[module._id] = module;
                    
                    if(module.videoGroups)
                        videoCount += module.videoGroups.videoCount;
                }
            } else {
                list.push(module);
                index[module._id] = module;
                
                if(module.videoGroups)
                    videoCount += module.videoGroups.videoCount; 
            }
        });
        
        return { 
            list: list,
            index: index,
            videoCount: videoCount
        };
    }

    function processSingleModule(moduleData, taxonomyStore, trainersStore) {
        var trainers = {
            idList: moduleData.trainers,
            list: [],
            index: {}
        };
        
        var trainer;
        moduleData.trainers.forEach(function(tId) {
            trainer = trainers.index[tId] = trainersStore.index[tId];
            trainers.list.push(trainer);
            trainers.index[tId] = trainer;
        });
        
        var processed = processModuleTerms(moduleData.terms, taxonomyStore);
        const module = {
            _id: moduleData._id,
            title: moduleData.title,
            type: moduleData.type,
            desc: moduleData.desc,
            status: moduleData.status,
            images: _.defaults(indexAttachments(moduleData.attachments), {
                thumb: {}
            }),
            trainers: trainers,
            taxonomy: processed.taxonomy,
            primaryDivision: processed.primaryDivision,
            licensed: moduleData.licensed,
            price: (moduleData.price) ? parseFloat(moduleData.price) : 0,
            sku: (moduleData.sku)
        };
        
        if(moduleData.videoGroups)
        {
            const videoGroups = processVideoGroups(moduleData.videoGroups);
            module.videoGroups = videoGroups;
        }
        
        return module;
    }

    function processModuleTerms(moduleTerms, taxonomyStore) {
        moduleTerms = _.values(_.pick(taxonomyStore.term_by_id, moduleTerms));
        
        var primaryDivision = '';
        
        const termsIndex = {};
        const taxonomy = taxonomyStore.list.map(function(tax)
        {
            return {
                singular: tax.singular,
                plural: tax.plural,
                terms: termsIndex[tax.singular] = []
            };
        });
        
        moduleTerms.forEach(function(term) {
            // console.warn(t);
            
            if(!primaryDivision && term.parent.singular == 'Division')
            primaryDivision = term.label;
            
            termsIndex[term.parent.singular].push(term.label);
        });
        
        return {
            taxonomy: taxonomy,
            primaryDivision: primaryDivision
        }
    }

    function processVideoGroups(data) {
        const list = [];
        var videoCount = 0;
        const index = data.reduce(function(struct, group) {
            const videos = processVideos(group.videos);
            
            const el = {
                _id: group._id,
                title: group.title,
                difficulty: group.difficulty,
                free: group.free,
                videos: videos,
                status: group.status
            };
            
            videoCount += videos.length;
            
            struct[group._id] = el;
            list.push(el);
            
            return struct;
        }, {});
        
        return {
            list: list,
            index: index,
            videoCount: videoCount
        };
    }

    function processVideos(data) {
        return data.map(function(video) {
            return {
                _id: video._id,
                title: video.title,
                locked: video.locked,
                url: video.url
            };
        });
    }

    function processAttachments(attachments) {
        return attachments.map(function(att) {
            att = _.cloneDeep(att);
            return att;
        });
    }

    function indexAttachments(attachmentData) {
        return indexByProp(processAttachments(attachmentData), 'type');
    }

    function indexByProp(list, prop) {
        return list.reduce(function(struct, i)
        {
            struct[i[prop]] = i;
            return struct;
        }, {});
    }

  return {
    get: get,
    getModuleList: getModuleList,
    processModules: processModules
  };
});
