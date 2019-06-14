# Monkey Language Interpreter - JS
This is a Javascript translation of the interpreter of the book [Writing an Interpreter in Go](https://interpreterbook.com/) by Thorsten Ball.

In order to run the REPL, run:
```
node repl/repl.js
```

Press `Ctrl+C` to exit.


The directory structure, the tests and the code were written to be close to the original code in Go, 
although I took some liberties and implemented some pieces differently.
I barely added comments or documentation as I was mostly following the book and adapting the code to Javascript, the
comments were mostly in parts that differ significantly from the book code or for parts that are not obvious.

The unit tests were implemented using the Jest testing framework and some of the tests can be significantly different
from their original counterparts in the book, but I tried to keep the similarities in functionality and organization,
despite the language and testing library differences.

**This project was only done for learning purposes.**
