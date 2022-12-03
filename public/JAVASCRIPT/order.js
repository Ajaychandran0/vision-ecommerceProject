async function cancelOrderItem(orderId, proId) {

    let sure = await sweetAlert({
        title: "Are you sure?",
        text: "The item will be cancelled from your order",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
    if (sure == null) return

    $.ajax({

        url: "/cancel-order",
        data: {
            orderId: orderId,
            proId: proId
        },
        method: "delete",
        success: (response) => {

            if (response) {
                document.getElementById('user-order-status' + orderId + proId).innerHTML = '<p class="mx-4 mt-3 font-weight-bold" style="color: red;font-size: 16px;">cancelled</p>'
                let total = Number(document.getElementById('total' + orderId + proId).innerHTML)
                console.log(total)
                document.getElementById('total' + orderId).innerHTML -= total

            }
        }
    });
}