/**
 * Actions triggered by the frontPage component, utility functions
 */
import w from '../w';
import store from '../Store/store';

var frontPageActions;
//goes to the next item on the list
frontPageActions.nextInputItem = () => {
  let formGuide = w.mFindId('formGuide');
  let form      = w.mFindId('formInput');
  switch store.targetItem {
    case "username":
      store.frontPage.targetItem = "password";
      form.placeholder = store.frontPage.targetItem;
      formGuide.nodeValue = "New Password:"
      break;
    case "password":
      store.frontPage.targetItem = "firstName":
      form.placeholder = store.frontPage.targetItem;
      formGuide.nodeValue = "First Name:"
      break;
    case "firstName":
      store.frontPage.targetItem = "lastName":
      form.placeholder = store.frontPage.targetItem;
      formGuide.nodeValue = "Last Name:"
      break;
    default:
      store.frontPage.targetItem = "lastName";
  }
}
//goes to the previous item on the list
frontPageActions.previousInputItem = () => {
  let formGuide = w.mFindId('formGuide');
  let form      = w.mFindId('formInput');
  switch store.targetItem {
    case "username":
      store.frontPage.targetItem = "username";
      form.placeholder = store.frontPage.targetItem;
      formGuide.nodeValue = "Villanova Email:"
      break;
    case "password":
      store.frontPage.targetItem = "username":
      form.placeholder = store.frontPage.targetItem;
      formGuide.nodeValue = "Villanova Email:"
      break;
    case "firstName":
      store.frontPage.targetItem = "password":
      form.placeholder = store.frontPage.targetItem;
      formGuide.nodeValue = "Password:"
      break;
    default:
      store.frontPage.targetItem = "firstName";
      form.placeholder = store.frontPage.targetItem;
      formGuide.nodeValue = "First Name:"
  }
}

//form validation
frontPageActions.parseItem = (input) => {
  let response = {};
  switch store.frontPage.targetItem {
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
}
frontPageActions.inputError = (message) => {
  store.frontPage.inputError = false;
}
function validateEmail(email) {
  let regexp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@villanova.edu/;
  return regexp.test(email);
}
function validatePassword(input) {
  let regexp = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{7,}/;
  return regexp.test(input);
}
function validateName(name) {
  let regexp = /(?=.*[a-z])(?=.*[A-Z]).{2,}/;
  return regexp.test(name);
}

export default frontPageActions;
