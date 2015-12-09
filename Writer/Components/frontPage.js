import w from '../w';
import views from '../Views/views';
import store from '../Store/store';
import frontPageActions from '../Actions/frontPageActions'

//just to keep track of all the listeners in the field. (make clean-up easier)

var frontPage = () => {
  //active listeners for loginView
  frontPage.listeners = [];

  //add click event & keep track of about
  w.addEvent('click', 'about', ()=>{
    //on click of 'about, remove input, bring in about view
    frontPageActions.activate('about');
    w.remove(w.mFindId('frontPageCenter'));
    w.insert(w.mFindId('frontPageContent'), w.html(views.about));
  });
  frontPage.listeners.push('about');

  //add click event & keep track of team
  w.addEvent('click', 'team', ()=>{
    //on click of 'about, remove input, bring in about view'
    frontPageActions.activate('team');
    w.remove(w.mFindId('frontPageCenter'));
    w.insert(w.mFindId('frontPageContent'), w.html(views.team));
  });
  frontPage.listeners.push('team');

  //add click event & keep track of login view
  w.addEvent('click', 'login', ()=>{
    //on click of 'about, remove input, bring in about view'
    frontPageActions.activate('login');
    w.remove(w.mFindId('frontPageCenter'));
    w.insert(w.mFindId('frontPageContent'), w.html(views.login));
  });
  frontPage.listeners.push('login');

  w.addEvent('keyup', 'formInput', () => {
    let tryForm = frontPageActions.parseItem(event.target.value.trim());
    //handle keypresses
    if (event.keyCode === 13) {
      let evaluation = frontPageActions.parseItem(event.target.value.trim());
      //fill out form & jump to next part
      if (evaluation.success) {
        frontPageActions.nextInputItem();
      } else {
        frontPageActions.inputError(evaluation.message);
      }
    } else if (event.keyCode === 8 && !event.target.value.trim()) {
      //jump to previous
      frontPageActions.previousInputItem();
    } else if (tryForm.success) {
      w.mFindId('notification').className = "success";
    }
    if (!store.frontPage.inputNote) {
      w.insert(w.mFindId('formInputWrapperInner'), w.html(`<div class="success" id="notification">Press Enter</div>`));
      w.mFindId('notification').className = "";
      store.frontPage.inputNote = true;
    }
  });
  frontPage.listeners.push('formInput');

  w.addEvent('click', 'notification', () => {
    let item = w.mFindId('notification');
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
          <a href="http://localhost:8080/" id="frontPageLogo">W</a>
          <a href="http://localhost:8080/" id="frontPageLogoRight">riter</a>
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
  frontPage.listeners = [];
  store.frontPage = {};
  w.remove(w.findId('frontPage'));
  frontPage.listeners.forEach((identifier) => {
    w.removeEvent(identifier);
  });
};
export default frontPage;
