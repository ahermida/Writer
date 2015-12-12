/**
 * Data Storage for App
 */
//front
import w from '../w'
var store                  = {};
store.frontPage            = {};
store.frontPage.login      = {};
store.frontPage.signup     = {};
store.frontPage.inputVal   = "";
store.frontPage.targetItem = "username";
//main
store.mainPage             = {};
store.mainPage.user        = '';
export default store;
