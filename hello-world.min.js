angular.module('hello-world', []);
(function() {
	
    function HelloWorld() {
        return {
            greet: greet
        };

        function greet() {
            return 'Hello world!';
        }
    }

    angular.module('hello-world').factory('helloWorld', HelloWorld);
}());