$(document).ready(function(){

  console.log('script loaded');

// ********************************************************
  var apiKey = '16f9f60adf7e1ffb2ada9ddb1744383f';
// ********************************************************
 var temperature = "";
  function handleRequest(city) {
    console.log(city);
    if (city.code === "0000") {
      $("#weather").text("Invalid city name!");
    } else {
      $("#weather").text("The weather in " + city.name + " is " + city.main.temp + " degrees Farenheit");
    }
    temperature = city.main.temp;

 }

  function addAJAX(cityName){
    $.ajax({
      "type": "GET",
      "url": "http://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&APPID=" + apiKey,
      "dataType": "json"
    })
    .done(handleRequest)
  }


/////////////////////////////////////////////////


  // do this
  // change the data tables in the db
  // make clothes have a temperature property
  // if it is hot (like temp > 85) then the ajax funciton will only ask for hot clothes

  $("#submit_button").on("click", function(event){
    var cityName = $("input").val();
    event.preventDefault();
    addAJAX(cityName);
  });


//////////
  $("#clothe_button").on("click",function(event){
    event.preventDefault();
    var clothe = $("#clothes").val(); // more precise selector
    // make AJAX call to / + clother
    console.log(clothe);
      var tempClothe = {"clothes":clothe};
      if (clothe === "hot"){
        $.ajax({
          "type":"POST",
          "url":"/hot",
          "data": tempClothe,
          "dataType":"json",
          success: function(data){
            // debugger
            console.log(data);
            $("#wearClothes").empty()
            data.hot.forEach(function(item) {
             $("#wearClothes").append($('<img>').attr('src', item.image));
            })
          }
        })

      }else if(clothe === "cold"){
      $.ajax({
        "type":"POST",
        "url":"/cold",
        "data": tempClothe,
        "dataType":"json",
        success: function(data){
          console.log(data);
            $("#wearClothes").empty()
            data.cold.forEach(function(item){
              $("#wearClothes").append($('<img>').attr('src', item.image));
            })
        }
      });
      }else if(clothe === "rainy"){



      $.ajax({
        "type":"POST",
        "url":"/rainy",
        "data": tempClothe,
        "dataType":"json",
        success: function(data){
            console.log(data);
            $("#wearClothes").empty()
            data.rainy.forEach(function(item){
              $("#wearClothes").append($('<img>').attr('src', item.image));
            })
        }
      });
      }else{
        alert("Try putting hot, cold or rainy");
      };

    });// end of click function

// $("#delete").on("click",function(event){
//     event.preventDefault();
//      $.ajax({
//         "type":"GET",
//         "url":"/users",
//         "data": // what variable name,
//         "dataType":"json",
//         success: function(data){
//           console.log(data)

//         }
//       })
//    });
 $('#delete').on('click',function(e){
    e.preventDefault()
    console.log('This is working')
    id = $(this).attr('data-id')
    div = $(this).parent()
    $.ajax({
      "url":"http://localhost:3000/users/"+id,
      "method":"DELETE",
      "success":function(){
        //console.log(data)
        $('body').remove()
      }
    })
  })


});//end of function







