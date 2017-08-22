document.addEventListener("DOMContentLoaded", function(event) {
    var time = new Date().getHours();
    var gameId = document.getElementById("gameId").innerHTML;
    var zoneAction = document.getElementById("action");
    var joueurs_en_vie = [];
    for (var i = 0; i < document.getElementsByClassName("joueur_en_vie").length; i++) {
            joueurs_en_vie[i]=document.getElementsByClassName("joueur_en_vie")[i].innerHTML;
    }
    console.log(time);
    /*
    ** Creation interface
    */

    /*
    ** ALL
    */
    if(time>=9 && time<=17){
        console.log("Vote de pendaison");
        var tempHTML = '<h2>Vote</h2></h3>Il est l\'heure de voter pour éliminer un joueur</h3>';
        tempHTML += '<p>Vote actuel : </p>';
        tempHTML += zoneAction.innerHTML;
        tempHTML += '<form action="vote/v" method="post">';
        tempHTML += '<select name="vote">';
        for(var i = 0;i<joueurs_en_vie.length;i++){
            tempHTML += '<option value="'+joueurs_en_vie[i]+'">'+joueurs_en_vie[i]+'</option>';
        }
        tempHTML += '<input type="hidden" name="game_id" value="'+gameId+'">';
        tempHTML += '</select><input type="submit" value="Voter"/></form>';
        zoneAction.innerHTML = tempHTML;
        
    } 
    



});