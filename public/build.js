(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _w = require('../w');

var _w2 = _interopRequireDefault(_w);

var _store = require('../Stores/store');

var _store2 = _interopRequireDefault(_store);

var _frontPage = require('../Components/frontPage');

var _frontPage2 = _interopRequireDefault(_frontPage);

var _mainPage = require('../Components/mainPage');

var _mainPage2 = _interopRequireDefault(_mainPage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Actions triggered by the frontPage component, utility functions
 */

var frontPageActions = {};
//goes to the next item on the list

/**
 *  Trace Signup Input
 */
frontPageActions.nextInputItem = function () {
  var formGuide = _w2.default.findId('formGuide');
  var form = _w2.default.findId('formInput');
  var note = _w2.default.findId('notification');

  // set note if note doesn't exist
  if (!note) {
    _w2.default.insert(_w2.default.findId('formInputWrapperInner'), _w2.default.html('<div class="fail" id="notification"></div>'));
    note = _w2.default.findId('notification');
  }
  switch (_store2.default.frontPage.targetItem) {
    case "username":
      _store2.default.frontPage.targetItem = "password";
      form.placeholder = "Password";
      form.type = "password";
      formGuide.textContent = "New Password:";
      note.className = "fail";
      note.textContent = "Press Enter";
      break;
    case "password":
      _store2.default.frontPage.targetItem = "firstName";
      form.placeholder = "First name";
      form.type = "text";
      formGuide.textContent = "First Name:";
      note.className = "fail";
      note.textContent = "Press Enter";
      break;
    case "firstName":
      _store2.default.frontPage.targetItem = "lastName";
      form.placeholder = "Last name";
      formGuide.textContent = "Last Name:";
      note.className = "fail";
      note.textContent = "Press Enter";
      break;
    default:
      _store2.default.frontPage.targetItem = "lastName";
      form.placeholder = "First name";
      formGuide.textContent = "First Name:";
      frontPageActions.signup();
      break;
  }
};
//goes to the previous item on the list
frontPageActions.previousInputItem = function () {
  var formGuide = _w2.default.findId('formGuide');
  var form = _w2.default.findId('formInput');
  switch (_store2.default.frontPage.targetItem) {
    case "username":
      _store2.default.frontPage.targetItem = "username";
      form.placeholder = "writer@villanova.edu";
      formGuide.textContent = "Villanova Email:";
      break;
    case "password":
      _store2.default.frontPage.targetItem = "username";
      form.type = "text";
      form.placeholder = "writer@villanova.edu";
      formGuide.textContent = "Villanova Email:";
      break;
    case "firstName":
      _store2.default.frontPage.targetItem = "password";
      form.type = "password";
      form.placeholder = "Password";
      formGuide.textContent = "Password:";
      break;
    default:
      _store2.default.frontPage.targetItem = "firstName";
      form.placeholder = "First name";
      formGuide.textContent = "First Name:";
  }
};

/**
 * Trace Login Form Input
 */

//goes to the previous item on the list
frontPageActions.nextInputItemLogin = function () {
  var formGuide = _w2.default.findId('formGuide');
  var form = _w2.default.findId('formInputLogin');
  switch (_store2.default.frontPage.targetItem) {
    case "username":
      _store2.default.frontPage.targetItem = "password";
      form.type = 'password';
      form.placeholder = "Password";
      formGuide.textContent = "Password:";
      break;
    case "password":
      frontPageActions.login();
      break;
  }
};

frontPageActions.previousInputItemLogin = function () {
  var formGuide = _w2.default.findId('formGuide');
  var form = _w2.default.findId('formInputLogin');
  switch (_store2.default.frontPage.targetItem) {
    case "username":
      _store2.default.frontPage.targetItem = "username";
      form.type = "text";
      form.placeholder = "writer@villanova.edu";
      formGuide.textContent = "Villanova Email:";
      break;
    case "password":
      form.type = 'text';
      _store2.default.frontPage.targetItem = "username";
      form.placeholder = "writer@villanova.edu";
      formGuide.textContent = "Villanova Email:";
      break;
  }
};

/**
 * Form Validation -- I could (should) have compiled the regex, but I figure it's not that big a problem
 */

frontPageActions.parseItem = function (input) {
  var response = {};
  switch (_store2.default.frontPage.targetItem) {
    case "username":
      response.success = validateEmail(input);
      response.message = "Invalid email address. It must be a villanova.edu email";
      break;
    case "password":
      response.success = validatePassword(input);
      response.message = "Invalid password. It must contain 7+ characters and include letters and numbers";
      break;
    case "firstName":
      response.success = validateName(input);
      response.message = "Please input your real name";
      break;
    case "lastName":
      response.success = validateName(input);
      response.message = "Please input your real name";
      break;
  }
  return response;
};

frontPageActions.inputError = function (message) {
  //display message in notification
  var found = _w2.default.findId('notification');
  if (found) {
    found.textContent = message;
  } else {
    var inner = _w2.default.findId('formInputWrapperInner');
    _w2.default.insert(inner, _w2.default.html('\n      <div class="success" id="notification">' + message + '</div>\n    '));
  }
};
function validateEmail(email) {
  var regexp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@villanova.edu/;
  return regexp.test(email);
}
function validatePassword(input) {
  var regexp = /(?=.*\d)(?=.*[a-zA-Z]).{7,}/;
  return regexp.test(input);
}
function validateName(name) {
  var regexp = /(?=[a-zA-Z]).{2,}/;
  return regexp.test(name);
}

/**
 * AJAX Stuff Here On
 */
frontPageActions.login = function () {
  _w2.default.post('http://' + location.host + '/users/login').attach({
    username: _store2.default.frontPage.login.username,
    password: _store2.default.frontPage.login.password
  }).header('Access-Control-Allow-Headers', '*').header('Content-Type', "application/json").end(function (err, res) {
    if (err) {
      console.log(err);
      return;
    } else {
      if (res.body.success) {
        //handle successful login, save token -> load main view
        localStorage.WriterKey = res.body.token;
        _frontPage2.default.remove();
        //load main view here.
        _mainPage2.default.initialize();
        return;
      } else {
        var formGuide = _w2.default.findId('formGuide');
        var form = _w2.default.findId('formInputLogin');
        _store2.default.frontPage.targetItem = "username";
        form.type = 'text';
        form.placeholder = "writer@villanova.edu";
        formGuide.textContent = "Villanova Email:";
        //display res.message in notification
        var found = _w2.default.findId('notification');
        if (found) {
          found.textContent = res.body.message;
        } else {
          console.log(res.body.success);
          _w2.default.insert(_w2.default.findId('formInputWrapperInner'), _w2.default.html('<div class="success" id="notification">' + res.body.message + '</div>'));
        }
      }
    }
  });
};

frontPageActions.signup = function () {
  _w2.default.post('http://' + location.host + '/users/make').attach({
    username: _store2.default.frontPage.signup.username,
    password: _store2.default.frontPage.signup.password,
    firstName: _store2.default.frontPage.signup.firstName,
    lastName: _store2.default.frontPage.signup.lastName

  }).header('Access-Control-Allow-Headers', '*').header('Content-Type', "application/json").end(function (err, res) {
    if (err) {
      console.log(err);
      return;
    } else {
      if (res.body.success) {
        var formGuide = _w2.default.findId('formGuide');
        var form = _w2.default.findId('formInput');
        form.placeholder = "writer@villanova.edu";
        _store2.default.frontPage.targetItem = "username";
        formGuide.textContent = "Villanova Email:";
        //handle successful login, save token -> load main view
        //load main view here.
        var found = _w2.default.findId('notification');
        if (found) {
          found.textContent = res.body.message;
        } else {
          _w2.default.insert(_w2.default.findId('formInputWrapperInner'), _w2.default.html('\n            <div class="success" id="notification">' + res.body.message + '</div>\n          '));
        }
        return;
      } else {
        var formGuide = _w2.default.findId('formGuide');
        var form = _w2.default.findId('formInput');
        form.placeholder = "writer@villanova.edu";
        _store2.default.frontPage.targetItem = "username";
        formGuide.textContent = "Villanova Email:";
        //display res.body.message in notification
        var found = _w2.default.findId('notification');
        if (found) {
          found.textContent = res.body.message;
        } else {
          _w2.default.insert(_w2.default.findId('formInputWrapperInner'), _w2.default.html('\n            <div class="success" id="notification">' + res.body.message + '</div>\n          '));
        }
      }
    }
  });
};

exports.default = frontPageActions;

},{"../Components/frontPage":2,"../Components/mainPage":3,"../Stores/store":4,"../w":7}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _w = require('../w');

var _w2 = _interopRequireDefault(_w);

var _views = require('../Views/views');

var _views2 = _interopRequireDefault(_views);

var _store = require('../Stores/store');

var _store2 = _interopRequireDefault(_store);

var _frontPageActions = require('../Actions/frontPageActions');

var _frontPageActions2 = _interopRequireDefault(_frontPageActions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//just to keep track of all the listeners in the field. (make clean-up easier)

var frontPage = function frontPage() {
  //active listeners for loginView
  frontPage.listeners = [];

  //add click event & keep track of about
  _w2.default.addEvent('click', 'about', function (event) {
    _store2.default.frontPage.signup = {};
    _store2.default.frontPage.login = {};
    //on click of 'about, remove input, bring in about view
    var frontPageContent = _w2.default.findId('frontPageContent');
    var oldView = _w2.default.findId('frontPageCenter');
    var aboutView = _w2.default.html(_views2.default.about)[1];
    frontPageContent.replaceChild(aboutView, oldView);
    document.getElementById("hacker").load();
  });
  frontPage.listeners.push('about');

  //add click event & keep track of team
  _w2.default.addEvent('click', 'team', function (event) {
    _store2.default.frontPage.signup = {};
    _store2.default.frontPage.login = {};
    //on click of 'about, remove input, bring in about view'
    var frontPageContent = _w2.default.findId('frontPageContent');
    var oldView = _w2.default.findId('frontPageCenter');
    var teamView = _w2.default.html(_views2.default.team)[1];
    frontPageContent.replaceChild(teamView, oldView);
  });
  frontPage.listeners.push('team');

  //add click event & keep track of login view
  _w2.default.addEvent('click', 'login', function (event) {
    _store2.default.frontPage.signup = {};
    _store2.default.frontPage.targetItem = "username";
    //on click of 'login' remove input, bring in about view
    var frontPageContent = _w2.default.findId('frontPageContent');
    var oldView = _w2.default.findId('frontPageCenter');
    var loginView = _w2.default.html(_views2.default.login)[1];
    frontPageContent.replaceChild(loginView, oldView);
    var login = _w2.default.findId('login');
    login.textContent = "Signup";
    login.id = "signup";
  });
  frontPage.listeners.push('login');

  //on click of signup switch to signup
  _w2.default.addEvent('click', 'signup', function (event) {
    _store2.default.frontPage = {};
    _store2.default.frontPage.login = {};
    _store2.default.frontPage.signup = {};
    _store2.default.frontPage.inputVal = "";
    _store2.default.frontPage.targetItem = "username";
    //on click of 'signup', remove input, bring in about view'
    var frontPageContent = _w2.default.findId('frontPageContent');
    var oldView = _w2.default.findId('frontPageCenter');
    var signupView = _w2.default.html(_views2.default.signup)[1];
    frontPageContent.replaceChild(signupView, oldView);
    var login = _w2.default.findId('signup');
    login.textContent = "Login";
    login.id = "login";
  });

  //for login, no form validation
  _w2.default.addEvent('keyup', 'formInputLogin', function (event) {
    if (event.keyCode == 13) {
      _store2.default.frontPage.login[_store2.default.frontPage.targetItem] = event.target.value;
      _frontPageActions2.default.nextInputItemLogin();
      event.target.value = '';
    } else if (event.keyCode == 8 && !_store2.default.frontPage.inputVal) {
      _frontPageActions2.default.previousInputItemLogin();
    }
    _store2.default.frontPage.inputVal = event.target.value;
  });

  _w2.default.addEvent('keyup', 'formInput', function (event) {
    //check if valid item for target
    var tryForm = _frontPageActions2.default.parseItem(event.target.value.trim());
    //handle keypresses ENTER & BACKSPACE (when empty)
    if (event.keyCode === 13) {
      //fill out form & jump to next part
      if (tryForm.success) {
        _store2.default.frontPage.signup[_store2.default.frontPage.targetItem] = event.target.value;
        _frontPageActions2.default.nextInputItem();
        event.target.value = '';
        (0, _w2.default)(function () {
          var note = _w2.default.findId('notification');
          note.className = "fail";
        });
      } else {
        //show error in white
        _frontPageActions2.default.inputError(tryForm.message);
      }
    }
    //Handle BACKSPACE
    if (!_store2.default.frontPage.inputVal && event.keyCode === 8) {
      //jump to previous
      _frontPageActions2.default.previousInputItem();
    }

    //Handle Successful Form -- let the user know -- (passive)
    var found = _w2.default.findId('notification');
    if (tryForm.success) {
      if (found) {
        found.className = "success";
      } else {
        _w2.default.insert(_w2.default.findId('formInputWrapperInner'), _w2.default.html('<div class="success" id="notification">Press Enter</div>'));
      }
    } else {
      if (found) {
        found.className = "fail";
      } else {
        _w2.default.insert(_w2.default.findId('formInputWrapperInner'), _w2.default.html('<div class="fail" id="notification">Press Enter</div>'));
      }
    }
    _store2.default.frontPage.inputVal = event.target.value;
  });
  frontPage.listeners.push('formInput');
};

/**
 * insert frontPage into the view -- not used, just for conformity
 * frontPage should only be accessible by pageload to logged out users
 */
frontPage.initialize = function () {};

//function to completely remove frontPage & its 'listeners'
frontPage.remove = function () {
  //reset store, remove html, and remove events
  _store2.default.frontPage = {};
  _store2.default.frontPage.login = {};
  _store2.default.frontPage.signup = {};
  _store2.default.frontPage.inputVal = "";
  _store2.default.frontPage.targetItem = "";
  _w2.default.remove(_w2.default.findId('frontPage'));

  frontPage.listeners = frontPage.listeners || [];
  frontPage.listeners.forEach(function (identifier) {
    _w2.default.removeEvent(identifier);
  });
  frontPage.listeners = [];
};

//export frontPage

exports.default = frontPage;

},{"../Actions/frontPageActions":1,"../Stores/store":4,"../Views/views":5,"../w":7}],3:[function(require,module,exports){
'use strict';

var _templateObject = _taggedTemplateLiteral(['\n      $', '\n      '], ['\n      $', '\n      ']);

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _webLine = require('../webLine');

var _webLine2 = _interopRequireDefault(_webLine);

var _w = require('../w');

var _w2 = _interopRequireDefault(_w);

var _store = require('../Stores/store');

var _store2 = _interopRequireDefault(_store);

var _views = require('../Views/views');

var _views2 = _interopRequireDefault(_views);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

//init
var mainPage = function mainPage() {
  window.webLine = _webLine2.default; //expose webLine
  var addLocation = function addLocation(loc) {
    addLocation.loc = addLocation.loc || 0;
    addLocation.locs = addLocation.locs || [];
    if (addLocation.locs.indexOf(loc) == -1) {
      addLocation.locs[addLocation.loc % 3] = loc;
      _w2.default.findId('recent' + (addLocation.loc % 3 + 1)).textContent = loc;
      addLocation.loc++;
    }
  };
  _webLine2.default.inputOut = function (text) {
    _w2.default.mFindId('formInput').placeholder = text;
  };

  window.addLocation = addLocation;
  mainPage.listeners = [];
  _webLine2.default.slash.add('js', function (text) {
    var response = undefined;
    _store2.default.mainPage.jsStash = _store2.default.mainPage.jsStash || [];
    _store2.default.mainPage.jsStash.push(text);
    try {
      response = eval.call(window, text);
    } catch (e) {
      response = e;
    }
    if (!response) {
      var isSpecial = text.match(/^(var|function)\s+(.*)(;|\s*)(\(|=)/);
      if (isSpecial) {
        response = isSpecial[1] + ' ' + isSpecial[2];
      } else {
        response = 'undefined';
      }
    }
    _webLine2.default.out(response);
    _w2.default.mFindId('webLineWrapper').scrollTop = _w2.default.mFindId('webLineWrapper').scrollHeight;
  }, true, false);
  _webLine2.default.slash.add('google', function (text) {
    var label = _w2.default.mFindId('inputLabel');
    if (label) {
      label.textContent = text;
    } else {
      parent = _w2.default.findId('webLineWrapper');
      while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
      }
      var home = _w2.default.html('<h3 id="inputLabel">Google</h3>');
      _w2.default.insert(parent, home);
    }
    location.href = 'https://www.google.com/search?q=' + text.split(' ').join('+');
  }, false, false);
  _webLine2.default.slash.commands.google.init = function () {
    parent = _w2.default.findId('webLineWrapper');
    var home = _w2.default.html('<h3 id="inputLabel">Google</h3>');
    _w2.default.insert(parent, home);
  };
  _webLine2.default.slash.add('facebook', function (text) {
    var label = _w2.default.mFindId('inputLabel');
    if (label) {
      label.textContent = text;
    } else {
      parent = _w2.default.findId('webLineWrapper');
      while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
      }
    }
    location.href = 'https://www.facebook.com/search?q=' + text.split(' ').join('+');
  }, false, false);
  _webLine2.default.slash.commands.facebook.init = function () {
    parent = _w2.default.findId('webLineWrapper');
    var home = _w2.default.html('<h3 id="inputLabel">Facebook</h3>');
    _w2.default.insert(parent, home);
  };
  _webLine2.default.slash.add('youtube', function (text) {
    var label = _w2.default.mFindId('inputLabel');
    if (label) {
      label.textContent = text;
    } else {
      parent = _w2.default.findId('webLineWrapper');
      while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
      }
      var home = _w2.default.html('<h3 id="inputLabel">Youtube</h3>');
      _w2.default.insert(parent, home);
    }
    location.href = 'https://www.youtube.com/results?search_query=' + text.split(' ').join('+');
  }, false, false);
  _webLine2.default.slash.commands.youtube.init = function () {
    parent = _w2.default.findId('webLineWrapper');
    var home = _w2.default.html('<h3 id="inputLabel">Youtube</h3>');
    _w2.default.insert(parent, home);
  };
  _webLine2.default.slash.add('logout', function (text) {
    window.localStorage.WriterKey = "";
    location.href = 'http://' + location.host;
  }, false, true);

  /** Initialize Base Commands */
  _webLine2.default.slash.add('home', function (text) {
    var label = _w2.default.mFindId('inputLabel');
    if (label) {
      label.textContent = text;
    } else {
      parent = _w2.default.findId('webLineWrapper');
      while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
      }
      var home = _w2.default.html('<h3 id="inputLabel">Welcome.</h3>');
      _w2.default.insert(parent, home);
    }
  }, false, false);

  _webLine2.default.slash.commands.home.init = function () {
    parent = _w2.default.findId('webLineWrapper');
    var home = _w2.default.html('<h3 id="inputLabel">Home</h3>');
    _w2.default.insert(parent, home);
  };
  //clear page
  _webLine2.default.slash.add('clear', function () {
    //clear space first
    parent = _w2.default.findId('webLine');
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
    //remove all contents of it
  }, false, true);

  _webLine2.default.slash.add('location', function () {
    return _webLine2.default.out(_webLine2.default.loc);
  }, true, true);

  mainPage.listeners.push('formInput');
  _webLine2.default.register(function (location) {
    addLocation(location);
    //clear space first
    parent = _w2.default.findId('webLineWrapper');
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
    _webLine2.default.mount(_w2.default.findId('webLineWrapper')); // replace note
  });

  /**
   *  Events -- Keyboard & Clicks
   */

  _w2.default.addEvent('keyup', 'formInput', function (event) {
    if (event.keyCode === 13) {
      _webLine2.default.in(event.target.value);
      event.target.value = '';
      var dropdown = _w2.default.findId('dropdown');
      if (dropdown) {
        //remove dropdow
        while (dropdown.firstChild) {
          dropdown.removeChild(dropdown.firstChild);
        }
      }
      dropdown.className = "hidden";
      return; //also close dropdown
    }
    if (event.target.value && event.target.value[0] === '/') {
      //create dropdown
      var dropdown = _w2.default.findId('dropdown');
      if (dropdown) {
        //remove dropdow
        while (dropdown.firstChild) {
          dropdown.removeChild(dropdown.firstChild);
        }
      }
      //render dropdown
      dropdown.className = "";
      var list = Object.keys(_webLine2.default.slash.commands).filter(function (command) {
        return command.indexOf(event.target.value.substr(1)) !== -1;
      });
      //log list for testing
      list = list.slice(0, 4);
      if (!list.length) {
        dropdown.className = "hidden";
      }
      var dropdownHtml = _w2.default.tmp(_templateObject, list.map(function (listItem) {
        return '<div id="' + listItem + '" class="dropdownItem">\n                                  <span class="dropdownText">' + listItem + '</span>\n                               </div>';
      }));
      //gotta take a look at my insert function, seems to be giving me problems
      var range = document.createRange();
      // make the parent of the first div in the document becomes the context node
      range.selectNode(dropdown);
      //why doesn't google's app engine ever update static files?
      var documentFragment = range.createContextualFragment(dropdownHtml);
      dropdown.appendChild(documentFragment.cloneNode(true));
    }
    if (!event.target.value) {
      var dropdown = _w2.default.findId('dropdown');
      dropdown.className = "hidden";
    }
  });

  //let navbar clicks go into webLine.in
  _w2.default.addEvent('click', 'recents', function (event) {
    //puts / before so it will run as a command
    _webLine2.default.in('/' + event.target.textContent);
    var input = _w2.default.mFindId('formInput').value = '';
    var dropdown = _w2.default.mFindId('dropdown');
    dropdown.className = "hidden";
  });

  _w2.default.addEvent('click', 'dropdownItem', function (event) {
    //find id
    var dropdown = _w2.default.mFindId('dropdown');
    dropdown.className = "hidden";
    _webLine2.default.in('/' + event.target.id);
    _w2.default.mFindId('formInput').value = '';
  });
  _w2.default.addEvent('click', 'dropdownText', function (event) {
    //workaround to handle clicks on text
    var dropdown = _w2.default.mFindId('dropdown');
    dropdown.className = "hidden";
    _webLine2.default.in('/' + event.target.parentNode.id);
    _w2.default.mFindId('formInput').value = '';
  });
};
mainPage.remove = function () {
  _w2.default.remove(_w2.default.findId('mainPage'));
  mainPage.listeners.forEach(function (identifier) {
    _w2.default.removeEvent(identifier);
  });
};
mainPage.initialize = function () {
  //check token
  _w2.default.post('http://' + location.host + '/api/user').header('WriterKey', localStorage.getItem('WriterKey')).header('Access-Control-Allow-Headers', '*').header('Content-Type', "application/json").end(function (err, res) {
    if (err) {
      console.log(err);
    } else {
      if (res.body.success) {
        //handle successful login, save token -> load main view
        _store2.default.mainPage.user = res.body.firstName;
        var usr = _w2.default.findId('firstName');
        usr.textContent = _store2.default.mainPage.user;
        //load main view here.
      } else {
          //display res.message in notification
          localStorage.removeItem("WriterKey");
          location = 'http://' + location.host;
        }
    }
  });
  _w2.default.insert(document.body, _w2.default.html(_views2.default.main));
  _webLine2.default.mount(_w2.default.findId('webLineWrapper'));
  mainPage();
};

exports.default = mainPage;

},{"../Stores/store":4,"../Views/views":5,"../w":7,"../webLine":8}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _w = require("../w");

var _w2 = _interopRequireDefault(_w);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var store = {}; /**
                 * Data Storage for App
                 */
//front

store.frontPage = {};
store.frontPage.login = {};
store.frontPage.signup = {};
store.frontPage.inputVal = "";
store.frontPage.targetItem = "username";
//main
store.mainPage = {};
store.mainPage.user = '';
exports.default = store;

},{"../w":7}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _w = require('../w');

var _w2 = _interopRequireDefault(_w);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var views = {}; /**
                 * Vies for App
                 */

views.about = '\n<div id="frontPageCenter" class="content">\n  <h1 class="contentPiece">About</h1>\n  <div class="contentPiece">\n    <video height="200" width="300" id="hacker" preload="auto" loop="true" muted="true" autoplay="true">\n      <source src="hackers.webm" type="video/webm">\n    </video>\n    <p>\n    What we wanted to create with this was a place to go and utilize the capabilites of the web on a\n    constructive platform. We wanted to make a programmable environment on the web to see what cool things\n    we could create thereafter.\n    </p>\n  </div>\n</div>\n';
views.team = '\n<div id="frontPageCenter" class="content">\n  <h1 class="contentPiece">Team</h1>\n  <div class="contentPiece">\n    <img src="https://avatars1.githubusercontent.com/u/8062697?v=3&u=46e6d908dca2dd21b35f5848efad453f6db662c4&s=140">\n    <h3 class="name">Albert Hermida</h3>\n    <img src="https://avatars2.githubusercontent.com/u/15746937?v=3&s=400">\n    <h3 class="name">Steve Butcher</h3>\n  </div>\n</div>\n\n';
//login view
views.login = '\n<div id="frontPageCenter">\n  <div id="formInputWrapper">\n    <h3 id="inputLabel">Log in, it\'s still free.</h3>\n    <div id="formInputWrapperInner">\n      <p id="formGuide">Villanova Email:</p>\n      <input id="formInputLogin" placeholder="writer@villanova.edu">\n    </div>\n  </div>\n</div>\n';

//signup view
views.signup = '\n  <div id="frontPageCenter">\n    <div id="formInputWrapper">\n      <h3 id="inputLabel">Sign up, it\'s free.</h3>\n      <div id="formInputWrapperInner">\n        <p id="formGuide">Villanova Email:</p>\n        <input id="formInput" placeholder="writer@villanova.edu">\n      </div>\n    </div>\n  </div>\n';

//view presented in mainPage
//WHY DOES APPENGINE NOT UPLOAD CHANGES?!
views.main = '<div id="mainPage">\n  <div id="mainPageContent">\n    <div id="navbarMain">\n      <a href="http://' + location.host + '" id="frontPageLogoMain">W</a>\n      <span id="navbarMain-right">\n        <span class="recents" id="recent3"></span>\n        <span class="recents" id="recent2"></span>\n        <span class="recents" id="recent1"></span>\n        <span id="firstName"></span>\n      </span>\n    </div>\n    <div id="mainPageCenter">\n      <div id="formInputWrapper">\n      <div id="webLineWrapper">\n        <h3 id="inputLabel">Welcome.</h3>\n      </div>\n      <div id="formInputWrapperInner">\n        <input id="formInput" class="mainInput" placeholder="/js">\n        <div id="dropdown" class="hidden"></div>\n      </div>\n      </div>\n    </div>\n  </div>\n </div>\n';
exports.default = views;

},{"../w":7}],6:[function(require,module,exports){
'use strict';

var _w = require('./w');

var _w2 = _interopRequireDefault(_w);

var _frontPage = require('./Components/frontPage');

var _frontPage2 = _interopRequireDefault(_frontPage);

var _mainPage = require('./Components/mainPage');

var _mainPage2 = _interopRequireDefault(_mainPage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//initialize app
(function () {

  //will be true if user has token, then it will try to send user to the next page if he has one.
  var authUser = localStorage.getItem('WriterKey');

  if (authUser) {

    //remove all items from current view and replace with mainPage
    _frontPage2.default.remove();
    _mainPage2.default.initialize();
  } else {

    //initialize entry
    (0, _frontPage2.default)();
  }
})();

},{"./Components/frontPage":2,"./Components/mainPage":3,"./w":7}],7:[function(require,module,exports){
/**
 * @fileOverview w.js is a small library that abstracts events, DOM manipulation, and ajax.
 * @author Albert Hermida
 *
 * @version 1.0
 */

'use strict'

/**
 * The 'w' function allows for deferred execution of a callback.
 *
 * @param {function} main Specified function to be executed asynchronously
 */
;
var _arguments = arguments;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var w = function w(main) {
  window.setTimeout(main, 0);
};

/**
 * eventDispatcher is a utility that helps to manage delegated events
 */
var eventDispatcher = {

  /**
   * eventRegistry is a map of all target identifiers to types.
   * Types are mapped to functions.
   */
  eventRegistry: {},

  /**
   * Types helps in keeping track of all eventListeners attached to body.
   * @ignore It helps prevent any arbitrary listeners from being attached.
   */
  types: {
    blur: 0,
    change: 0,
    click: 0,
    copy: 0,
    cut: 0,
    dblclick: 0,
    touchcancel: 0,
    touchend: 0,
    touchmove: 0,
    touchstart: 0,
    drag: 0,
    dragend: 0,
    dragenter: 0,
    dragexit: 0,
    dragleave: 0,
    dragover: 0,
    dragstart: 0,
    drop: 0,
    focus: 0,
    input: 0,
    keydown: 0,
    keypress: 0,
    keyup: 0,
    load: 0,
    mousedown: 0,
    mousemove: 0,
    mouseout: 0,
    mouseover: 0,
    mouseup: 0,
    paste: 0,
    reset: 0,
    scroll: 0,
    submit: 0,
    wheel: 0
  },

  /**
   * Adds event listener if no listener has been bound to body.
   *
   * @param {string} type Name of event to listen for
   */
  addEvent: function addEvent(type) {
    if (eventDispatcher.types[type] === 0) {
      document.body.addEventListener(type, eventDispatcher.callEvent, false);
    }
    eventDispatcher.types[type]++;
  },

  /**
   * Removes event listener if no listener has been bound to body.
   * Removes multiple types if specified by array.
   *
   * @param {array|string} typeList Name of event(s) to remove
   */
  removeEvent: function removeEvent(typeList) {
    if (typeList.constructor === Array) {
      typeList.forEach(function (type) {
        eventDispatcher.types[type]--;
        if (eventDispatcher.types[type] === 0) {
          document.body.removeEventListener(type, eventDispatcher.callEvent, false);
        }
      });
    } else {
      eventDispatcher.types[typeList]--;
      if (eventDispatcher.types[typeList] === 0) {
        document.body.removeEventListener(type, eventDispatcher.callEvent, false);
      }
    }
  },

  /**
   * Registers event to eventRegistry
   *
   * @param {string|object} target Html Element, its id, or its className
   * @param {string} type Name of event to listen for
   * @param {function} fn Function to be fired on event
   */
  registerEvent: function registerEvent(target, type, fn) {
    if (fn instanceof Function) {
      var targ = eventDispatcher.eventRegistry[target] = eventDispatcher.eventRegistry[target] || {};
      targ[type] = fn;
      eventDispatcher.addEvent(type);
    }
  },

  /**
   * Calls event from registry.
   *
   * @param {object} event Event to be delegated by eventRegistry.
   */
  callEvent: function callEvent(event) {
    if (eventDispatcher.eventRegistry[event.target.id] && eventDispatcher.eventRegistry[event.target.id].hasOwnProperty(event.type)) {
      eventDispatcher.eventRegistry[event.target.id][event.type](event);
    } else if (eventDispatcher.eventRegistry[event.target.className] && eventDispatcher.eventRegistry[event.target.className].hasOwnProperty(event.type)) {
      eventDispatcher.eventRegistry[event.target.className][event.type](event);
    } else if (eventDispatcher.eventRegistry[event.target]) {
      eventDispatcher.eventRegistry[event.target][event.type](event);
    }
  },

  /**
   * Deletes event, or all events of any identifier, from eventRegistry.
   *
   * @param {string|object} target Html Element, its id, or its className
   * @param {string} type Name of event to delete
   */
  removeRegisteredEvent: function removeRegisteredEvent(target, type) {
    if (eventDispatcher.eventRegistry[target]) {
      if (type) {
        delete eventDispatcher.eventRegistry[target][type];
        eventDispatcher.removeEvent(type);
      } else {
        eventDispatcher.removeEvent(Object.keys(eventDispatcher.eventRegistry[target]));
        delete eventDispatcher.eventRegistry[target];
      }
    }
  }
};

/**
 * Adds event based on identifier for target. Element, id, or class for element.
 *
 * @param {object|string} target Identifier to delegate events to.
 * @param {string} eventName Name of event one wants to add functionality for.
 * @param {function} callback Function that one wants to be called on event.
 */
w.addEvent = function (eventName, target, callback) {
  //addEvent & bind handler to it
  eventDispatcher.registerEvent(target, eventName, callback);
};

/**
 * Removes the event for that identifier. Element, id, or class for element.
 * If no eventName is specified, it removes all bound events for that element.
 *
 * @param {object|string} target Identifier to delegate events to.
 * @param {string} [eventName] Name of event one wants to remove functionality for.
 */
w.removeEvent = function (target, eventName) {
  //addEvent & bind handler to it
  eventDispatcher.removeRegisteredEvent(target, eventName);
};

/**
 * Returns HTML5 nodes from htmlString.
 *
 * @param {string} htmlString String of valid html5 elements
 * @returns {object} Returns a NodeList
 */
w.html = function (htmlString) {
  var div = document.createElement('div');
  div.innerHTML = htmlString;
  return div.childNodes;
  //gets elements from htmlString & returns actual elements
};

/**
 * Inserts NodeList into the DOM
 *
 * @param {object} target DOM node to append elements to.
 * @param {object} nodeList HTML5 NodeList to be inserted.
 */
w.insert = function (target, nodeList) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; nodeList[i]; i++) {
    fragment.appendChild(nodeList[i]);
  }
  target.appendChild(fragment.cloneNode(true));
};

/**
 * Removes HTML5 node from the DOM
 *
 * @param {object} target DOM node to be removed.
 */
w.remove = function (target) {
  //remove the target element & all bound listener targets
  target.parentNode.removeChild(target);
};

/**
 * Find HTML5 node in the DOM
 *
 * @param {string} selectorReference CSS selector reference to html element
 * @returns {object} Returns a DOM Node
 */
w.find = function (selectorReference) {
  //use selectorReference to query all (wrapper)
  return document.querySelector(selectorReference);
};

/**
 * Find HTML5 node in the DOM by ID only
 *
 * @param {string} id An id of an element in the dom
 * @returns {object} Returns a DOM Node
 */
w.findId = function (id) {
  //use selectorReference to query all (wrapper)
  return document.getElementById(id);
};

/**
 * Find HTML5 node in the DOM by ID only & memoizes results ('m' for 'memoizes')
 *
 * @param {string} id An id of an element in the dom
 * @param {number} [timout] An optional lifespan for the caching
 * @returns {object} Returns a DOM Node
 */
w.mFindId = function (id, timeout) {
  if (!w.mFindId.cache) w.mFindId.cache = {};
  if (timeout) {
    window.setTimeout(function () {
      delete w.mFindId.cache[id];
    }, timeout);
  }
  return w.mFindId.cache[id] = w.mFindId.cache[id] || document.getElementById(id);
};
/**
 * Find HTML5 nodes in the DOM
 *
 * @param {string} selectorReference CSS selector reference to elements
 * @returns {object} Returns a NodeList
 */
w.findAll = function (selectorReferences) {
  return document.querySelectorAll(selectorReferences);
};

/**
 * Creates a function that caches the results of its computations.
 *
 * @param {function} fn A function to be memoized
 * @param {number} [timout] An optional lifespan for the results of the function
 * @returns {function} Returns the memoizing function
 */
w.mem = function (fn, timeout) {
  var cache = {};
  return function () {
    var args = Array.prototype.slice.call(_arguments);
    if (args in cache) {
      return cache[args];
    } else {
      var result = fn.apply(fn, args);
      cache[args] = result;
      if (timeout) {
        window.setTimeout(function () {
          delete cache[args];
        }, timeout);
      }
      return result;
    }
  };
};

/**
 * endsWith polyfill, tells us if string ends with other string
 *
 * @param {string} subjectString A string which will be tested
 * @param {string} searchString A string that will be tested against subjectString
 * @param {number} position A position index that can be tested for
 * @returns {boolean} Returns a boolean if subjectString ends with searchString at position if it's specified
 */
function endsWith(subjectString, searchString, position) {
  if (String.prototype.endsWith) {
    return String.prototype.endsWith.call(subjectString, searchString, position);
  } else {
    subjectString = subjectString.toString();
    if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
      position = subjectString.length;
    }
    position -= searchString.length;
    var lastIndex = subjectString.indexOf(searchString, position);
    return lastIndex !== -1 && lastIndex === position;
  }
};

/**
 * Template handler to escape html, expects $ before dynamic sections (so $$)
 *
 * @param {array} literals Array of strings
 * @param {array} substrings Array of strings
 * @returns {string} htmlString of escaped html
 */
w.tmp = function (literals) {
  for (var _len = arguments.length, substrings = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    substrings[_key - 1] = arguments[_key];
  }

  var finalString = '';
  substrings.forEach(function (substring, i) {
    var curr = literals.raw[i];
    if (substring.constructor === Array) {
      substring = substring.join('');
    }
    if (endsWith(curr, '$')) {
      curr.replace(/&/g, '&amp;').replace(/>/g, '&gt;').replace(/</g, '&lt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/`/g, '&#96;');
      curr = curr.slice(0, -1);
    }
    finalString += curr;
    finalString += substring;
  });
  finalString += literals.raw[literals.raw.length - 1];
  return finalString;
};
/**
 * Tests if String represents JSON
 *
 * @param {string} string A string that will be tested if it is JSON
 * @returns {boolean} Evaluation if string is json
 */
function jsonString(string) {
  try {
    JSON.parse(string);
  } catch (e) {
    return false;
  }
  return true;
}

/**
 * Makes POST request to a specified URL
 *
 * @param {string} url URL to make a get request to
 * @param {object} object Javascript object that one wants to send as JSON
 * @param {function} callback Function to handle the results of the function
 */
w.post = function (url) {
  var request = new XMLHttpRequest();
  var data = undefined;
  request.open("POST", url, true);
  var adapter = {
    attach: function attach(object) {
      data = JSON.stringify(object);
      return adapter;
    },
    header: function header() {
      for (var _len2 = arguments.length, y = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        y[_key2] = arguments[_key2];
      }

      request.setRequestHeader.apply(request, y);
      return adapter;
    },
    end: function end(callback) {
      data ? request.send(data) : request.send();
      request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
          if (request.status === 200) {
            var res = {};
            res.text = request.responseText;
            if (jsonString(request.responseText)) {
              res.body = JSON.parse(request.responseText);
            }
            callback(false, res);
          } else {
            var err = new Error("Request to " + url + " failed." + request.responseText);
            callback(err);
          }
        }
      };
    }
  };
  return adapter;
};

/**
 * Makes GET request to a specified URL
 *
 * @param {string} url URL to make a get request to
 * @param {function} callback Function to handle the results of the function
 */
w.get = function (url) {
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  var adapter = {
    header: function header() {
      for (var _len3 = arguments.length, y = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        y[_key3] = arguments[_key3];
      }

      request.setRequestHeader.apply(request, y);
      return adapter;
    },
    end: function end(callback) {
      request.send();
      request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
          if (request.status === 200) {
            var res = {};
            res.text = request.responseText;
            if (jsonString(request.responseText)) {
              res.body = JSON.parse(request.responseText);
            }
            callback(false, res);
          } else {
            var err = new Error("Request to " + url + " failed." + request.responseText);
            callback(err);
          }
        }
      };
    }
  };
  return adapter;
};

/**
 * Only export w
 */
exports.default = w;

},{}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _w = require('./w');

var _w2 = _interopRequireDefault(_w);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** Set Up webLine */
var webLine = {

  /** Location is originally set to 'home' */
  loc: 'home',

  /** onChange is called on every location change */
  onChange: function onChange(loc) {
    webLine.changeFunc(loc);
  },

  /** onChange function registration */
  register: function register(fn) {
    webLine.changeFunc = fn;
  },

  /**
   *  Input text to be parsed.
   *
   *  @param {string} text A String of text that will be parsed.
   */
  in: function _in(text) {
    text[0] === '/' ? webLine.slash.callCommand.apply(webLine.slash, getCommand(text)) : webLine.slash.callCommand(webLine.loc, text);
  },

  /**
   *  Output text to mounted div.
   *
   *  @param {string} text A String of text that will be output.
   */
  out: function out(text) {

    //produce output to screen
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(text));
    if (webLine.targetNode) {
      webLine.targetNode.appendChild(div);
      _w2.default.mFindId('webLineWrapper').scrollTop = _w2.default.mFindId('webLineWrapper').scrollHeight;
    } else {
      throw new Error('Mount must be called before outputting text.');
    }
  },

  /**
   *  Mount Display
   *
   *  @param {object} [targetNode] An HTML5 Node to mount to.
   *  @returns {object} Returns an array of strings, the command & text
   */
  mount: function mount(targetNode) {
    var div = document.createElement('div');
    div.id = 'webLine';
    targetNode ? targetNode.appendChild(div) : document.body.appendChild(div);

    //cache node after query
    webLine.targetNode = document.getElementById('webLine');
  }
};

/**
 *  A function to get the command and the text after the command
 *
 *  @param {string} text A string of text to be parsed
 *  @returns {object} Returns an array of strings, the command & text
 */
/**
 *  webLine.js is an interface boilerplate for a pseudo-'command line input'.
 *
 *  @author Albert Hermida
 *  @version 1.0
 */
function getCommand(text) {
  if (!getCommand.pattern) getCommand.pattern = /\/(\w*)\s/;
  var newText = text.match(getCommand.pattern);
  return newText ? [newText[1], text.slice(newText[1].length + 1)] : [text.slice(1)];
}

/**
 * Command Manager
 *
 * Simple API to allow users to add commands, and manages string parsers.
 */
webLine.slash = {
  commands: {},

  /**
   * Add a command and a function
   *
   * @param {string} command Should be the '/' command that will be associated with callback
   * @param {function} fn The function associated with the command.
   * @param {boolean} [instant] Whether the function should be called, but not moved to (location).
   * Any text supplied after '/command' will be fed into fn
   */
  add: function add(command, fn, locationOut, instant) {
    fn.instant = instant;
    fn.locationOut = locationOut;
    //replace or create function for a particular command
    webLine.slash.commands[command] = fn;
  },

  /**
   * Call a command's associated function with text
   *
   * @param {string} command Should be the '/' command that will be associated with callback
   * @param {function} fn will be the function associated with the command.
   * Any text supplied after '/command' will be fed into fn
   */
  callCommand: function callCommand(command, text) {
    if (text) {
      try {
        webLine.slash.commands[command](text);
      } catch (e) {
        webLine.out('Sorry, ' + command + ' is not a registered command');
      }
    } else {
      if (webLine.slash.commands.hasOwnProperty(command)) {
        if (webLine.slash.commands[command].instant) {
          webLine.slash.commands[command]();
        } else {
          webLine.onChange(command);
          webLine.loc = command;
          if (webLine.slash.commands[command].locationOut) {
            webLine.out('Location: ' + command);
          }
          if (webLine.slash.commands[command].hasOwnProperty('init')) {
            webLine.slash.commands[command].init();
          }
        }
      } else {
        //output to box or consoles
        if (webLine.hasOwnProperty('inputOut')) {
          //send output to input box placeholder
          webLine.inputOut('Sorry, ' + command + ' is not a registered command');
          setTimeout(function () {
            webLine.inputOut('/js');
          }, 3500);
        } else {
          //send output to console
          webLine.out('Sorry, ' + command + ' is not a registered command');
        }
      }
    }
  }
};

exports.default = webLine;

},{"./w":7}]},{},[6]);
