
    
// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyACMxdb_zpcrkA3UO02s7O3X7FI4_cRRdA",
    authDomain: "img-upload-45286.firebaseapp.com",
    projectId: "img-upload-45286",
    storageBucket: "img-upload-45286.appspot.com",
    messagingSenderId: "469648648126",
    appId: "1:469648648126:web:47515aade6b907c9d8fbef",
    measurementId: "G-JTMNS5GX4T"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();
const storageRef = storage.ref();


function renderSections() {
    storageRef.listAll().then(folderRefs => {
        const folderNames = folderRefs.prefixes.map(folderRef => folderRef.name);

        // Remove existing dynamic sections
        document.querySelectorAll('section.dynamic').forEach(section => section.remove());

        folderNames.forEach(name => {
            const section = document.createElement('section');
            section.classList.add('dynamic');
            section.innerHTML = `
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
            </div>`;

            // Handle click event on the "frame" button
            section.querySelector('.frame').addEventListener('click', function() { 
                folderName = name;
                store(); // If needed
                window.location.href = 'page02.html';
            });


            section.querySelector('.opt').addEventListener('click', function(event) {
                event.stopPropagation(); // Prevent triggering the section click event
                
                const menu = section.querySelector('.menu');
                menu.classList.toggle('visible'); // Toggle visibility
            });

            // Handle click event on the "Delete" button
            section.querySelector('.b2').addEventListener('click', function(event) {
                event.stopPropagation(); // Prevent triggering the section click event

                if (confirm(`Are you sure you want to delete the folder "${name}"?`)) {
                    deleteFolder(name);
                }
            });

            displayLastImage(name, section.querySelector('.frame'));

            const addSection = document.querySelector('.add');
            document.body.insertBefore(section, addSection);
        });

    }).catch(error => {
        console.error('Error fetching folders from Firebase:', error);
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
         // Refresh the section list
    }).catch(error => {
        console.error('Error deleting folder in Firebase:', error);
    });
}

//console.log("passed 01");

function store() {
    var folname = folderName;

    sessionStorage.setItem("folname", folname);
    location.href = "page02.js";

    //console.log(folname);
}

//console.log("passed 02");

function addSection() {
    const newFolderName = prompt("Enter a name for the new section:");

    if (newFolderName) {
        // Reference to the parent folder
        const parentFolderRef = storageRef.child(newFolderName + '/');
        
        // Creating a subfolder
        const subFolderName = "sub";
        if (subFolderName) {
            const subFolderRef = parentFolderRef.child(subFolderName + '/');
            
            // Create an empty file to simulate a folder
            subFolderRef.child('.empty').putString('')
                .then(() => {
                    console.log('Subfolder created successfully.');
                    renderSections(); // Refresh the section list
                })
                .catch(error => {
                    console.error('Error creating subfolder in Firebase:', error);
                });
        } else {
            alert("Subfolder name cannot be empty.");
        }
    } else {
        alert("Folder name cannot be empty.");
    }
}







// Function to display the first image in a folder
// Function to display the last image in a folder
function displayLastImage(folderName, plusElement) {
    const folderRef = storageRef.child(folderName + '/');

    folderRef.listAll().then(result => {
        // Filter and sort items based on the highest serial number
        const items = result.items;

        if (items.length > 0) {
            // Sort items based on the serial number in the filename
            items.sort((a, b) => {
                const aNumber = extractSerialNumber(a.name);
                const bNumber = extractSerialNumber(b.name);
                return bNumber - aNumber;
            });

            // Use the last item in the sorted list
            const lastItemRef = items[0];
            return lastItemRef.getDownloadURL().then(url => {
                // Set the background image or use an <img> tag to display the image
                plusElement.style.backgroundImage = `url('${url}')`;
                plusElement.style.backgroundSize = 'cover';
                plusElement.style.backgroundPosition = 'center';
            });
        }
    }).catch(error => {
        console.error('Error fetching image from folder:', error);
    });
}

// Helper function to extract serial number from filename
function extractSerialNumber(filename) {
    // Example extraction logic assuming filenames are like "image001.jpg", "image002.jpg", etc.
    const match = filename.match(/(\d+)/);
    return match ? parseInt(match[0], 10) : 0;
}














document.addEventListener('DOMContentLoaded', renderSections);