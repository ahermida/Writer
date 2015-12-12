/**
 *  webLine.js is an interface boilerplate for a pseudo-'command line input'.
 *
 *  @author Albert Hermida
 *  @version 1.0
 */
import w from './w';
/** Set Up webLine */
var webLine = {

  /** Location is originally set to 'home' */
  loc: 'home',

  /** onChange is called on every location change */
  onChange: (loc) => {
    webLine.changeFunc(loc);
  },

  /** onChange function registration */
  register: (fn) => {
    webLine.changeFunc = fn;
  },

  /**
   *  Input text to be parsed.
   *
   *  @param {string} text A String of text that will be parsed.
   */
  in: text => {
    (text[0] === '/') ? webLine.slash.callCommand.apply(webLine.slash, getCommand(text)) :
                        webLine.slash.callCommand(webLine.loc, text);
  },

  /**
   *  Output text to mounted div.
   *
   *  @param {string} text A String of text that will be output.
   */
  out: text => {

    //produce output to screen
    let div = document.createElement('div');
    div.appendChild(document.createTextNode(text));
    if (webLine.targetNode) {
      webLine.targetNode.appendChild(div);
      w.mFindId('webLineWrapper').scrollTop = w.mFindId('webLineWrapper').scrollHeight;
    } else {
      throw new Error('Mount must be called before outputting text.');
    }
  },

  /**
   *  Mount Display
   *
   *  @param {object} [targetNode] An HTML5 Node to mount to.
   *  @returns {object} Returns an array of strings, the command & text
   */
  mount: targetNode => {
    let div = document.createElement('div');
    div.id = 'webLine';
    targetNode ? targetNode.appendChild(div) :
                 document.body.appendChild(div);

    //cache node after query
    webLine.targetNode = document.getElementById('webLine');
  }
};

/**
 *  A function to get the command and the text after the command
 *
 *  @param {string} text A string of text to be parsed
 *  @returns {object} Returns an array of strings, the command & text
 */
function getCommand(text) {
    if (!getCommand.pattern) getCommand.pattern = /\/(\w*)\s/;
    let newText = text.match(getCommand.pattern);
    return newText ? [newText[1], text.slice(newText[1].length + 1)] : [text.slice(1)];
}

/**
 * Command Manager
 *
 * Simple API to allow users to add commands, and manages string parsers.
 */
webLine.slash = {
  commands: {},

 /**
  * Add a command and a function
  *
  * @param {string} command Should be the '/' command that will be associated with callback
  * @param {function} fn The function associated with the command.
  * @param {boolean} [instant] Whether the function should be called, but not moved to (location).
  * Any text supplied after '/command' will be fed into fn
  */
  add: (command, fn, locationOut, instant) => {
    fn.instant = instant;
    fn.locationOut = locationOut;
    //replace or create function for a particular command
    webLine.slash.commands[command] = fn;
  },

 /**
  * Call a command's associated function with text
  *
  * @param {string} command Should be the '/' command that will be associated with callback
  * @param {function} fn will be the function associated with the command.
  * Any text supplied after '/command' will be fed into fn
  */
  callCommand: (command, text) => {
    if (text) {
      try {
        webLine.slash.commands[command](text);
      } catch (e) {
        webLine.out(`Sorry, ${command} is not a registered command`);
      }
    } else {
      if (webLine.slash.commands.hasOwnProperty(command)) {
        if (webLine.slash.commands[command].instant) {
          webLine.slash.commands[command]();
        } else {
          webLine.onChange(command);
          webLine.loc = command;
          if (webLine.slash.commands[command].locationOut) {
            webLine.out(`Location: ${command}`);
          }
        }
      } else {
        webLine.out(`Sorry, ${command} is not a registered command`);
      }
    }
  }
};

export default webLine;
