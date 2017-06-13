# angular-AgilixSettings
Uses Agilix's DLAP API and Angular to expose settings and data.

## Getting Started
1. Install some sort of command-line interface, ([Cygwin](https://www.cygwin.com) if windows, [git bash](https://git-scm.com/downloads) will do this as well. if you're feeling vain, then there are [other options](https://conemu.github.io)) then clone this repository.
2. [Install node.js](https://nodejs.org/en/)
3. Ensure that your computer is running node properly by typing ``` npm ``` into the command prompt.
4. Run ``` npm install ``` (then wait, it is likely to take a hot minute)
5. Install Angular 2 CLI globally with ``` npm install -g @angular/cli ```
6. Run ``` npm start ```
7. [Fun and profit](http://localhost.byu.edu:4200). <-- this will only work after you've done the above

### Development notes
The local development hostname is .byu.edu so that the CAS authentication step returns more than a username and token.

Todo:
* break components into separate files
* barrel include folder contents
* build batch process and request throttle service
* complete the todo list
