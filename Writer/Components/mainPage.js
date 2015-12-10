import webLine from '../webLine';
import w from '../w';
import store from '../Stores/store';
import views from '../Views/views';

//init
var mainPage = () => {
  window.webLine = webLine; //expose webLine
  mainPage.listeners = [];
  webLine.slash.add('js', (text) => {
    let response;
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
  });
  webLine.slash.add('google', (text) => {
    location.href = 'https://www.google.com/search?q=' + text.split(' ').join('+');
  });
  webLine.slash.add('facebook', (text) => {
    location.href = 'https://www.facebook.com/search?q=' + text.split(' ').join('+');
  });
  webLine.slash.add('youtube', (text) => {
    location.href = 'https://www.youtube.com/results?search_query=' + text.split(' ').join('+');
  });
  webLine.slash.add('logout', (text) => {
    window.localStorage.WriterKey = "";
    location.href = 'http://localhost:8080';
  }, true);
  
  w.addEvent('keyup', 'formInput', function(event) {
    if (event.keyCode === 13) {
      webLine.in(event.target.value);
      event.target.value = '';
    }
  });
  /** Initialize Base Commands */
  webLine.slash.add('home', text => {
    let label = w.mFindId('inputLabel');
    if (label) {
      label.textContent = text;
    } else {
      parent = w.findId('webLineWrapper');
      while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
      }
      w.insert(parent, w.html(`<h3 id="inputLabel">Welcome.</h3>`));
    }
  });
  webLine.slash.add('location', () => webLine.out(webLine.loc), true);

  mainPage.listeners.push('formInput');
  webLine.register((location) => {
    //clear space first
    parent = w.findId('webLineWrapper');
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
    webLine.mount(w.findId('webLineWrapper')); // replace note
  });
};
mainPage.remove = () => {
  w.remove(w.findId('mainPage'));
  mainPage.listeners.forEach((identifier) => {
    w.removeEvent(identifier);
  });
};
mainPage.initialize = () => {
  //check token
  w.post('http://localhost:8080/api/user')
  .header('WriterKey', localStorage.getItem('WriterKey'))
  .header('Access-Control-Allow-Headers', '*')
  .header('Content-Type', "application/json")
  .end(function(err, res){
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
        location = "http://localhost:8080";
      }
    }
  });
  w.insert(document.body, w.html(views.main));
  webLine.mount(w.findId('webLineWrapper'));
  mainPage();
};

export default mainPage;
