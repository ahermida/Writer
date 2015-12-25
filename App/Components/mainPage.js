import webLine from '../webLine';
import w from '../w';
import store from '../Stores/store';
import views from '../Views/views';

var mainPage = () => {
  mainPage.listeners = [];
  window.webLine = webLine; //expose webLine for /js
  let addLocation = (loc) => {
    addLocation.loc = addLocation.loc || 0;
    addLocation.locs = addLocation.locs || [];
    if (addLocation.locs.indexOf(loc) == -1) {
      addLocation.locs[addLocation.loc % 3] = loc;
      w.findId(`recent${(addLocation.loc % 3) + 1}`).textContent = loc;
      addLocation.loc++;
    }
  };
  //allows for failure text to be placed in the textbox
  webLine.inputOut = (text) => {
    w.mFindId('formInput').placeholder = text;
  };

  /**
   *  The handler for /js
   */
  webLine.slash.add('js', (text) => {
    let response;
    store.mainPage.jsStash.push(text);
    try {
      response = eval.call(window, text);
    } catch (e) {
      response = e;
    }
    if (!response) {
      let isSpecial = text.match(/^(var|function)\s+(.*)(;|\s*)(\(|=)/);
      if (isSpecial) {
        response = `${isSpecial[1]} ${isSpecial[2]}`;
      } else {
        response = 'undefined';
      }
    }
    webLine.out(response);
    w.mFindId('webLineWrapper').scrollTop = w.mFindId('webLineWrapper').scrollHeight;
  }, true, false); // show location: js, not instant

  /**
   *  The handler for /google
   */
  webLine.slash.add('google', (text) => {
    let label = w.mFindId('inputLabel');
    if (label) {
      label.textContent = text;
    } else {
      let parent = w.findId('webLineWrapper');
      while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
      }
      let home = w.html(`<h3 id="inputLabel">Google</h3>`);
      w.insert(parent, home);
    }
    location.href = 'https://www.google.com/search?q=' + text.split(' ').join('+');
  }, false, false); //don't show location: google because it has its own header, not instant
  webLine.slash.commands.google.init = () => {
    //initialize google command
    let parent = w.findId('webLineWrapper');
    let home = w.html(`<h3 id="inputLabel">Google</h3>`);
    w.insert(parent, home);
  }

  /**
   *  The handler for /facebook
   */
  webLine.slash.add('facebook', (text) => {
    let label = w.mFindId('inputLabel');
    if (label) {
      label.textContent = text;
    } else {
      let parent = w.findId('webLineWrapper');
      while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
      }
    }
    location.href = 'https://www.facebook.com/search?q=' + text.split(' ').join('+');
  }, false, false); //don't show location: facebook because it has its own header, not instant
  webLine.slash.commands.facebook.init = () => {
    //initialize facebook command
    let parent = w.findId('webLineWrapper');
    let home = w.html(`<h3 id="inputLabel">Facebook</h3>`);
    w.insert(parent, home);
  }

  /**
   *  The handler for /youtube
   */
  webLine.slash.add('youtube', (text) => {
    let label = w.mFindId('inputLabel');
    if (label) {
      label.textContent = text;
    } else {
      let parent = w.findId('webLineWrapper');
      while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
      }
      let home = w.html(`<h3 id="inputLabel">Youtube</h3>`);
      w.insert(parent, home);
    }
    location.href = 'https://www.youtube.com/results?search_query=' + text.split(' ').join('+');
  }, false, false); //don't show location: youtube because it has its own header, not instant
  webLine.slash.commands.youtube.init = () => {
    //initialize youtube command
    let parent = w.findId('webLineWrapper');
    let home = w.html(`<h3 id="inputLabel">Youtube</h3>`);
    w.insert(parent, home);
  }

  /**
   *  Logout
   */
  webLine.slash.add('logout', (text) => {
    window.localStorage.WriterKey = "";
    location.href = `http://${location.host}`;
  }, false, true); //instant, no need to show anything

  /**
   *  The handler for /home
   */
  webLine.slash.add('home', text => {
    let label = w.mFindId('inputLabel');
    if (label) {
      label.textContent = text;
    } else {
      let parent = w.findId('webLineWrapper');
      while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
      }
      let home = w.html(`<h3 id="inputLabel">Welcome.</h3>`);
      w.insert(parent, home);
    }
  }, false, false); //no need for location: home, it has its own header. Not instant
  webLine.slash.commands.home.init = () => {
    //initialize home command
    let parent = w.findId('webLineWrapper');
    let home = w.html(`<h3 id="inputLabel">Home</h3>`);
    w.insert(parent, home);
  }

  /**
   *  The handler for /clear
   */
  webLine.slash.add('clear', () => {
    //clear space first
    let parent = w.findId('webLine');
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
    //remove all contents of it
  }, false, true); //no need to show location, we're gonna clear the screen

  /**
   *  The handler for /location
   */
  webLine.slash.add('location', () => webLine.out(webLine.loc), true, true);
  /**                                                           ^show location, instant */


  /**
   *  Register middleware for each change in the application - clears the output box
   */
  webLine.register((location) => {
    addLocation(location);
    //clear space first
    let parent = w.findId('webLineWrapper');
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
    webLine.mount(w.findId('webLineWrapper')); // replace note
  });

  /**
   *  Events -- Keyboard & Clicks --
   */

  /** Handle Main Box -- formInput --  text input */
  w.addEvent('keyup', 'formInput', (event) => {
    //handle main box
    if (event.keyCode === 13) {
      webLine.in(event.target.value);
      event.target.value = '';
      let dropdown = w.findId('dropdown');
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
      let dropdown = w.findId('dropdown');
      if (dropdown) {
        //remove dropdow
        while (dropdown.firstChild) {
          dropdown.removeChild(dropdown.firstChild);
        }
      }
      //render dropdown
      dropdown.className = "";
      let list = Object.keys(webLine.slash.commands).filter((command)=>{
       return command.indexOf(event.target.value.substr(1)) !== -1;
      });
      //log list for testing
      list = list.slice(0,4);
      if (!list.length) {
        dropdown.className = "hidden";
      }
      let dropdownHtml = w.tmp`
      $${list.map((listItem)=>`<div id="${listItem}" class="dropdownItem">
                                  <span class="dropdownText">${listItem}</span>
                               </div>`)}
      `;
      //gotta take a look at my insert function, seems to be giving me problems
      let range = document.createRange();
      // make the parent of the first div in the document becomes the context node
      range.selectNode(dropdown);
      //why doesn't google's app engine ever update static files?
      var documentFragment = range.createContextualFragment(dropdownHtml);
      dropdown.appendChild(documentFragment.cloneNode(true));
    }
    if (!event.target.value) {
      let dropdown = w.findId('dropdown');
      dropdown.className = "hidden";
    }
  });
  mainPage.listeners.push('formInput')


  /** Handle Recents -- located in the top right corner */
  w.addEvent('click', 'recents', (event) => {
    //puts / before so it will run as a command
    webLine.in(`/${event.target.textContent}`);
    let input = w.mFindId('formInput').value = '';
    let dropdown = w.mFindId('dropdown');
    dropdown.className = "hidden";
  });
  mainPage.listeners.push('recents');


  /** Handle Dropdown -- under the textbox */
  w.addEvent('click', 'dropdownItem', (event) => {
    //find id
    let dropdown = w.mFindId('dropdown');
    dropdown.className = "hidden";
    webLine.in(`/${event.target.id}`);
    w.mFindId('formInput').value = '';
  });
  mainPage.listeners.push('dropdownItem');

  /** Handle Drop down text -- duplicate event for uniformity */
  w.addEvent('click', 'dropdownText', (event) => {
    //workaround to handle clicks on text
    let dropdown = w.mFindId('dropdown');
    dropdown.className = "hidden";
    webLine.in(`/${event.target.parentNode.id}`);
    w.mFindId('formInput').value = '';
  });
  mainPage.listeners.push('dropdownText');
};

/**
 * Remove Element From Screen
 */
mainPage.remove = () => {
  w.remove(w.findId('mainPage'));
  mainPage.listeners.forEach((identifier) => {
    w.removeEvent(identifier);
  });
};

/**
 * Initialize mainPage
 */
mainPage.initialize = () => {
  //check token
  w.post(`http://${location.host}/api/user`)
  .header('WriterKey', localStorage.getItem('WriterKey'))
  .header('Access-Control-Allow-Headers', '*')
  .header('Content-Type', "application/json")
  .end((err, res) => {
    if (err) {
      console.log(err);
    } else {
      if (res.body.success) {
        //handle successful login, save token -> load main view
        store.mainPage.user = res.body.firstName;
        let usr = w.findId('firstName');
        usr.textContent = store.mainPage.user;
        //load main view here.
      } else {
        //display res.message in notification
        localStorage.removeItem("WriterKey");
        //return to frontPage via reload for simplicity & uniformity
        location = `http://${location.host}`;
      }
    }
  });
  //insert view into body, as well as webLine target setup
  w.insert(document.body, w.html(views.main));
  webLine.mount(w.findId('webLineWrapper'));
  mainPage();
};

export default mainPage;
