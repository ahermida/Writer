import w from '../w';
import views from '../Views/views';
import store from '../Stores/store';
import frontPageActions from '../Actions/frontPageActions'

//just to keep track of all the listeners in the field. (make clean-up easier)

var frontPage = () => {
  //active listeners for loginView
  frontPage.listeners = [];

  //add click event & keep track of about
  w.addEvent('click', 'about', (event) => {
    //on click of 'about, remove input, bring in about view
    let frontPageContent = w.findId('frontPageContent');
    let oldView = w.findId('frontPageCenter');
    let aboutView = w.html(views.about)[1];
    frontPageContent.replaceChild(aboutView, oldView);
    document.getElementById("hacker").load();
  });
  frontPage.listeners.push('about');

  //add click event & keep track of team
  w.addEvent('click', 'team', (event) => {
    //on click of 'about, remove input, bring in about view'
    let frontPageContent = w.findId('frontPageContent');
    let oldView = w.findId('frontPageCenter');
    let teamView = w.html(views.team)[1];
    frontPageContent.replaceChild(teamView, oldView);
  });
  frontPage.listeners.push('team');

  //add click event & keep track of login view
  w.addEvent('click', 'login', (event) => {
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

  //on click of signup switch to signup
  w.addEvent('click', 'signup', (event) => {
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

  //for login, no form validation
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

  w.addEvent('keyup', 'formInput', (event) => {
    let tryForm = frontPageActions.parseItem(event.target.value.trim());
    //handle keypresses
    if (event.keyCode === 13) {
      let evaluation = frontPageActions.parseItem(event.target.value.trim());
      //fill out form & jump to next part
      if (evaluation.success) {
        store.frontPage.signup[store.frontPage.targetItem] = event.target.value;
        frontPageActions.nextInputItem();
        event.target.value = '';
      } else {
        frontPageActions.inputError(evaluation.message);
      }
    } else if (!store.frontPage.inputVal && event.keyCode === 8 ) {
      //jump to previous
      frontPageActions.previousInputItem();
    } else if (tryForm.success) {
      w.findId('notification').className = "success";
    }
    if (!store.frontPage.inputNote) {
      w.insert(w.findId('formInputWrapperInner'), w.html(`<div class="fail" id="notification">Press Enter</div>`));
      w.findId('notification').className = "fail";
      store.frontPage.inputNote = true;
    }
    store.frontPage.inputVal = event.target.value;
  });
  frontPage.listeners.push('formInput');

  w.addEvent('click', 'notification', (event) => {
    let item = w.findId('notification');
    if (item) {
      w.remove(item);
    }
  });
  frontPage.listeners.push('notification');
};
//insert frontPage into the view
frontPage.initialize = () => {
  w.insert(document.body, w.html(w.tmp`
    <div id="frontPage">
      <div id="bgVideoWrapper">
        <video id="bgVideo" preload="auto" muted="muted" loop="loop" autoplay="true">
          <source src="lombard.webm" type="video/webm">
        </video>
      </div>
      <div id="frontPageContent">
        <div id="navbar">
          <a href="http://${location.host}" id="frontPageLogo">W</a>
          <a href="http://${location.host}" id="frontPageLogoRight">riter</a>
          <span id="navbar-right">
            <span id="team">Team</span>
            <span id="about">About</span>
            <span id="login">Login</span>
          </span>
        </div>
        <div id="frontPageCenter">
          <div id="formInputWrapper">
            <h3 id="inputLabel">Sign up, it's free.</h3>
            <div id="formInputWrapperInner">
              <p id="formGuide">Villanova Email:</p>
              <input id="formInput" placeholder="writer@villanova.edu">
            </div>
          </div>
        </div>
      </div>
     </div>
  `));
  frontPage();
};

//function to completely remove frontPage & its 'listeners'
frontPage.remove = () => {
  //reset store, remove html, and remove events
  store.frontPage = {};
  store.frontPage.login = {};
  store.frontPage.signup = {};
  store.frontPage.inputVal = "";
  store.frontPage.targetItem = "";
  store.frontPage.inputNote = false;
  w.remove(w.findId('frontPage'));

  frontPage.listeners = frontPage.listeners || [];
  frontPage.listeners.forEach((identifier) => {
    w.removeEvent(identifier);
  });
  frontPage.listeners = [];
};

//export frontPage

export default frontPage;
