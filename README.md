#AspectJS
##An Aspect Oriented Javascript library.

AspectJS aims to make it easy to add aspects to specific functions or groups of functions.

Just create a new aspect
```javascript
var log = aspect({
    logger: function (input, output, context) {
        console.log({
            in: input,
            out: output,
            this: context
        });
    };
});
```
and use to build new functions that automatically run the previously defined aspects.
```javascript
var square = log(function (x) {
    return x * x;
});

//prints 3 and 9 to the console
square(3);
```