# ultraslim-js
## An "ultra slim" JavaScript "MV-wtf" library

This is an "ultra slim" library for JavaScript UIs that follows (loosely) the model-view-viewmodel architecture (MV-what-so-ever ..). 
It was started as an evaluation of a minimalistic alternative to frameworks such as Angular.io. At present, it provides: 

- Routing
- Templating
- Model bindings 
- REST clients for model data
- IndexedDB as drop-in for REST clients when used offline (to come)

(... more an code coming soon)


## Unit Testing

The current branch uses the Jasmine browser runner for unit testing, with the jasmine-ajax extension. 
Currently, the default browser for testing is Google Chrome.
 
Test can be started with: 

``` bash
# Eventually, you need to install: 
sudo npm install -g jasmine-browser-runner jasmine-core 

# Run tests:
jasmine-browser-runner runSpecs

# Run tests interactively:
jasmine-browser-runner serve
```