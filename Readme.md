## Plan

### Important Note

1. When array myarr is initialised with new Arra.fill(), the upon myarr[0][0] = 1; will put 1 in whole of the first column

for each click (interaction) => Controller will handle it
will call a function that will change the state of board (or game)
=> This will call a model function It will implement the changes in the state.  
=> Then controller will call render function that will render the UI.

1. First stage : Implement the functionality without bot.
   Model: a) Board [[]] b) playerTurn c) Scores [] d) Modal: {}
   isValidMove(); => This function takes id and returns the array of indices of the positions that will be flipped if player chooses to move to the 'id' position.
   View : It will render all data regardless of which state was changed
   Controller: handleClick() => it will run each time when a player clicks grid item to play its move.

   Start: set turn to 0; initialize board, scores [0,0]
   Click => Controller check the turn and then will call the model function
   => It checks if the move is valid.
