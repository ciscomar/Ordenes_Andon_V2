
// A $( document ).ready() block.
$( document ).ready(function() {
      
          $('#myTable').dataTable( {
            "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]]
          } );

// Ocultar boton de atenter si ya esta atendida
          if($('#status_cerrar2').text()=='Atendida'){
          $('#atender').hide()
          }

});

$("#menu-toggle").click(function (e) {
  e.preventDefault();
  $("#wrapper").toggleClass("toggled");
});



