(() => {
	//
	// GLOBAL VARS AND CONFIGS
	//
	var lastMessageOnChat = false;
	var ignoreLastMsg = {};
	var elementConfig = {
		"chats": [1, 0, 5, 2, 0, 3, 0, 0, 0],
		"chat_icons": [0, 0, 1, 1, 1, 0],
		"chat_title": [0, 0, 1, 0, 0, 0, 0],
		"chat_lastmsg": [0, 0, 1, 1, 0, 0],
		"chat_active": [0, 0],
		"selected_title": [1, 0, 5, 3, 0, 1, 1, 0, 0, 0, 0]
	};
	//var gameInstance = new Game();
  var gameInstances = {};
	

	//
	// FUNCTIONS
	//

	// Get random value between a range
	function rand(high, low = 0) {
		return Math.floor(Math.random() * (high - low + 1) + low);
	}
	
	function getElement(id, parent){
		if (!elementConfig[id]){
			return false;
		}
		var elem = !parent ? document.body : parent;
		var elementArr = elementConfig[id];
		elementArr.forEach(function(pos) {
			if (!elem.childNodes[pos]){
				return false;
			}
			elem = elem.childNodes[pos];
		});
		return elem;
	}
	
	function getLastMsg(){
		var messages = document.querySelectorAll('.msg');
		var pos = messages.length-1;
		
		while (messages[pos] && (messages[pos].classList.contains('msg-system'))){
			pos--;
			if (pos <= -1){
				return false;
			}
		}
		if (messages[pos] && messages[pos].querySelector('.selectable-text')){
			return messages[pos].querySelector('.selectable-text').innerText.trim();
		} else {
			return false;
		}
	}
	
	function getUnreadChats(){
		var unreadchats = [];
		var chats = getElement("chats");
		if (chats){
			chats = chats.childNodes;
			for (var i in chats){
				if (!(chats[i] instanceof Element)){
					continue;
				}
				var icons = getElement("chat_icons", chats[i]).childNodes;
				
				unreadchats.push(chats[i]);			
				continue;
				if (!icons){
					continue;
				}
				for (var j in icons){
					if (icons[j] instanceof Element){
						if (!(icons[j].childNodes[0].getAttribute('data-icon') == 'muted' || icons[j].childNodes[0].getAttribute('data-icon') == 'pinned')){
							unreadchats.push(chats[i]);
							break;
						}
					}
				}
			}
		}
		return unreadchats;
	}
	
	function didYouSendLastMsg(){
		var messages = document.querySelectorAll('.msg');
		if (messages.length <= 0){
			return false;
		}
		var pos = messages.length-1;
		
		while (messages[pos] && messages[pos].classList.contains('msg-system')){
			pos--;
			if (pos <= -1){
				return -1;
			}
		}
		if (messages[pos].querySelector('.message-out')){
			return true;
		}
		return false;
	}

	// Call the main function again
	const goAgain = (fn, sec) => {
		// const chat = document.querySelector('div.chat:not(.unread)')
		// selectChat(chat)
		setTimeout(fn, sec * 100) // 1000
	}

	// Dispath an event (of click, por instance)
	const eventFire = (el, etype) => {
		var evt = document.createEvent("MouseEvents");
		evt.initMouseEvent(etype, true, true, window,0, 0, 0, 0, 0, false, false, false, false, 0, null);
		el.dispatchEvent(evt);
	}

	// Select a chat to show the main box
	const selectChat = (chat, cb) => {
		const title = getElement("chat_title",chat).title;
		eventFire(chat.firstChild.firstChild, 'mousedown');
		if (!cb) return;
		const loopFewTimes = () => {
			setTimeout(() => {
				const titleMain = getElement("selected_title").title;
				if (titleMain !== undefined && titleMain != title){
					console.log('not yet');
					return loopFewTimes();
				}
				return cb();
			}, 100); //300
		}

		loopFewTimes();
	}

	// Send a message
	const sendMessage = (chat, message, cb) => {
		//avoid duplicate sending
		var title;

		if (chat){
			title = getElement("chat_title",chat).title;
		} else {
			title = getElement("selected_title").title;
		}
		ignoreLastMsg[title] = message;
		
		messageBox = document.querySelectorAll("[contenteditable='true']")[0];

		//add text into input field
		messageBox.innerHTML = message.replace(/  /gm,'');

		//Force refresh
		event = document.createEvent("UIEvents");
		event.initUIEvent("input", true, true, window, 1);
		messageBox.dispatchEvent(event);

		//Click at Send Button
		eventFire(document.querySelector('span[data-icon="send"]'), 'click');

		cb();
	}

	//
	// MAIN LOGIC
	//
	const start = (_chats, cnt = 0) => {
		// get next unread chat
		const chats = _chats || getUnreadChats();
		const chat = chats[cnt];
		
		var processLastMsgOnChat = false;
		var lastMsg;
		
		if (!lastMessageOnChat){
			if (false === (lastMessageOnChat = getLastMsg())){
				lastMessageOnChat = true; //to prevent the first "if" to go true everytime
			} else {
				lastMsg = lastMessageOnChat;
			}
		} else if (lastMessageOnChat != getLastMsg() && getLastMsg() !== false && !didYouSendLastMsg()){
			lastMessageOnChat = lastMsg = getLastMsg();
			processLastMsgOnChat = true;
		}
		
		if (!processLastMsgOnChat && (chats.length == 0 || !chat)) {
			//console.log(new Date(), 'nothing to do now... (1)', chats.length, chat);
			return goAgain(start, 3);
		}

		// get infos
		var title;
		if (!processLastMsgOnChat){
			title = getElement("chat_title",chat).title + '';
			lastMsg = (getElement("chat_lastmsg", chat) || { innerText: '' }).innerText.trim(); //.last-msg returns null when some user is typing a message to me
		} else {
			title = getElement("selected_title").title;
		}
		// avoid sending duplicate messaegs
		if (ignoreLastMsg[title] && (ignoreLastMsg[title]) == lastMsg) {
			//console.log(new Date(), 'nothing to do now... (2)', title, lastMsg);
			return goAgain(() => { start(chats, cnt + 1) }, 0.1);
		}

		// what to answer back?
		let sendText, maxCmdLength = 12;
    
    if(lastMsg.length < maxCmdLength && (lastMsg[0]=="@" || lastMsg.length==5)) {
      // Its a command
      
      if (lastMsg.toUpperCase().indexOf('@HELP') > -1){
        sendText = msg_help;
      }

      if (lastMsg.toUpperCase().indexOf('@RULES') > -1){
        sendText = msg_rules;
      }

      if (lastMsg.toUpperCase().indexOf('@MATE') > -1) {
        if(gameInstances[title]) {
          gameInstances[title].resign();
          sendText = `Game finished. Winner ${gameInstances[title].lastMove}
          Score: ${gameInstances[title].getScore()}`;
        }
        
      }

      if (lastMsg.toUpperCase().indexOf('@NEW') > -1){
          console.log("CMD: @new");
          if(!gameInstances[title]) {
            console.log("CMD: New opponent ", title);
            gameInstances[title] = new Game();
          };
          gameInstances[title].newGame();
          sendText = gameInstances[title].printBoard();		
      }

      if (lastMsg.toUpperCase().indexOf('@HERO') > -1){
        if(gameInstances[title]) {
          let cmd = lastMsg.split(" ");
          if(cmd.length == 1) {
            sendText = "*Lista de Heróis*" + "```" + `
            ${gameInstances[title].getHeroes()} `+ "```" +`
            
            *@config hero 1 23*`; 

          } else if (cmd.length == 2) {          
            gameInstances[title].setRandomHero(cmd[1]);
            sendText = gameInstances[title].printBoard();
          } else if (cmd.length == 3){
            gameInstances[title].setHero(cmd[1], cmd[2]);
            sendText = gameInstances[title].printBoard();
          } else {
            sendText = "*Parametros incorretos.*"
          }
        } 
      }

      if (lastMsg.length == 5) { // check if is command  
        if(lastMsg.split(" ").length==2 && lastMsg.split(" ")[0].length==2 && lastMsg.split(" ")[1].length==2) {
          console.log("CMD ->" + lastMsg);            
          if(gameInstances[title] && gameInstances[title].moveCmd(lastMsg)) {
            sendText = gameInstances[title].printBoard();    
          }			
        }
      }
    
    } // commands
		
		// that's sad, there's not to send back...
		if (!sendText) {
			ignoreLastMsg[title] = lastMsg;
			//console.log(new Date(), 'new message ignored -> ', title, lastMsg);
			return goAgain(() => { start(chats, cnt + 1) }, 0.1);
		}

		console.log(new Date(), 'new message to process, uhull -> ', title, lastMsg);

		// select chat and send message
		if (!processLastMsgOnChat){
			selectChat(chat, () => {
				sendMessage(chat, sendText.trim(), () => {
					goAgain(() => { start(chats, cnt + 1) }, 0.1);
				});
			})
		} else {
			sendMessage(null, sendText.trim(), () => {
				goAgain(() => { start(chats, cnt + 1) }, 0.1);
			});
		}
	}
	start();


var msg_help =
  `
▬▬▬▬▬ஜ۩۞۩ஜ▬▬▬▬▬▬
                 *KINGS*
▬▬▬▬▬ஜ۩۞۩ஜ▬▬▬▬▬▬
Comandos:
 *@new*
 *@rules*
 *@config* [hero <player> <char>]
 *@mate*
`

var msg_rules = `╔═════════╗
    *Como Jogar?*
╚═════════╝
*(\\__/) ||*
*(•ㅅ•) ||*
*/ 　 づ*

*@new* - Cria novo jogo.
*@mate* - Fim de jogo, aitória do jogador que fez o último lance.

*Regras:*
─────────────────
*Kings* é um jogo simples. Todas as peças podem se mover na *vertical, horizontal ou diagonal*, mas sempre até o *limite* possivel.
As peças sempre param o movimento ou quando alcançam a *borda* do tabuleiro, ou logo antes de *outra peça* na mesma coluna, linha ou diagonal.

O jogo é jogado num tabuleiro 5x5, cada jogador começa com 5 peças em lados opostos do tabuleiro. 
O *objetivo* é se tornar o *Rei*, ocupando o quadrado central *C3* ▪ com o seu *Herói*, representado pela peça diferenciada. 
Peças: 🔹 ⭕ ⚫ etc.
Heróis: ♿ 📛 🐧 etc.

─────────────────
Uma *peça* é representada pelas suas *coordenadas* no formato: 
_letra da coluna número da linha_ Ex.: *a1*
Para movimentar as peças use as coordenadas do movimento no formato:
_origem destino_ Ex.: *a1 e4*

No caso abaixo, o *Herói* 📛 se encontra na posição *c5*. 
Os movimentos possíveis para essa peça são: *a3 c2 d4* (marcados com ✖).

┌────────────┐
5 ⭕⭕📛⭕▫
4 ▫▫▫✖▫
3 ✖▫▪▫⭕
2 ▫▫✖▫🔹
1 🔹🔹♿▫🔹
      a    b    c  d  e 
└────────────┘

Peças normais podem *atravessar* o quadrado central, mas *não* podem parar nele.
Se o *Herói* de algum jogador for *bloqueado* e não possuir movimentos válidos, o jogador *perde* a partida.

` 
})()