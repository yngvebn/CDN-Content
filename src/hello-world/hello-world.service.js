(function() {
	
    class HelloWorld {
        constructor(){

        }
        greet(){
            return "Hello world!";
        }
    }

    angular.module('hello-world').service('helloWorld', HelloWorld);

    let dbl = (x) => {
       return x * 2
    }
}());
