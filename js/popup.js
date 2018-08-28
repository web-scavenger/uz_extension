
$(function () {
    $('#from_input').keyup(function () {
        var from = $('#from_input').val();
        getTrainList(from);
        
    })

    getTrainList = function(where){
        $.ajax({
            type: 'GET',
            headers: {
                Accept: "application/json, text/javascript, */*; q=0.01",
                "Content-Type": "application/json"
            },
            url: 'https://booking.uz.gov.ua/ru/train_search/station/',

            data: {
                term: where
            },
            success: function (data) {
                $('#from_list').html('')
                data.forEach(element => {
                    var li = $('<li></li>').text(element.title);
                    $('#from_list').append(li);  
                });
            }
        });
    }

})
