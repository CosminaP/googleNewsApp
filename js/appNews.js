(function () {
    var app = angular.module('appNews', ['ngSanitize', 'ngRoute', 'ui.bootstrap']);
    app.config(['$routeProvider', function ($routeProvider) {
            $routeProvider
                    .when('/topic/:keyword',
                            {
                                templateUrl: 'news.html',
                                controller: 'NewsController',
                                controllerAs: 'news'
                            })
                    .otherwise({
                        redirectTo: '/topic/w'
                    });
        }]);
    app.controller('NewsController', ['$http', '$routeParams', '$rootScope', function ($http, $routeParams, $rootScope) {
            var news = this;
            news.sections = sections;
            news.stories = [[], []];
            news.keyword = $routeParams.keyword;
            $rootScope.title = sectionTitle[news.keyword];
            news.currentPage = 1;
            news.pages = 8;
            news.refresh = function () {
                var url = 'http://ajax.googleapis.com/ajax/services/search/news?v=1.0&q=%20&rsz=8&topic=' + news.keyword + '&start=' + ((news.currentPage - 1) * 8);
                var proxyUrl = 'php/proxy.php?get=' + encodeURIComponent(url);
                $http.get(proxyUrl).success(function (data) {
                    news.stories = [[], []];
                    angular.forEach(data.responseData.results, function (story, index) {
                        story.publishedDate = new Date(story.publishedDate);
                        var side = (index < 4) ? 0 : 1;
                        news.stories[side].push(story);
                    });
                    console.log(data);
                    console.log("total items", news.totalItems);
                    news.pages = Math.min(data.responseData.cursor.pages.length, news.pages);
                    news.totalItems = news.pages * 8;
                });
            };
            news.refresh();
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
    var sectionTitle = {};
    angular.forEach(sections, function (val) {
        sectionTitle[val.keyword] = val.title;
    });
}());