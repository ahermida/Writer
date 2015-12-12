/**
 * Actions triggered by the frontPage component, utility functions
 */
import w from '../w';
import store from '../Stores/store';
import frontPage from '../Components/frontPage';
import mainPage from '../Components/mainPage';

var frontPageActions = {};
//goes to the next item on the list

/**
 *  Trace Signup Input
 */
frontPageActions.nextInputItem = () => {
  let formGuide = w.findId('formGuide');
  let form      = w.findId('formInput');
  let note      = w.findId('notification');

  // set note if note doesn't exist
  if (!note) {
    note = w.html(`<div class="fail" id="notification"></div>`);
    w.insert(w.findId('formInputWrapperInner'), note);
  }
  switch (store.frontPage.targetItem) {
    case "username":
      store.frontPage.targetItem = "password";
      form.placeholder = "Password";
      form.type = "password";
      formGuide.textContent = "New Password:";
      note.className = "fail";
      note.textContent = "Press Enter";
      break;
    case "password":
      store.frontPage.targetItem = "firstName";
      form.placeholder = "First name";
      form.type = "text";
      formGuide.textContent = "First Name:";
      note.className = "fail";
      note.textContent = "Press Enter"
      break;
    case "firstName":
      store.frontPage.targetItem = "lastName";
      form.placeholder = "Last name";
      formGuide.textContent = "Last Name:";
      note.className = "fail";
      note.textContent = "Press Enter";
      break;
    default:
      store.frontPage.targetItem = "lastName";
      form.placeholder = "First name";
      formGuide.textContent = "First Name:";
      frontPageActions.signup();
      break;
  }
}
//goes to the previous item on the list
frontPageActions.previousInputItem = () => {
  let formGuide = w.findId('formGuide');
  let form      = w.findId('formInput');
  switch (store.frontPage.targetItem) {
    case "username":
      store.frontPage.targetItem = "username";
      form.placeholder = "writer@villanova.edu";
      formGuide.textContent = "Villanova Email:";
      break;
    case "password":
      store.frontPage.targetItem = "username";
      form.type = "text";
      form.placeholder = "writer@villanova.edu";
      formGuide.textContent = "Villanova Email:";
      break;
    case "firstName":
      store.frontPage.targetItem = "password";
      form.type="password";
      form.placeholder = "Password";
      formGuide.textContent = "Password:";
      break;
    default:
      store.frontPage.targetItem = "firstName";
      form.placeholder = "First name";
      formGuide.textContent = "First Name:";
  }
}


/**
 * Trace Login Form Input
 */

//goes to the previous item on the list
frontPageActions.nextInputItemLogin = () => {
  let formGuide = w.findId('formGuide');
  let form      = w.findId('formInputLogin');
  switch (store.frontPage.targetItem) {
    case "username":
      store.frontPage.targetItem = "password";
      form.type = 'password';
      form.placeholder = "Password";
      formGuide.textContent = "Password:";
      break;
    case "password":
      frontPageActions.login();
      break;
  }
}

frontPageActions.previousInputItemLogin = () => {
  let formGuide = w.findId('formGuide');
  let form      = w.findId('formInputLogin');
  switch (store.frontPage.targetItem) {
    case "username":
      store.frontPage.targetItem = "username";
      form.type="text";
      form.placeholder = "writer@villanova.edu";
      formGuide.textContent = "Villanova Email:";
      break;
    case "password":
      form.type = 'text';
      store.frontPage.targetItem = "username";
      form.placeholder = "writer@villanova.edu";
      formGuide.textContent = "Villanova Email:";
      break;
  }
}



/**
 * Form Validation -- I could (should) have compiled the regex, but I figure it's not that big a problem
 */

frontPageActions.parseItem = (input) => {
  let response = {};
  switch (store.frontPage.targetItem) {
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
}

frontPageActions.inputError = (message) => {
  //display message in notification
  let found = w.findId('notification');
  if (found) {
    found.textContent = message
  } else {
    let inner = w.findId('formInputWrapperInner');
    w.insert(inner, w.html(`
      <div class="success" id="notification">${message}</div>
    `));
  }
}
function validateEmail(email) {
  var regexp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@villanova.edu/;
  return regexp.test(email);
}
function validatePassword(input) {
  let regexp = /(?=.*\d)(?=.*[a-zA-Z]).{7,}/;
  return regexp.test(input);
}
function validateName(name) {
  let regexp = /(?=[a-zA-Z]).{2,}/;
  return regexp.test(name);
}

/**
 * AJAX Stuff Here On
 */
frontPageActions.login = () => {
  w.post(`http://${location.host}/users/login`)
  .attach({
    username: store.frontPage.login.username,
    password: store.frontPage.login.password
  })
  .header('Access-Control-Allow-Headers', '*')
  .header('Content-Type', "application/json")
  .end(function(err, res){
    if (err) {
      console.log(err);
      return;
    } else {
      if (res.body.success) {
        //handle successful login, save token -> load main view
        localStorage.WriterKey = res.body.token;
        frontPage.remove();
        //load main view here.
        mainPage.initialize();
        return;
      } else {
        let formGuide = w.findId('formGuide');
        let form      = w.findId('formInputLogin');
        store.frontPage.targetItem = "username";
        form.type = 'text';
        form.placeholder = "writer@villanova.edu"
        formGuide.textContent = "Villanova Email:"
        //display res.message in notification
        let found = w.findId('notification');
        if (found) {
          found.textContent = res.body.message;
        } else {
          console.log(res.body.success);
          w.insert(w.findId('formInputWrapperInner'), w.html(`<div class="success" id="notification">${res.body.message}</div>`));
        }
      }
    }
  });
};

frontPageActions.signup = () => {
  w.post(`http://${location.host}/users/make`)
  .attach({
    username: store.frontPage.signup.username,
    password: store.frontPage.signup.password,
    firstName:  store.frontPage.signup.firstName,
    lastName: store.frontPage.signup.lastName

  })
  .header('Access-Control-Allow-Headers', '*')
  .header('Content-Type', "application/json")
  .end(function(err, res){
    if (err) {
      console.log(err);
      return;
    } else {
      if (res.body.success) {
        let formGuide = w.findId('formGuide');
        let form      = w.findId('formInput');
        form.placeholder = "writer@villanova.edu";
        store.frontPage.targetItem = "username";
        formGuide.textContent = "Villanova Email:";
        //handle successful login, save token -> load main view
        //load main view here.
        let found     = w.findId('notification');
        if (found) {
          found.textContent = res.body.message;
        } else {
          w.insert(w.findId('formInputWrapperInner'), w.html(`
            <div class="success" id="notification">${res.body.message}</div>
          `));
        }
        return;
      } else {
        let formGuide = w.findId('formGuide');
        let form      = w.findId('formInput');
        form.placeholder = "writer@villanova.edu";
        store.frontPage.targetItem = "username";
        formGuide.textContent = "Villanova Email:";
        //display res.body.message in notification
        let found     = w.findId('notification');
        if (found) {
          found.textContent = res.body.message;
        } else {
          w.insert(w.findId('formInputWrapperInner'), w.html(`
            <div class="success" id="notification">${res.body.message}</div>
          `));
        }
      }
    }
  });
};



export default frontPageActions;
