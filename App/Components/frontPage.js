/**
 * Controller for fronPage.js -- manages events and mounting
 */
import w from '../w';
import views from '../Views/views';
import store from '../Stores/store';
import frontPageActions from '../Actions/frontPageActions'


/**
 * Function to mount listeners
 */
var frontPage = () => {

  //active 'listeners' for loginView
  frontPage.listeners = [];

  /**
   * Handle Click on 'About'
   */
  w.addEvent('click', 'about', (event) => {
    store.frontPage.signup = {};
    store.frontPage.login = {};

    //on click of 'about, remove input, bring in about view
    let frontPageContent = w.findId('frontPageContent');
    let oldView = w.findId('frontPageCenter');
    let aboutView = w.html(views.about)[1];
    frontPageContent.replaceChild(aboutView, oldView);
    document.getElementById("hacker").load();
  });
  frontPage.listeners.push('about');

  /**
   * Handle Click on 'Team'
   */
  w.addEvent('click', 'team', (event) => {
    store.frontPage.signup = {};
    store.frontPage.login = {};

    //on click of 'about, remove input, bring in about view'
    let frontPageContent = w.findId('frontPageContent');
    let oldView = w.findId('frontPageCenter');
    let teamView = w.html(views.team)[1];
    frontPageContent.replaceChild(teamView, oldView);
  });
  frontPage.listeners.push('team');

  /**
   * Handle Click on 'Login'
   */
  w.addEvent('click', 'login', (event) => {
    store.frontPage.signup = {};
    store.frontPage.targetItem = "username";

    //on click of 'login' remove input, bring in about view
    let frontPageContent = w.findId('frontPageContent');
    let oldView = w.findId('frontPageCenter');
    let loginView = w.html(views.login)[1];
    frontPageContent.replaceChild(loginView, oldView);
    let login = w.findId('login');
    login.textContent = "Signup"
    login.id = "signup";
  });
  frontPage.listeners.push('login');

  /**
   * Handle Click on 'Signup'
   */
  w.addEvent('click', 'signup', (event) => {
    store.frontPage = {};
    store.frontPage.login = {};
    store.frontPage.signup = {};
    store.frontPage.inputVal = "";
    store.frontPage.targetItem = "username";

    //on click of 'signup', remove input, bring in about view'
    let frontPageContent = w.findId('frontPageContent');
    let oldView = w.findId('frontPageCenter');
    let signupView = w.html(views.signup)[1];
    frontPageContent.replaceChild(signupView, oldView);
    let login = w.findId('signup');
    login.textContent = "Login";
    login.id = "login";
  });

  /**
   * Handle Keyup on Login Form
   */
  w.addEvent('keyup', 'formInputLogin', (event) => {
    if (event.keyCode == 13) {
      store.frontPage.login[store.frontPage.targetItem] = event.target.value;
      frontPageActions.nextInputItemLogin();
      event.target.value = '';
    } else if (event.keyCode == 8 && !store.frontPage.inputVal) {
      frontPageActions.previousInputItemLogin();
    }
    store.frontPage.inputVal = event.target.value;
  });

  /**
   * Handle Keyup on Singup Form
   */
  w.addEvent('keyup', 'formInput', (event) => {

    //check if valid item for target
    let tryForm = frontPageActions.parseItem(event.target.value.trim());

    //handle keypresses ENTER & BACKSPACE (when empty)
    if (event.keyCode === 13) {

      //fill out form & jump to next part
      if (tryForm.success) {
        store.frontPage.signup[store.frontPage.targetItem] = event.target.value;
        frontPageActions.nextInputItem();
        event.target.value = '';
        w(()=>{
          let note = w.findId('notification');
          note.className = "fail";
        });
      } else {

        //show error in white
        frontPageActions.inputError(tryForm.message);
      }
    }

    //Handle BACKSPACE
    if (!store.frontPage.inputVal && event.keyCode === 8 ) {

      //jump to previous
      frontPageActions.previousInputItem();
    }

    //Handle Successful Form -- let the user know -- (passive)
    var found = w.findId('notification');
    if (tryForm.success) {
      if (found) {
        found.className = "success";
      } else {
        w.insert(w.findId('formInputWrapperInner'), w.html(`<div class="success" id="notification">Press Enter</div>`));
      }
    } else {
      if (found) {
        found.className = "fail";
      } else {
        w.insert(w.findId('formInputWrapperInner'), w.html(`<div class="fail" id="notification">Press Enter</div>`));
      }
    }
    store.frontPage.inputVal = event.target.value;
  });
  frontPage.listeners.push('formInput');
};

/**
 * insert frontPage into the view -- not used, just for conformity
 * frontPage should only be accessible by pageload to logged out users
 */
frontPage.initialize = () => {}

/**
 * Handle View Removal
 */
frontPage.remove = () => {
  
  //reset store, remove html, and remove events
  store.frontPage = {};
  store.frontPage.login = {};
  store.frontPage.signup = {};
  store.frontPage.inputVal = "";
  store.frontPage.targetItem = "";
  w.remove(w.findId('frontPage'));

  frontPage.listeners = frontPage.listeners || [];
  frontPage.listeners.forEach((identifier) => {
    w.removeEvent(identifier);
  });
  frontPage.listeners = [];
};


export default frontPage;
