document.addEventListener("DOMContentLoaded", function(event) {

  	document.getElementById("ajouter_role").addEventListener("click", function(event){
		event.preventDefault();
    	var select = document.getElementById("select_role")
    	var selection = select.options[select.selectedIndex].value;
    	console.log(selection);
    	var html = document.createElement('div');
    	html.className = "form-group";
    	html.innerHTML = '<label>'+selection+'</label><input type="number" class="form-control role_number" name="nb_'+selection+'">';
    	document.getElementById('role').appendChild(html);
    	select.remove(select.selectedIndex);
  	});

  	$('#form_creation').submit(function(event){
    	var nb_joueur = parseInt($('#nb_villageois')[0].value)+parseInt($('#nb_lg')[0].value);
   		var nb_joueur_max = parseInt($("#nb_joueurs").text());
    	$('.role_number').each(function(index, element){
      		nb_joueur += parseInt(element.value);
    	});
    	console.log(nb_joueur);
    	if($("#game_password")[0].value == null){
      		event.preventDefault();
      		$('#error_message').show();
      		$('#error_message').text('Veuillez renseigner un mot de passe');
    	} else if(parseInt($('#nb_lg')[0].value) <= 0){
      		event.preventDefault();
      		$('#error_message').show();
      		$('#error_message').text('Il faut au moins un loup garou.');
    	} else if(nb_joueur != nb_joueur_max){
      		event.preventDefault();
      		$('#error_message').show();
      		$('#error_message').text('Le nombre de joueur donné n\'est pas égale au nombre de joueurs défini précédement');
    	}
  	});
});