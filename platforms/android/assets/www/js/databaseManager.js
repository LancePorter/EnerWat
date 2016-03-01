/**
 * Created by Stratosphere on 1/14/16.
 *
 * The best answer to handling user input when inserting into databases is to employ paramaterization. The Web SQL API supports this:

 var db = openDatabase('mydb', '1.0', 'my database', 2 * 1024 * 1024);
 db.transaction(function (tx) {
  tx.executeSql('INSERT INTO foo (id, text) VALUES (?, ?)', [id, userValue]);
});
 Instead of this:

 db.transaction(function (tx) {
  tx.executeSql('INSERT INTO foo (id, text) VALUES (1, "user-entered value")');
});

 */
var DatabaseManager = function(){
    this.db = window.openDatabase('galleriesDb', '1.0', 'Galleries Database', 2000000);
};

DatabaseManager.prototype.getWhat(){

}
DatabaseManager.prototype.initializeTables = function(){
    if (window.localStorage.getItem('tablesCreated') === null){
        var createTablesFn = function(tx){
            tx.executeSql('DROP TABLE IF EXISTS Gallery');
            tx.executeSql("CREATE TABLE IF NOT EXISTS Gallery ( " +
                "id                 INTEGER PRIMARY KEY AUTOINCREMENT, " +
                "EnglishTitle       VARCHAR(50), " +
                "PersianTitle       VARCHAR(50), " +
                "WebsiteUrl         VARCHAR(70), " +
                "EmailAddress       VARCHAR(90), " +
                "LastChanged        VARCHAR(32), " +
                "LogoUrl            VARCHAR(70), " +
                "LogoLocalAddress   VARCHAR(70) " +
                ")");

            tx.executeSql('DROP TABLE IF EXISTS Branch');
            tx.executeSql("CREATE TABLE IF NOT EXISTS Branch ( " +
                "id                 INTEGER PRIMARY KEY AUTOINCREMENT, " +
                "EnglishTitle       VARCHAR(50), " +
                "PersianTitle       VARCHAR(50), " +
                "EnglishAddress     VARCHAR(250), " +
                "PersianAddress     VARCHAR(250), " +
                "EnglishManagerName VARCHAR(50), " +
                "PersianManagerName VARCHAR(50), " +
                "PrimaryPhone       VARCHAR(32), " +
                "SecondaryPhone     VARCHAR(32), " +
                "MobilePhone        VARCHAR(32), " +
                "Fax                VARCHAR(32), " +
                "Halls              INTEGER,"+
                "GalleryId          INTEGER," +
                "workDayHourBegin           VARCHAR(32), " +
                "workDayHourEnd             VARCHAR(32), " +
                "offDay                     VARCHAR(32), " +
                "dayBeforeWeekend           VARCHAR(32), " +
                "dayBeforeWeekendHourBegin  VARCHAR(32), " +
                "dayBeforeWeekendHourEnd    VARCHAR(32), " +
                "openingDay                 VARCHAR(32), " +
                "openingDayHourBegin        VARCHAR(32), " +
                "openingDayHourEnd          VARCHAR(32), " +
                "FOREIGN KEY(GalleryId) REFERENCES Gallery(id)" +
                ")");

            tx.executeSql('DROP TABLE IF EXISTS Artist');
            tx.executeSql("CREATE TABLE IF NOT EXISTS Artist ( " +
                "id                 INTEGER PRIMARY KEY AUTOINCREMENT, " +
                "EnglishName        VARCHAR(50), " +
                "PersianName        VARCHAR(50), " +
                "WebsiteUrl         VARCHAR(70), " +
                "EmailAddress       VARCHAR(90), " +
                "LastChanged        VARCHAR(32) " +
                ")");

            tx.executeSql('DROP TABLE IF EXISTS Event');
            tx.executeSql("CREATE TABLE IF NOT EXISTS Event ( " +
                "id                 INTEGER PRIMARY KEY AUTOINCREMENT, " +
                "EnglishTitle       VARCHAR(50), " +
                "PersianTitle       VARCHAR(50), " +
                "EnglishDescription VARCHAR(500), " +
                "PersianDescription VARCHAR(500), " +
                "WebsiteUrl         VARCHAR(70), " +
                "EmailAddress       VARCHAR(90), " +
                "LastChanged        VARCHAR(32) " +
                "OpeningDate        VARCHAR(32) " +
                "ClosingDate        VARCHAR(32) " +

                "GalleryId          INTEGER," +
                "FOREIGN KEY(GalleryId) REFERENCES Gallery(id)," +
                "BranchId           INTEGER," +
                "FOREIGN KEY(BranchId) REFERENCES Branch(id)," +
                "ArtistId          INTEGER," +
                "FOREIGN KEY(ArtistId) REFERENCES Artist(id)" +
                ")");

            tx.executeSql('DROP TABLE IF EXISTS EventHours');
            tx.executeSql("CREATE TABLE IF NOT EXISTS EventHours ( " +
                "id                 INTEGER PRIMARY KEY AUTOINCREMENT, " +
                "StartTime          VARCHAR(50), " +
                "EndTime            VARCHAR(50), " +
                "EventId            INTEGER," +
                "FOREIGN KEY(EventId) REFERENCES Event(id)" +
                ")");
        };

        var transactionErrFn = function(){
            alert('Error Creating Tables');
        };

        var transactionSuccessFn = function () {
            window.localStorage.setItem('tablesCreated', true);
        };

        this.db.transaction(createTablesFn, transactionErrFn, transactionSuccessFn);
    }
}

DatabaseManager.prototype.initializeSampleDb = function(){
    if (window.localStorage.getItem('dbData') === null){
        if ( !(window.localStorage.getItem('tablesCreated')) ) {
            this.initializeTables();
        }
        var populateDbFn = function(tx){
            // - - - - - Make Artists: - - - - - -
            tx.executeSql('INSERT INTO Artist'+
                '(id,            EnglishName,        PersianName,       WebsiteUrl,           EmailAddress,         LastChanged ) VALUES (?, ?, ?, ?, ?, ?)',
                [ 0 ,          'Ali Sattari',        'علی ستاری',    'www.ali.com',          'ali@ali.com', moment().toString() ]);
            tx.executeSql('INSERT INTO Artist'+
                '(id,            EnglishName,        PersianName,       WebsiteUrl,           EmailAddress,         LastChanged ) VALUES (?, ?, ?, ?, ?, ?)',
                [ 1 ,    'Komeil Bahmanpour',    'کمیل بهمن پور', 'www.komeil.com',    'komeil@komeil.com', moment().toString() ]);
            tx.executeSql('INSERT INTO Artist'+
                '(id,            EnglishName,        PersianName,       WebsiteUrl,           EmailAddress,         LastChanged ) VALUES (?, ?, ?, ?, ?, ?)',
                [ 2 ,         'Reza Rajabli',        'رضا رجبلی',   'www.reza.com',        'reza@reza.com', moment().toString() ]);
            tx.executeSql('INSERT INTO Artist'+
                '(id,            EnglishName,        PersianName,       WebsiteUrl,           EmailAddress,         LastChanged ) VALUES (?, ?, ?, ?, ?, ?)',
                [ 3 , 'Amirhossein Alikhani', 'امیرحسین علیخانی',   'www.amir.com', 'amirhossein@amir.com', moment().toString() ]);
            // - - - - - - - - - - - - - - - - - -

            // - - - - - Make Galleries & Events in them: - - - - - -
            var i;
            var persianNumbers = ['صفر', 'یک', 'دو', 'سه', 'چهار', 'پنج', 'شش', 'هفت', 'هشت', 'نه', 'ده', 'یازده'];
            for(i = 0; i < 12; i++) {
                var EnglishTitle = 'Gallery ' + i;
                var PersianTitle = 'گالری ' + persianNumbers[i];
                var WebsiteUrl = 'https://www.khafangal' + i + 'gallery.com/';
                var EmailAddress = 'info@khafangal' + i + 'gallery.com';
                tx.executeSql('INSERT INTO Gallery '+
                    '(id, EnglishName, PersianName, WebsiteUrl, EmailAddress, LogoLocalAddress, LastChanged ) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [ i , EnglishName, PersianName, WebsiteUrl, EmailAddress, 'img/logo.png', moment().toString()]);
                var branchCount = (((((i % 13) * i) % 7) + i) % 3) + 1;
                var j;
                for (j = 1; j <= branchCount; j++) {
                    EnglishTitle = 'Gal' + i + 'Br' + j;
                    PersianTitle = 'گل' + persianNumbers[i] + 'شعب' + persianNumbers[j];
                    var EnglishAddress = 'No.' + j + ', Gal' + i + 'Br' + j + ' St. NYC. Iran';
                    var PersianAddress = 'ایران - آبادان - شهرک نیویورک سیتی - خیابان گل' + persianNumbers[i] + 'شعب' + persianNumbers[j] + ' - پلاک - ' + persianNumbers[j];
                    var EnglishManagerName = 'Dr.Naghi Gal' + i + 'Br' + j + 'manageian';
                    var PersianManagerName = 'دکتر نقی گل' + persianNumbers[i] + 'شعب' + persianNumbers[j] + 'منیجیان';
                    var PrimaryPhone = '+98 (21) 2232' + ((i % 10) + 10) + ((j % 10) + 20);
                    var SecondaryPhone = '+98 (21) 2232' + ((i % 10) + 30) + ((j % 10) + 40);
                    var MobilePhone = '+98 (912) 518 ' + ((i % 10) + 50) + ((j % 10) + 60);
                    var Fax = '+98 (21) 2232' + ((i % 10) + 70) + ((j % 10) + 80);
                    var workDayHourBegin = (j + 8) + ':' + (i + 10) + ' AM';
                    var workDayHourEnd = (5 - j) + ':' + (i + 20) + ' PM';
                    var dayBeforeWeekendHourBegin = (j + 9) + ':' + (i + 30) + ' AM';
                    var dayBeforeWeekendHourEnd = (4 - j) + ':' + (i + 40) + ' PM';
                    var openingDayHourBegin = j + ':' + (i + 30) + ' PM';
                    var openingDayHourEnd = (10 - j) + ':' + (i + 40) + ' PM';
                    tx.executeSql('INSERT INTO Branch'+
                        '(EnglishTitle, PersianTitle, EnglishAddress, PersianAddress, EnglishManagerName, PersianManagerName, PrimaryPhone, SecondaryPhone, MobilePhone, Fax, Halls, GalleryId, workDayHourBegin, workDayHourEnd,   offDay, dayBeforeWeekend, dayBeforeWeekendHourBegin, dayBeforeWeekendHourEnd, openingDay, openingDayHourBegin, openingDayHourEnd) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                        [ EnglishTitle, PersianTitle, EnglishAddress, PersianAddress, EnglishManagerName, PersianManagerName, PrimaryPhone, SecondaryPhone, MobilePhone, Fax, (4 - j), i, workDayHourBegin, workDayHourEnd, 'Sunday', 'Saturday', dayBeforeWeekendHourBegin, dayBeforeWeekendHourEnd, 'Friday', openingDayHourBegin, openingDayHourEnd]);
                }
                EnglishTitle = 'Event in Gallery '+i;
                PersianTitle = 'رویداد در گالری شماره ' + persianNumbers[i];
                var EnglishDescription = 'This descriptions is intended to describe event No. ' + i;
                var PersianDescription = 'این توضیح درباره ی رویداد شماره ' + persianNumbers[i] + ' است.';
                WebsiteUrl = 'https://www.event' + i + 'inGal' + i + '.com';
                EmailAddress = 'info@event' + i + 'inGal' + i + '.com';
                var LastChanged = moment();
                var OpeningDate = moment().add(parseInt(Math.random() * 15) - 10,'days');
                var ClosingDate = OpeningDate.add(parseInt(Math.random() * 3) + 4,'days');
                var GalleryId = i;
                var ArtistId = parseInt(Math.random() * 4);
                tx.executeSql('INSERT INTO Event' +
                    '(id, EnglishTitle, PersianTitle, EnglishDescription, PersianDescription, WebsiteUrl, EmailAddress, LastChanged, OpeningDate, ClosingDate, GalleryId, BranchId, ArtistId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                    [  i, EnglishTitle, PersianTitle, EnglishDescription, PersianDescription, WebsiteUrl, EmailAddress, LastChanged, OpeningDate, ClosingDate, GalleryId, BranchId, ArtistId]);
            }
        };

        var transactionErrFn = function(){
            alert('Error Populating DB With Sample Data    ');
        };

        var transactionSuccessFn = function () {
            window.localStorage.setItem('dbData', 'sampleData')
        };
        this.db.transaction(populateDbFn, transactionErrFn, transactionSuccessFn);
    }
};

