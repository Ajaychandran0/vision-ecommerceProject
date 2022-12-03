// order management
$(document).ready(function () {
    $('#example').DataTable();
});

// block user
async function blockUser(userId) {

    let sure = await sweetAlert({
        title: "Are you sure?",
        text: "The user will be blocked",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
    if (sure == null) return

    $.ajax({
        url: '/admin/block-user/' + userId,
        method: 'patch',
        success: (response) => {
            console.log(response)
            if (response) {
                location.reload()
                // $("#user-block-unblock"+userId).load(" #user-block-unblock"+userId)
            }
        }
    });
}



// unblock user
async function unblockUser(userId) {

    let sure = await sweetAlert({
        title: "Are you sure?",
        text: "The user will be unblocked",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
    if (sure == null) return

    $.ajax({
        url: '/admin/unblock-user/' + userId,
        method: 'patch',
        success: (response) => {
            console.log(response)
            if (response) {
                location.reload()
                // $("#user-block-unblock"+userId).load(" #user-block-unblock"+userId)
            }
        }
    });
}

// delete Category

async function deleteCategory(categoryId) {

    let sure = await sweetAlert({
        title: "Are you sure?",
        text: "The category will be deleted",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
    if (sure == null) return

    $.ajax({
        url: '/admin/delete-category/' + categoryId,
        method: 'delete',
        success: (response) => {
            console.log(response)
            if (response) {
                location.reload()
                // $("#user-block-unblock"+userId).load(" #user-block-unblock"+userId)
            }
        }
    });
}


// change order Status

function changeOrderStatus(proId, orderId) {

    let itemStatus = document.getElementById('option' + proId + orderId).value
    console.log(itemStatus)

    $.ajax({

        url: "/admin/change-order-status",
        data: {
            proId: proId,
            status: itemStatus,
            orderId: orderId
        },
        method: 'patch',
        success: (response) => {

            if (response) {
                document.getElementById('orderStatus' + proId + orderId).innerHTML = itemStatus
            }

        }
    });
}