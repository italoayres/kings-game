## KINGS
#### An easy board game with a whatsapp chatbot integration.

This is an fork of the bot.js project, avaiable at: https://github.com/bruno222/whatsapp-web-bot/blob/master/bot.js

### How to use it?

1. Open `chrome`, then visit `web.whatsapp.com`
2. Press `F12`, click at `console`
3. Copy all the `bot.js` code  and paste into console.

4. Installed!

5. Now ask for your friend to send you this message: `@HELP`

### Commands:
 @new
 @rules
 @hero [<player> <hero>]
 @config [hero <player> <char>]
 @mate

### Rules:

**@new** - Cria novo jogo.
**@mate** - Fim de jogo, aitória do jogador que fez o último lance.

**Kings** é um jogo simples. Todas as peças podem se mover na **vertical, horizontal ou diagonal**, mas sempre até o limite possivel.
As peças sempre param o movimento ou quando alcançam a **borda** do tabuleiro, ou logo antes de **outra peça** na mesma coluna, linha ou diagonal.

O jogo é jogado num tabuleiro 5x5, cada jogador começa com 5 peças em lados opostos do tabuleiro. 
O *objetivo* é se tornar o **Rei**, ocupando o quadrado cen*tr*al **C3** ▪ com o seu **Herói**, representado pela peça diferenciada. 
Peças: 🔹 ⭕ ⚫ etc.
Heróis: ♿ 📛 🐧 etc.

─────────────────
Uma *peça* é representada pelas suas *coordenadas* no formato: 
_letra da coluna número da linha_ Ex.: *a1*
Para movimentar as peças use as coordenadas do movimento no formato:
_origem destino_ Ex.: *a1 e4*

No caso abaixo, o *Herói* 📛 se encontra na posição *c5*. 
Os movimentos possíveis para essa peça são: *a3 c2 d4* (marcados com ✖).

| |a| b | c | d | e
:---: | :---: | :---: | :---: | :---: | :---:
5 |⭕|⭕|📛|⭕||
4 ||||✖||
3 |✖||◼||⭕|
2 |||✖||🔹
1 |🔹|🔹|♿||🔹

Peças normais podem *atravessar* o quadrado central, mas *não* podem parar nele.
Se o *Herói* de algum jogador for *bloqueado* e não possuir movimentos válidos, o jogador *perde* a partida.
