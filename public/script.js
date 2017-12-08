if (($( window ).width())>500){
        
  SaladSpinner({
        userId: '2a4b8c3485da0a84a69879e16c36728670ff8ddb',
        users: [4236113344],
        sortBy: 'created_time',
        limit: '8',
        links: false,
        resolution: 'standard_resolution',
        template: "<div id='annieUp' class='card'><div id='maryJane' class='image'><a href='https://www.instagram.com/dermbydesign/'><img class='ui centered image' id='blackJack' src='<%= url %>'/></a></div><div id='longHorn' class='extra content'><p><i id='rodeo' class='small heart red icon'></i><%= likes.count %></p></div></div>",
        id: 'bitsalad'
        
}).show();

}






