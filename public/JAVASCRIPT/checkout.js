// checkout 

$('#checkout-form').submit((e) => {

    e.preventDefault()

    $.ajax({
        url: "/place-order",
        method: 'post',
        data: $('#checkout-form').serialize(),
        success: (response) => {

            if (response.orderPlaced) {
                location.href = '/order-complete'
            } else {
                sweetAlert({
                    text: 'only COD available',
                    icon: 'warning'
                })
            }

        }
    });
})