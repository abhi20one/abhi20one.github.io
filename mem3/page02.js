const firebaseConfig = {
    apiKey: "AIzaSyACMxdb_zpcrkA3UO02s7O3X7FI4_cRRdA",
    authDomain: "img-upload-45286.firebaseapp.com",
    projectId: "img-upload-45286",
    storageBucket: "img-upload-45286.appspot.com",
    messagingSenderId: "469648648126",
    appId: "1:469648648126:web:47515aade6b907c9d8fbef",
    measurementId: "G-JTMNS5GX4T"
};

firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();
const storageRef = storage.ref();

function get() {
    folderName = sessionStorage.getItem("folname");
}
get();

$(document).ready(function() {
    let originalWidth1 = $('.right-container').width(); 
    let originalWidth2 = $('.sec1').width(); 
    let isCollapsed = false; 
    $('.resizer').on('click', function() {
        if (isCollapsed) {       
            $('.sec1').animate({width: originalWidth2 + 'px'}, 300);
            $('.right-container').animate({width: originalWidth1 + 'px'}, 300);       
            isCollapsed = false;
        } else {
            let pageWidth = $(window).width();
            $('.sec1').animate({width: pageWidth + 'px'}, 300);
            originalWidth1 = $('.right-container').width(); 
            $('.right-container').animate({width: '20px'}, 300);          
            isCollapsed = true;
        }
    });
});

document.getElementById('hidebar').addEventListener('click', function() {
    const sec3 = document.querySelector('.sec3');
    sec3.classList.toggle('expanded');
});

function isMobileDevice() {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
}

if (isMobileDevice()) {
    document.body.classList.add('mobile');
}   else {
    document.body.classList.add('pc');
}

let currentImageRef = null;

function selectImage() {
    $('.inp').click();
}

function cancelSelection() {
    $('.inp').val('');
    $('.filedata').empty(); 
    $('.progress').css('display', 'none'); 
}

function getImageData(e) {
    const files = e.target.files;
    $('.filedata').empty(); 
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        $('.filedata').append('<div>' + file.name + '</div>');
    }
    $('.filedata').css('display', 'block');
}

function uploadImages() {
    const files = $('.inp')[0].files;
    if (files.length === 0) {
        alert('Please select one or more files to upload.');
        return;
    }
    let uploadedCount = 0;
    storageRef.child(folderName + '/').listAll().then(function(result) {
        let existingImagesCount = result.items.length;
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const serialNumber = existingImagesCount + i + 1; 
            const fileName = serialNumber + '_' + file.name;
            const uploadTask = storageRef.child(folderName + '/' + fileName).put(file);
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                    $('.progress').css('width', progress + '%').text(progress + '%');
                },
                (error) => {console.log(error);},
                () => {
                    $('.filedata').append('<div>Files uploaded</div>');
                    uploadedCount++;
                    if (uploadedCount === files.length) {
                        listAllImages();
                    }
                }
            );
        }
    });
}

function listAllImages() {
    hideImage();
    $('#imageGallery').empty();
    storageRef.child(folderName + '/').listAll().then(function(result) {
        let images = [];
        result.items.forEach(function(imageRef) {
            images.push(imageRef);
        });
        images.sort((a, b) => {
            let aNumber = parseInt(a.name.split('_')[0]);
            let bNumber = parseInt(b.name.split('_')[0]);
            return bNumber - aNumber;
        });
        defaultImage(images, 0);
        displayImage(images);
        navImage(images); 
    });
}

function displayImage(images) {
    let imageUrls = [];
    let imagesProcessed = 0;
    images.forEach((imageRef, index) => {
        imageRef.getDownloadURL().then(function(url) {
            let img = new Image();
            img.src = url;
            img.onload = function() {
                imageUrls[index] = { url, imageRef, index };
                imagesProcessed++;
                if (imagesProcessed === images.length) {
                    imageUrls.sort((a, b) => b.index - a.index);
                    appendImagesToGallery(imageUrls);
                }
            };

        });
    });
}

function appendImagesToGallery(imageUrls) {
    imageUrls.forEach(({ url, imageRef, index }) => {
        $('#imageGallery').prepend(`
            <div>
                <img src="${url}" alt="Image" onclick="openImage('${url}', '${imageRef.fullPath}', '${index}')">
            </div>
        `);
    });
}

function openImage(url, fullPath, index) {
    const modal = document.getElementById("myModal");
    const modalImg = document.getElementById("modalImg");
    modal.style.display = "block";
    modalImg.src = url;
    currentindex = index;
    currentImageRef = fullPath;
}

function defaultImage(images, index) {
    if (images.length == 0) {
        noImage();  
        return;
    }
    currentindex = index;
    if (index < 0){
        index = 0;
    }
    if (currentindex >= images.length){
        currentindex = index = images.length -1;            
    }
    let imageRef = images[index];
    imageRef.getDownloadURL().then(function(url){
        openImage(url, imageRef.fullPath, index);
    });    
}

function navImage(images) {     
    let startX = null;
    let endX = null;
    let swipeStartTime = null;
    const SWIPE_TIMEOUT = 1000; 
    const sec1Element = document.querySelector('.sec1');
    sec1Element.addEventListener('touchstart', (event) => {
        startX = event.touches[0].clientX;
        swipeStartTime = new Date().getTime();
    });
    sec1Element.addEventListener('touchmove', (event) => {
        endX = event.touches[0].clientX;
    });  
    document.addEventListener('keydown', (event) => {
        switch(event.key) {
            case 'ArrowLeft':
            defaultImage(images, --currentindex);
                break;
            case 'a':
            defaultImage(images, --currentindex);
                break;
            case 'A':
            defaultImage(images, --currentindex);
                break;
            case 'ArrowRight':
            defaultImage(images, ++currentindex);
                break;
            case 'd':
            defaultImage(images, ++currentindex);
                break;
            case 'D':
            defaultImage(images, ++currentindex);
                break;
            case 'Delete':
            deleteSelectedImage();
                break;
        }
    });
    sec1Element.addEventListener('touchend', () => {
        if (startX && endX) {
            let swipeDuration = new Date().getTime() - swipeStartTime;
            let diff = startX - endX;
            if (swipeDuration < SWIPE_TIMEOUT) {
                if (diff > 50) {
                    defaultImage(images, ++currentindex);
                } else if (diff < -50) {
                    defaultImage(images, --currentindex);
                }
            } else {
            }
            startX = null;
            endX = null;
            swipeStartTime = null;
        }
    });
}

function hideImage() {
    modalImg.src = 'https://upload.wikimedia.org/wikipedia/commons/4/48/BLANK_ICON.png';
}

function noImage() {
    modalImg.src = 'https://cdn.iconscout.com/icon/premium/png-512-thumb/empty-folder-1519007-1284948.png?f=webp&w=256';
}

function deleteSelectedImage() {
    if (!currentImageRef) {
        alert("No image selected to delete.");
        return;
    }
    if (!confirm("Are you sure you want to delete this image?")) return;
    storageRef.child(currentImageRef).delete().then(() => {
        console.error(currentImageRef);
        displaynextImage();
    });
}

function displaynextImage() {
    $('#imageGallery').empty();
    storageRef.child(folderName + '/').listAll().then(function(result){
        let images = [];
        result.items.forEach(function(imageRef){
            images.push(imageRef);
        });
        images.sort((a, b) => {
            let aNumber = parseInt(a.name.split('_')[0]);
            let bNumber = parseInt(b.name.split('_')[0]);
            return bNumber - aNumber;
        });    
        defaultImage(images, currentindex);
        displayImage(images, 0);
    });
}

 document.addEventListener('DOMContentLoaded', listAllImages);