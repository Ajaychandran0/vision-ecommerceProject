
// image zoom
var options = {

    fillContainer: true,
    offset: { vertical: 10, horizontal: 0 },
    scale: 1,
}

new ImageZoom(document.getElementById('image-container'), options)


// category list on mouse hover
let category = document.getElementById('category')
let categoryList = document.getElementById('categories-list')

function show() {
    categoryList.classList.remove("hidden")
}

function hide() {
    categoryList.classList.add("hidden")
}

category.addEventListener('mouseover', show)
category.addEventListener('mouseout', hide)
categoryList.addEventListener('mouseover', show)
categoryList.addEventListener('mouseout', hide)



// change product image before submitting changes in admin side in edit-product page
function viewImage(event) {
    document.getElementById('imgView').src = URL.createObjectURL(event.target.files[0])
}






