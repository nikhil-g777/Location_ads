function getLocation(cb) {
    var date = new Date();
    console.log("Got Request at "+date);
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position){
//        	 console.log("Latitude : "+position.coords.latitude+" , Longitude : "+position.coords.longitude);
//        	 console.log(position);
        	// x.html("Latitude"+position.coords.latitude+"<br>Longitude : "+position.coords.longitude);
    date = new Date();
    console.log("Completing request at "+date+"\n\n");
        	cb(position);
        });
    } else {
        // x.html = "Geolocation is not supported by this browser.";
        console.log("Unable to get the position");
    }
}


function addNewAd(record){

    $("#ads").prepend(' <div class="panel panel-default" id = "panel_'+record.timeId+'"> <div class="panel-header" bgcolor="green">'+
                        '<div id="heading_'+record.timeId+'">'+record.heading+'</div>'+              
                        '</div>'+

                        '<div class="panel-body">'+
                        '<div id="name_'+record.timeId+'">'+record.name+'</div>'+
                        '    <!--Image :   <input type="file" name="pic" accept="image/*"><br><br>-->'+
                        '<img class="img-responsive" src = "'+record.image+'" alt = "Advert Image" >'+
                        '</div>'+
                        '</div>'+
                
                    '</div>'
    );
}

