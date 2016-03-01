/* supported objescts: */
var GalleryIcon = function (url, size){
    this.url = url;
    this.size = size;
};


var GallerySummary = function (galleryId, title, icon){
    this.id = galleryId;
    this.title = title;
    this.icon = icon;
};

var ContactInfo = function(address, phonePrimary, phoneAlternate, phoneMobile, fax){
    this.address = address;
    this.phonePrimary = phonePrimary;
    this.phoneAlternate = phoneAlternate;
    this.phoneMobile = phoneMobile;
    this.fax = fax;
};

var ScheduleInfo = function(workDayHourBegin,
                            workDayHourEnd,
                            offDay,
                            dayBeforeWeekend,
                            dayBeforeWeekendHourBegin,
                            dayBeforeWeekendHourEnd,
                            openingDay,
                            openingDayHourBegin,
                            openingDayHourEnd)
{
    this.workDayHourBegin = workDayHourBegin;
    this.workDayHourEnd = workDayHourEnd;
    this.offDay = offDay;
    this.dayBeforeWeekend = dayBeforeWeekend;
    this.dayBeforeWeekendHourBegin = dayBeforeWeekendHourBegin;
    this.dayBeforeWeekendHourEnd  =  dayBeforeWeekendHourEnd;
    this.openingDay = openingDay;
    this.openingDayHourBegin = openingDayHourBegin;
    this.openingDayHourEnd = openingDayHourEnd;

};


var BranchInfo = function(branchId, galleryId, title, halls, manager, contact, schedule){
    this.branchId = branchId;
    this.title = title;
    this.halls = halls;
    this.manager = manager;
    this.contact = contact;
    this.schedule = schedule;
};

var GalleryInfo = function(galleryId, title, icon, website, email, branches){
    this.id = galleryId;
    this.title = title;
    this.icon = icon;
    this.website = website;
    this.email = email;
    this.branches = branches;
};


/**
 * Created by Stratosphere on 12/24/15.
 */
var ModelController = function(){
    this.galleriesList = [];
    this.galleriesListChanged = true;

    this.galleriesInfoDic = {};
    modelControllerSingleton = this;

};

ModelController.prototype.someMethod=function(){
    var data = 'some data';
    return data;
};

ModelController.prototype.getResourceForFullcal = function(cb){
    cb(modelControllerSingleton.getGalleriesList());
};
ModelController.prototype.getEventsForFullcal = function(a, v, c, cb){
    var eventsList = new Array();
    var i;
    for(i = 0; i < modelControllerSingleton.galleriesList.length; i++){
        var now = moment();
        var start = now.add(i*37%30 - 15, 'days');
        var end = moment(start).add(i*13%5 + 4, 'days');
        eventsList.push(
            {
                id: i,
                title: 'Event being held in'+ modelControllerSingleton.galleriesList[i].title,
                start: start,
                end: end,
                resourceId:modelControllerSingleton.galleriesList[i].id
            }
        );
    }
    cb(eventsList);
};


ModelController.prototype.getSomethingStupid = function(){
    return this.someMethod();
};

ModelController.prototype.getGalleriesList = function (options){
    if (this.galleriesListChanged){
        var gals = new Array();
        var i;
        for(i = 0; i < 12; i++){
            var icon = new GalleryIcon('img/logo.png', '50');
            var gal = new GallerySummary(''+i , 'Gallery ' + i, icon);
            gals.push(gal);
        }
        this.galleriesList = gals;
        this.galleriesListChanged = false;
    }

    return this.galleriesList;

};


ModelController.prototype.getGalleryInfo = function(galleryId){
    if (this.galleriesInfoDic[galleryId] == undefined ||
        this.galleriesInfoDic[galleryId].isUpToDate != true){
        var galId = parseInt(galleryId);
        var branchCount = (((((galId%13)* galId)% 7) + galId)%3) + 1;
        var i;
        var branches = new Array();
        for(i = 1; i <= branchCount; i++){
            var contact = new ContactInfo(
                'No.' + i + ', Gal' + galId + 'Br' + i + ' St. NYC. Iran' ,
                '+98 (21) 2232' + ((galId%10)+10) + ((i%10)+20),
                '+98 (21) 2232' + ((galId%10)+30) + ((i%10)+40),
                '+98 (912) 518 ' + ((galId%10)+50) + ((i%10)+60),
                '+98 (21) 2232' + ((galId%10)+70) + ((i%10)+80)
            );

            var schedule = new ScheduleInfo(
                (i + 8) + ':' + (galId + 10) + ' AM',
                (5 - i) + ':' + (galId + 20) + ' PM',
                'Sunday',
                'Saturday',
                (i + 9) + ':' + (galId +30) + ' AM',
                (4 - i) + ':' + (galId +40) + ' PM',
                'Friday',
                i + ':' + (galId +30) + ' PM',
                (10 - i) + ':' + (galId +40) + ' PM'
            );

            var branch = new BranchInfo(
                '' + (galId*4 + i),
                '' + galId,
                'Gal' + galId + 'Br' + i,
                '' + (4-i),
                'Dr.Naghi Gal' + galId + 'Br' + i + 'manageian',
                contact,
                schedule
            );

            branches.push(branch);
        }

        var icon = new GalleryIcon('img/logo.png', '120');
        var info = new GalleryInfo(
            galleryId,
            'KhafanGal' + galId + ' \AE',
            icon,
            'https://www.khafangal' + galId + 'gallery.com/',
            'info@khafangal' + galId + 'gallery.com',
            branches);
        this.galleriesInfoDic[galleryId] = new Object({info: info, isUpToDate: true});
    }

    return this.galleriesInfoDic[galleryId].info;
};