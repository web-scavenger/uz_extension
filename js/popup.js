
$(function () {
    var opt = {
        fromValue: null,
        toValue: null,
        date: null,
        time: '00:00'
    }

    $('#from_input').keyup(function () {
        var from = $('#from_input').val();
        getLocationsList(from, '#from_list', 'from__select');
        
    })
    $('#to_input').keyup(function () {
        var to = $('#to_input').val();
        getLocationsList(to, '#to_list', 'to__select' );
        
    })

    $('#calendar').change(function(){
        opt.date = this.value;
    })

    $('#check_trains').click(function(){
        if(opt.fromValue == null || opt.toValue == null || opt.date == null){
            alert('Введите все данные')
        } else {
            getTrainsList();
        }
    })

    $(document).on("click", ".from__select", function(e) {
        e.preventDefault();
        opt.fromValue = this.getAttribute('data-train');
        $('#from_input').val(this.getAttribute('data-location'))
        $('#from_list').html('') 
    });

    $(document).on("click", ".to__select", function(e) {
        e.preventDefault();
        opt.toValue = this.getAttribute('data-train');
        $('#to_input').val(this.getAttribute('data-location'))
        $('#to_list').html('')
    });


    getLocationsList = function(where, outputBlock, liClass){
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
                $(outputBlock).html('')
                data.forEach(element => {
                    var li = $('<li class="'+ liClass +'"></li>').text(element.title);
                    li.attr('data-location', element.title);
                    li.attr('data-train', element.value);
                    $(outputBlock).append(li);  
                   
                });
            }
        });
    }

    getTrainsList = function(){
        $.ajax({
            type: 'POST',
            
            url: 'https://booking.uz.gov.ua/ru/train_search/',

            data: {
                from : opt.fromValue,
                to : opt.toValue,
                date : opt.date,
                time : opt.time 
            },
            success: function (data) {
                console.log(data)
            }
        });
    }

})
