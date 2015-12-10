/**
 * Vies for App
 */
import w from '../w'
var views = {};
views.about = `
<div id="frontPageCenter" class="content">
  <h1 class="contentPiece">About</h1>
  <div class="contentPiece">
    <video height="200" width="300" id="hacker" preload="auto" loop="true" muted="true" autoplay="true">
      <source src="hackers.webm" type="video/webm">
    </video>
    <p>
    What we wanted to create with this was a place to go and utilize the capabilites of the web on a
    constructive platform. We wanted to make a programmable environment on the web to see what cool things
    we could make.
    </p>
  </div>
</div>
`;
views.team  = `
<div id="frontPageCenter" class="content">
  <h1 class="contentPiece">Team</h1>
  <div class="contentPiece">
    <img src="https://avatars1.githubusercontent.com/u/8062697?v=3&u=46e6d908dca2dd21b35f5848efad453f6db662c4&s=140">
    <h3 class="name">Albert Hermida</h3>
    <img src="https://avatars2.githubusercontent.com/u/15746937?v=3&s=400">
    <h3 class="name">Steve Butcher</h3>
  </div>
</div>

`;
//login view
views.login = `
<div id="frontPageCenter">
  <div id="formInputWrapper">
    <h3 id="inputLabel">Log in, it's still free.</h3>
    <div id="formInputWrapperInner">
      <p id="formGuide">Villanova Email:</p>
      <input id="formInputLogin" placeholder="writer@villanova.edu">
    </div>
  </div>
</div>
`;

//signup view
views.signup = `
  <div id="frontPageCenter">
    <div id="formInputWrapper">
      <h3 id="inputLabel">Sign up, it's free.</h3>
      <div id="formInputWrapperInner">
        <p id="formGuide">Villanova Email:</p>
        <input id="formInput" placeholder="writer@villanova.edu">
      </div>
    </div>
  </div>
`;

views.main=`<div id="mainPage">
  <div id="mainPageContent">
    <div id="navbarMain">
      <a href="http://${location.host}" id="frontPageLogoMain">W</a>
      <span id="navbarMain-right">
        <span class="recent" id="recent3"></span>
        <span class="recent" id="recent2"></span>
        <span class="recent" id="recent1"></span>
        <span id="firstName"></span>
      </span>
    </div>
    <div id="mainPageCenter">
      <div id="formInputWrapper">
      <div id="webLineWrapper">
        <h3 id="inputLabel">Welcome.</h3>
      </div>
      <div id="formInputWrapperInner">
        <input id="formInput" class="mainInput" placeholder="/js">
      </div>
      </div>
    </div>
  </div>
 </div>
`
export default views;
