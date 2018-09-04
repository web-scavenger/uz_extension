
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
        getLocationsList(to, '#to_list', 'to__select');

    })

    $('#calendar').change(function () {
        opt.date = this.value;
    })

    $('#check_trains').click(function () {
        if (opt.fromValue == null || opt.toValue == null || opt.date == null) {
            alert('Введите все данные')
        } else {
            getTrainsList();
        }
    })

    $(document).on("click", ".from__select", function (e) {
        e.preventDefault();
        opt.fromValue = this.getAttribute('data-train');
        $('#from_input').val(this.getAttribute('data-location'))
        $('#from_list').html('')
    });

    $(document).on("click", ".to__select", function (e) {
        e.preventDefault();
        opt.toValue = this.getAttribute('data-train');
        $('#to_input').val(this.getAttribute('data-location'))
        $('#to_list').html('')
    });


    getLocationsList = function (where, outputBlock, liClass) {
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
                    var li = $('<li class="' + liClass + '"></li>').text(element.title);
                    li.attr('data-location', element.title);
                    li.attr('data-train', element.value);
                    $(outputBlock).append(li);

                });
            }
        });
    }

    getTrainsList = function () {
        $.ajax({
            type: 'POST',

            url: 'https://booking.uz.gov.ua/ru/train_search/',

            data: {
                from: opt.fromValue,
                to: opt.toValue,
                date: opt.date,
                time: opt.time
            },
            success: function (data) {
                filterTrains(data);
                // console.log(data)
            }
        });
    }

    filterTrains = function (trainsArr) {

        trainsArr.data.list.forEach(function (element) {
            if (element.types.length > 0) {
                pushTrainsToEx(element)
            }
        })
        initTrainsList()

    }

    pushTrainsToEx = function (trainObj) {
        console.log(trainObj)
        var content = '';
        trainObj.types.forEach(function (element) {
            //&wagon_num=33&url=train-wagons
            content = '<div class="trains__list" data-trainNum=' + trainObj.num +
                ' data-trainid=' + element.id + '> \
            <p>'+ element.title + ': <span> ' + element.places + ' </a><span></p>\
        </div>'

        })
        $('.js_trainsList--container').append(content)

    }

    initTrainsList = function () {
        console.log('was inited')
        $('.trains__list').on('click', function () {
            openThisTrain($(this).attr('data-trainNum'), $(this).attr('data-trainId'))
        })
    }

    openThisTrain = function (trainNum, trainId) {
        $.ajax({
            type: 'POST',

            url: 'https://booking.uz.gov.ua/ru/train_wagons/',

            data: {
                from: opt.fromValue,
                to: opt.toValue,
                date: opt.date,
                train: trainNum,
                wagon_type_id: trainId
            },
            success: function (data) {

                console.log(data.data.wagons[0].num)
                redirectToUrl(data.data.wagons[0].num, trainNum, trainId)
            }
        });
    }

    redirectToUrl = function (wagons, trainNum, trainId) {

        
        chrome.tabs.create({
            url: "https://booking.uz.gov.ua/ru/?from=" + opt.fromValue +
                "&to=" + opt.toValue +
                "&date=" + opt.date +
                "&time=" + opt.time +
                "&train=" + trainNum +
                "&wagon_type_id=" + trainId +
                "&wagon_num=" + wagons +
                "&url=train-wagons"
        });

    }

})
