/**
 * Data Storage for App
 */

 var store                 = {};

//front
store.frontPage            = {};
store.frontPage.login      = {};
store.frontPage.signup     = {};
store.frontPage.inputVal   = "";
store.frontPage.targetItem = "username";

//main
store.mainPage             = {};
store.mainPage.user        = '';
store.mainPage.jsStash     = [];
store.mainPage.noteStash   = [];

export default store;
