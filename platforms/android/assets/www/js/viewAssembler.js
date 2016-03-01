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

    this.events = [];
    var eventList = this.events;
    $('#eventsDiv div').each(function(){
        eventList.push({
            id : $(this).data('id'),
            start : $(this).data('start'),
            end:  $(this).data('end'),
            title:  $(this).data('title'),
            resourceId:  $(this).data('p'),
            description:  $(this).text(),
            color: $(this).data('color')

        });
    });
    this.resources = [];
    var  resourceList = this.resources;
    $('#eventsDiv p').each(function(){
        resourceList.push({
            id : $(this).data('id'),
            title:  $(this).text(),

        });
    });
};

ViewAssembler.prototype.assembleView = function(viewId, options){



    if ((this.populatedViews[viewId] == undefined) || this.populatedViews[viewId].isNew(options)){
        switch (viewId){
            case '#guidePage':
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
        case '#guidePage':
        case '#calendarPage':
        case '#firstPage':
        case '#aboutPage':
        case '#sciCommitteePage':
        case '#depGuidePage':
            $('.mainHeader > h2').hide();
            $('.rightHeaderButton').hide();
            $('#backButton').hide().off('click');
    }
    switch (viewId){
        case '#guidePage':
            $('.mainHeader > h2').text($('#toPersian #EN_mapAndGuideToUniversity').text()).fadeIn();
            var changePageDelegate = this.changePageDelegate;
            $('#backButton').fadeIn().click(function(){
                changePageDelegate.changePage('#firstPage',{});
            });
            $('#guideFooter').fadeIn(300);
            $('#universityMapBtn').off('click').click(function(){
                changePageDelegate.changePage('#guidePage',{});
            });
            $('#departmentMapBtn').off('click').click(function(){
                changePageDelegate.changePage('#depGuidePage',{});
            });
            break;
        case '#depGuidePage':
            $('.mainHeader > h2').text($('#toPersian #EN_mapAndGuideToUniversity').text()).fadeIn();
            var changePageDelegate = this.changePageDelegate;
            $('#backButton').fadeIn().click(function(){
                changePageDelegate.changePage('#firstPage',{});
            });
            $('#guideFooter').fadeIn(300);
            $('#universityMapBtn').off('click').click(function(){
                changePageDelegate.changePage('#guidePage',{});
            });
            $('#departmentMapBtn').off('click').click(function(){
                changePageDelegate.changePage('#depGuidePage',{});
            });
            $('.groundSelect').off('click').click(function(){
                document.getElementById('groundFrame').src = $(this).data('f');
            });
            break;
        case '#calendarPage':
            $('.mainHeader > h2').text($('#toPersian #EN_articlesSchedule').text()).fadeIn();
            var changePageDelegate = this.changePageDelegate;
            $('#backButton').fadeIn().click(function(){
                changePageDelegate.changePage('#firstPage',{});
            });
            break;
        case '#firstPage':
            $('.mainHeader > h2').text($('#toPersian #EN_welcome').text()).fadeIn();
            break;
        case '#sciCommitteePage':
            $('.mainHeader > h2').text($('#sciCommitteeBtn').text()).fadeIn();
            var changePageDelegate = this.changePageDelegate;
            $('#backButton').fadeIn().click(function(){
                changePageDelegate.changePage('#aboutPage',{});
            });
            break;
        case '#aboutPage':
            $('.mainHeader > h2').text($('#toPersian #EN_aboutUs').text()).fadeIn();
            var changePageDelegate = this.changePageDelegate;
            $('#backButton').fadeIn().click(function(){
                changePageDelegate.changePage('#firstPage',{});
            });
            $('#aboutFooter').fadeIn(300);
            $('#sciCommitteeBtn').off('click').click(function(){
                changePageDelegate.changePage('#sciCommitteePage',{});
            });
            $('#execCommitteeBtn').off('click').click(function(){
                changePageDelegate.changePage('#execCommitteePage',{});
            });
            break;
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
            isRTL:true,
            editable: false,
            height:'auto',
            eventLimit: false, // allow "more" link when too many events
            events: this.events,
            defaultView: 'agendaDay',
            resources: this.resources,
            resourceLabelText: $('#EN_place').text(),
            header: {
                left: 'today next,prev',
                center: '',
                right: 'agendaDay,agendaWeek'
            },
            schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source',
            eventClick: function(calEvent, jsEvent, view) {alert('Event: ' + calEvent.description);}
        });
    }

    return;
};

ViewAssembler.prototype.populateGalleriesPage = function(options){
    if ((this.populatedViews['#guidePage'] == undefined) || this.modelController.galleriesListChanged){

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
    $('#calBtn').click(function(){
        changePageDelegate.changePage('#calendarPage',{});
    });

    $('#guideBtn').click(function(){
        changePageDelegate.changePage('#guidePage',{});
    });


    return;
};

ViewAssembler.prototype.populateAboutPage = function(options){

    return;
};

