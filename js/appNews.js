(function () {
    var app = angular.module('appNews', ['ngSanitize', 'ngRoute', 'ui.bootstrap']);
    
    app.config(['$routeProvider', function ($routeProvider) {
            $routeProvider
                    .when('/topic/:keyword',//keywordul preluat din browser prin matching patternului(potrivirea sablonului) cu URL-ul;
                            {
                                templateUrl: 'news.html',
                                controller: 'NewsController',
                                controllerAs: 'news'
                            })
                    .otherwise({
                        redirectTo: '/topic/w'//daca stergi # se adauga stringul indicat;
                    });
        }]);
    app.controller('NewsController', ['$http', '$routeParams', '$rootScope', function ($http, $routeParams, $rootScope) {
            var news = this; //face ref la controller
            news.sections = sections;
            news.stories = [[], []];
            news.keyword = $routeParams.keyword;
            $rootScope.title = sectionTitle[news.keyword];
            news.currentPage = 1;//
            news.pages = 8;
            news.refresh = function () {
                //variabila ce contine un url compus din 8 stories de pe pagina curenta;start which provides the first search result
                var url = 'http://ajax.googleapis.com/ajax/services/search/news?v=1.0&q=%20&rsz=8&topic=' + news.keyword + '&start=' + ((news.currentPage - 1) * 8);
                //contine url-ul final ce va fi folosit ca parametru al metodei get atasata serviciului $http;
                var proxyUrl = 'php/proxy.php?get=' + encodeURIComponent(url);
                //
                $http.get(proxyUrl).success(function (data) {
                    news.stories = [[], []];//crearea coloanelor
                    angular.forEach(data.responseData.results, function (story, index) {
                        // transforma valoarea propietatii published date intr-un format acceptabil si pentru a face posibila folosirea filtrarii de tip date.
                        story.publishedDate = new Date(story.publishedDate); 
                        //side reprezinta numarul coloanei;
                        var side = (index < 4) ? 0 : 1;
                        //adauga un story in coloana cu nr side;
                        news.stories[side].push(story);
                    });
                    console.log(data);
                    console.log("total items", news.totalItems);
                    //pentru a afla nr corect de pagini in conditiile in care API-ul ne returneaza acelasi nr de pagini desi in realitate sunt mai putine;
                    news.pages = Math.min(data.responseData.cursor.pages.length, news.pages);
                    //estimare a nr. total de stories; 
                    news.totalItems = news.pages * 8;
                });
            };
            news.refresh();//apelarea functiei;
        }]);
    var sections = [
        {title: 'World', keyword: 'w'},
        {title: 'Science and Technology', keyword: 't'},
        {title: 'Headlines', keyword: 'h'},
        {title: 'Business', keyword: 'b'},
        {title: 'Nation', keyword: 'n'},
        {title: 'Election', keyword: 'el'},
        {title: 'Politics', keyword: 'p'},
        {title: 'Entertainment', keyword: 'e'},
        {title: 'Sports', keyword: 's'},
        {title: 'Health', keyword: 'm'}
    ];
    var sectionTitle = {}; // initializarea unui obiect gol;
    //apelam metoda forEach careia ii pasam ca parametri  variabila sections + o functie cu argumentul val
    angular.forEach(sections, function (val) {
        //ii este atribuita o propietate si valoare ambele preluate din obiectul sections;
        sectionTitle[val.keyword] = val.title; 
    });
}());