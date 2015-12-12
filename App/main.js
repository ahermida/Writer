import w from './w';
import frontPage from './Components/frontPage';
import mainPage from './Components/mainPage';

//initialize app
(()=>{

  //will be true if user has token, then it will try to send user to the next page if he has one.
  let authUser = localStorage.getItem('WriterKey');

  if (authUser) {

    //remove all items from current view and replace with mainPage
    frontPage.remove();
    mainPage.initialize();

  } else {

    //initialize entry
    frontPage();

  }
})();
