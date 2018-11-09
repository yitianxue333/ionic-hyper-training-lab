/**
 * Keep Track of the data in training lab
 * @description The Training Controller
 * @author Kanchana Yapa
 * @since 15/09/16
 */
angular.module('hyper.training').controller('TrainingController', function($scope, $ionicModal, User, MediaList, Taxonomy, Trainer, TrainingStore, _) {
    $scope.training = {
        tiles : [],
        trainers : [],
        terms : [],
        taxonomies : [],
        filterTrainer: ""
    };

    $ionicModal.fromTemplateUrl('views/training/components/hy-training-trainer-filter.html', {
        scope: $scope,
        animation: 'slide-in-up',
        width: '90%',
        height: '90%'
    }).then(function(modal) {
        $scope.filterTrainerModal = modal;
    });

    $scope.filterTerm = "";

    $scope.init = function() {
        var self = this;
        Promise.all([ 
            Taxonomy.getTaxonomies(),
            Trainer.getTrainers(),
            MediaList.getMediaList("divisions")
        ])
        .then(function(data) {
            var taxonomyData = data[0],
                trainersData = data[1], 
                mediaListData = data[2];

            $scope.training.taxonomies = processTaxonomy(taxonomyData);
            $scope.training.tiles = processMediaList(mediaListData, $scope.training.taxonomies);
            $scope.training.trainers = processTrainers(trainersData);
            TrainingStore.setTaxonomies($scope.training.taxonomies);
            TrainingStore.setTrainers($scope.training.trainers);
            
            $scope.$apply(function() {
                console.log("update");
            });
        })
        .catch(function(error) {
            console.log(error);
        });
    };


    $scope.modalShow = function() {
        $scope.filterTrainerModal.show();
    };

    $scope.modalClose = function() {
        $scope.filterTrainerModal.hide();
        setFilter();
    };

    function setFilter() {
        if($scope.training.filterTrainer){
            $scope.filterTerm = $scope.training.taxonomies.by_name["division"].terms.by_label[$scope.training.filterTrainer]._id;
        } else {
            $scope.filterTerm = "";
        }
    }
    
    function processTaxonomy(taxonomy_list) {
        const by_name = {};
        const term_by_id = {};
        const list = [];
        
        taxonomy_list.forEach(function(tax) {
            tax = _.cloneDeep(tax);
            list.push(tax);
            by_name[tax.name] = tax;
            const term_index = indexByProp(tax.terms, '_id');
            _.values(term_index).forEach(function(term) { 
                term.parent = {
                    _id : tax._id,  
                    name : tax.name,
                    plural : tax.plural,
                    singular : tax.singular
                };
            });
            
            tax.terms = {
                list: tax.terms,
                by_label: indexByProp(tax.terms, 'label')
            };
        
            // Decorate term_by_id with this taxonomy's terms
            _.assign(term_by_id, term_index);
        });
        
        return {
            list: list,
            by_name : by_name,
            term_by_id : term_by_id
	    };
    }

    function processMediaList(media_list, taxonomies) {

        return media_list.reduce(function(struct, list) {
            const el = list.items.map(function(i) {
                return {
                    label: i.label,
                    desc: i.desc || "",
                    attachments: processAttachments(i.attachments),
                    url: i.url ? interpolateUrl(i.url, taxonomies) : "",
                    query: i.url ? createQueryObject(i.url, taxonomies) : {}
                }
            });
            
            struct[list.name] = el;
            
            return struct;
        }, {});
    }

    function createQueryObject(url, taxonomies)
    {
        const regex = /\{([^}]+)}/g;
        const matches = regex.exec(url);
        const m2 = matches[1];
        const splitted = m2.split(':');
        const type = splitted[0];
        const terms = [splitted[1], splitted[2]];
        switch(type)
        {
            case 'taxonomy':
                return { name : terms[0], value: 
                    { term : { _id : taxonomies
                        .by_name[terms[0]]
                            .terms
                                .by_label[terms[1]]
                                    ._id } } }
                    
            default:
                throw new Error("failed to interpolate");
        }
    }

    function interpolateUrl(url, taxonomies)
    {
        return url.replace(/\{([^}]+)}/g, function(m1, m2)
        {
            const splitted = m2.split(':');
            const type = splitted[0];
            const terms = [splitted[1], splitted[2]];

            switch(type)
            {
                case 'taxonomy':
                    return taxonomies
                        .by_name[terms[0]]
                            .terms
                                .by_label[terms[1]]
                                    ._id;
                default:
                    throw new Error("failed to interpolate");
            }
        });
    }

    function processTrainers(trainersData)
    {
        const list = [];
        const index = trainersData.reduce(function(struct, trainer)  {
            const el = {
                _id: trainer._id,
                name: trainer.name,
                desc: trainer.desc,
                shortDesc: trainer.shortDesc,
                tags: trainer.tags,
                terms: trainer.terms,
                images: _.defaults(indexAttachments(trainer.attachments), {
                    portrait: {},
                    profile: {},
                    thumb: {}
                })
            };
            
            struct[trainer._id] = el;
            list.push(el);
            
            return struct;
        }, {});
        
        return {
            list:list,
            index: index
        };
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
});
