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

function renderSections() {
    storageRef.listAll().then(folderRefs => {
        const folderNames = folderRefs.prefixes.map(folderRef => folderRef.name);
        $('section.dynamic').remove();
        folderNames.forEach(name => {
            const section = $('<section>').addClass('dynamic');
            section.html(`
                <div class="tab">
                    <div class="opt">
                        <div class="dotgrp">
                            <div class="dot"></div>
                            <div class="dot"></div>
                            <div class="dot"></div>
                        </div>
                    </div>
                    <p>${name}</p>
                    <div class="menu">
                        <button class="b2">Delete</button>
                    </div>
                    <div class="frame"></div>
                </div>`);
            section.find('.frame').on('click', function() {
                folderName = name;
                store(); 
                window.location.href = 'page02.html';
            });
            section.find('.opt').on('click', function(event) {
                event.stopPropagation(); 
                const menu = $(this).siblings('.menu');
                menu.toggleClass('visible');
            });
            section.find('.b2').on('click', function(event) {
                event.stopPropagation(); 
                if (confirm(`Are you sure you want to delete the folder "${name}"?`)) {
                    deleteFolder(name);
                }
            });
            displayLastImage(name, section.find('.frame'));
            const addSection = $('.add');
            section.insertBefore(addSection);
        });
    });
}

function deleteFolder(folderName) {
    const folderRef = storageRef.child(folderName + '/');
    folderRef.listAll().then(result => {
        const deletePromises = result.items.map(itemRef => itemRef.delete());
        const deleteFolderPromises = result.prefixes.map(subFolderRef => deleteFolder(subFolderRef.fullPath));
        return Promise.all([...deletePromises, ...deleteFolderPromises]);
    }).then(() => {
        renderSections();
        return folderRef.delete();
    }).then(() => {
        alert('Folder deleted successfully.');
    });
}

function store() {
    var folname = folderName;
    sessionStorage.setItem("folname", folname);
    location.href = "page02.js";
}

function addSection() {
    const newFolderName = prompt("Enter a name for the new folder:");
    if (newFolderName) {
        const parentFolderRef = storageRef.child(newFolderName + '/');
        parentFolderRef.listAll().then(result => {
            if (result.prefixes.length > 0) {
                alert("Folder already exists.");
            } else {
                const subFolderName = "sub";
                const subFolderRef = parentFolderRef.child(subFolderName + '/');
                subFolderRef.child('.empty').putString('').then(() => {
                    renderSections();
                });
            }
        });
    } else {
        alert("Folder name cannot be empty.");
    }
}

function displayLastImage(folderName, frame) {
    const folderRef = storageRef.child(folderName + '/');
    folderRef.listAll().then(result => {
        const items = result.items;
        if (items.length > 0) {
            const serialNumbers = items.map(item => extractSerialNumber(item.name));
            const maxSerial = Math.max(...serialNumbers);
            const lastItemRef = items.find(item => extractSerialNumber(item.name) === maxSerial);
            return lastItemRef.getDownloadURL().then(url => {
                frame.css({
                    'background-image': `url('${url}')`,
                    'background-size': 'cover',
                    'background-position': 'center'
                });
            });
        }
    });
}

function extractSerialNumber(filename) {
    const match = filename.match(/(\d+)/);
    return match ? parseInt(match[0], 10) : 0;
}

document.addEventListener('DOMContentLoaded', renderSections);