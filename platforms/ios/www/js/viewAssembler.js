/*Helper Objects:*/
var ViewsOptions = function(viewId, options){
    if (viewId != undefined){
        this[viewId] = options;
    }
};

ViewsOptions.prototype.isNew = function(viewId, options){
    if(JSON.stringify(this[viewId])== JSON.stringify(options)){
        return false;
    } else {
        this[viewId] = options;
        return true;
    }
};

var ViewOption = function(options){
    this.optionsHistory = options;
};

ViewOption.prototype.isNew = function(options){
    if(JSON.stringify(this.optionsHistory)== JSON.stringify(options)){
        return false;
    } else {
        this.optionsHistory = options;
        return true;
    }
};
/**
 * Created by Stratosphere on 12/24/15.
 */

var ViewAssembler = function(delegatesList){
    this.modelController = new ModelController();
    //-------- Delegates List ---------
    this.changePageDelegate = delegatesList.changePageDelegate;
    this.backDelegate = delegatesList.backDelegate;

    //-------- Flags ----------
    this.footerNotLinked = true;

    this.populatedViews = {};

    this.calendarNotBindedToModelController = true;

};

ViewAssembler.prototype.assembleView = function(viewId, options){



    if ((this.populatedViews[viewId] == undefined) || this.populatedViews[viewId].isNew(options)){
        switch (viewId){
            case '#galleriesPage':
                this.populateGalleriesPage(options);
                break;
            case '#calendarPage':
                this.populateCalendarPage(options);
                break;
            case '#firstPage':
                this.populateFirstPage(options);
                break;
            case '#aboutPage':
                this.populateAboutPage(options);
                break;
            case '#galleryInfoPage':
                this.populateGalleryInfoPage(options);
                break;
        }
        if(this.populatedViews[viewId] == undefined){
            this.populatedViews[viewId] = new ViewOption(options);
        }
    }

    return;
};


ViewAssembler.prototype.assembleMainHeader = function(viewId, options){
    switch (viewId){
        case '#galleriesPage':
        case '#calendarPage':
        case '#firstPage':
        case '#aboutPage':
            $('.mainHeader > h2').hide();
            $('.rightHeaderButton').hide();
            $('#backButton').hide();
        case '#galleryInfoPage':
            $('.mainHeader > h2').hide();
            $('.rightHeaderButton').hide();
            $('#backButton').hide();
    }
    switch (viewId){
        case '#galleriesPage':
            $('.mainHeader > h2').text('Galleries').fadeIn();
            break;
        case '#calendarPage':
            $('.mainHeader > h2').text('Calendar').fadeIn();
            break;
        case '#firstPage':
            $('.mainHeader > h2').text($('#toPersian #EN_welcome').text()).fadeIn();
            break;
        case '#aboutPage':
            $('.mainHeader > h2').text($('#toPersian #EN_aboutUs').text()).fadeIn();
            var changePageDelegate = this.changePageDelegate;
            $('#backButton').fadeIn().click(function(){
                changePageDelegate.changePage('#firstPage',{});
            });
            break;
        case '#galleryInfoPage':
            $('.mainHeader > h2').text('Gallery Info').fadeIn();
            var changePageDelegate = this.changePageDelegate;
            $('#backButton').fadeIn().click(function(){
                changePageDelegate.changePage('#galleriesPage',{});
            });
    }
    return;
};

(function ($) {
    $.each(['show', 'hide', 'fadeIn', 'fadeOut'], function (i, ev) {
        var el = $.fn[ev];
        $.fn[ev] = function () {
            this.trigger(ev);
            return el.apply(this, arguments);
        };
    });
})(jQuery);

ViewAssembler.prototype.populateCalendarPage = function(options){

    if(this.calendarNotBindedToModelController){
        $('#calendarPage').on('show', function(){
            setTimeout(function(){
                $('#calendar').fullCalendar('render');
            }, 300);
        });
        $('#calendar').fullCalendar({
            defaultDate: '2015-02-12',
            editable: false,
            height:'auto',
            eventLimit: false, // allow "more" link when too many events
            events: this.modelController.getEventsForFullcal,
            defaultView: 'timelineMonth',
            resources: this.modelController.getResourceForFullcal
        });
    }

    return;
};

ViewAssembler.prototype.populateGalleriesPage = function(options){
    if ((this.populatedViews['#galleriesPage'] == undefined) || this.modelController.galleriesListChanged){
        var gals = this.modelController.getGalleriesList();
        var changePageDelegate = this.changePageDelegate;
        $('#galleriesList').empty();
        var i;
        for(i = 0; i < gals.length; i++){
            $('#galleriesList').append($('<a class="list-group-item" data-gallery-id="' + gals[i].id + '">' +
                    '<img class="galleriesListIcon" src="' + gals[i].icon.url + '" width="' + gals[i].icon.size + '"/>' +
                    gals[i].title +
                    '</a>').click(function(evt) {
                    var options = {galleryId: $(this).data('gallery-id')};
                    changePageDelegate.changePage('#galleryInfoPage', options);
                })
            );


        }
    }

    return;
};

ViewAssembler.prototype.populateGalleryInfoPage = function(options){
    $('#galleryTitle').text('The Gallery No:' + options.galleryId);
    var galleryInfo = this.modelController.getGalleryInfo(options.galleryId);
    $('#galleryMainInfo .fa-globe').text(' : ' + galleryInfo.website);
    $('#galleryMainInfo .fa-at').text(' : ' + galleryInfo.email);
    $('#branchesAccordion').empty();
    var i;
    for(i = 0; i < galleryInfo.branches.length; i++){
        var branchEl = $(
            '<div class="branchInfo panel panel-default" data-toggle="collapse" data-parent="#branchesAccordion" href="#collapse'+ i + '">' +
                '<div class="panel-heading">'+
                    '<h4 class="panel-title">'+
                        '<a>'+
                            galleryInfo.branches[i].title +
                        '</a>'+
                    ' </h4>' +
                ' </div> ' +
                '<div id="collapse'+ i + '" class="panel-collapse collapse">' +
                    ' <div class="panel-body">' +
                        ' <p>Manager: <b>'+ galleryInfo.branches[i].manager +'</b></p>' +
                        ' <ul class="fa-ul"> ' +
                            '<li><i class="fa-li fa  fa-map"></i>'+ galleryInfo.branches[i].contact.address +'</li> ' +
                            '<li><i class="fa-li fa  fa-phone"></i>'+ galleryInfo.branches[i].contact.phonePrimary +'</li>' +
                            ' <li><i class="fa-li fa"></i>'+ galleryInfo.branches[i].contact.phoneAlternate +'</li>' +
                            ' <li><i class="fa-li fa  fa-mobile"></i>'+ galleryInfo.branches[i].contact.phoneMobile +'</li>' +
                            ' <li><i class="fa-li fa fa-fax"></i>'+ galleryInfo.branches[i].contact.fax +'</li>' +
                            ' </ul> ' +
                    '</div> ' +
                '</div> ' +
            '</div>'
        );
        $('#branchesAccordion').append(branchEl);
    }
};

ViewAssembler.prototype.populateFirstPage = function (options){
    var changePageDelegate = this.changePageDelegate;
    $('#aboutBtn').click(function(){
        changePageDelegate.changePage('#aboutPage',{});
    });
    return;
};

ViewAssembler.prototype.populateAboutPage = function(options){
    return;
};

