function handleHomeClick(){
    window.location.href = "../../index.html";
    sessionStorage.clear("isAdmin");
}

async function handleViewClick() {
    try {
        // Call IPC to retrieve the directory structure
        const result = await window.api.invoke('view-files');
        console.log("API result:", result);

        // Check if the result was successful and the data is in the expected format
        if (result.success && Array.isArray(result.data)) {
            // Display the directory structure in a modal
            displayModal(buildDirectoryTreeHtml(result.data));
        } else {
            console.error('Failed to retrieve files:', result.message || 'result object is missing expected properties or is not an array');
            alert('Failed to retrieve files: ' + result.message);
        }
    } catch (error) {
        console.error('Error retrieving files:', error);
        alert('An error occurred while trying to retrieve files.');
    }
}


function displayModal(htmlContent) {
    const modal = document.getElementById('viewFilesmodal');
    const fileContentsElement = document.getElementById('directoryTree');
    const span = modal.querySelector('.close');

    fileContentsElement.innerHTML = htmlContent;
    setupEventListeners();  // Setup event listeners after updating the HTML

    modal.style.display = "flex";
    modal.querySelector('.viewFilesmodal-content').classList.add('active');

    span.onclick = function() {
        modal.querySelector('.viewFilesmodal-content').classList.remove('active');
        setTimeout(() => {
            modal.style.display = "none";
        }, 300);
    };

    window.onclick = function(event) {
        if (event.target === modal) {
            modal.querySelector('.viewFilesmodal-content').classList.remove('active');
            setTimeout(() => {
                modal.style.display = "none";
            }, 300);
        }
    };
}



function buildDirectoryTreeHtml(data) {
    if (!Array.isArray(data)) {
        console.error('Expected data to be an array, received:', data);
        return '<p>Error: Data is not an array.</p>';
    }
    let html = '<ul class="directory-list">'; // Ensure your root element has a class for potential styling or scripting
    data.forEach(folder => {
        html += `<li>
                    <span class="folder-name" onclick="toggleItemOptions(event)">${folder.folder}</span>
                    <div class="item-options hidden"> <!-- Ensure this is initially hidden -->
                        <ul>
                            <li onclick="openItem('${folder.path.replace(/\\/g, '\\\\')}')">Open</li>
                            <li onclick="deleteItem('${folder.path.replace(/\\/g, '\\\\')}')">Delete</li>
                            <li onclick="renameItem('${folder.path.replace(/\\/g, '\\\\')}', '${folder.folder}')">Rename</li>
                        </ul>
                    </div>
                    <ul>`;
        folder.files.forEach(file => {
            const fullPath = `${folder.path}\\${file}`;
            html += `<li>
                        <span class="file-name" onclick="toggleItemOptions(event)">${file}</span>
                        <div class="item-options hidden">
                            <ul>
                                <li onclick="openItem('${fullPath.replace(/\\/g, '\\\\')}')">Open</li>
                                <li onclick="deleteItem('${fullPath.replace(/\\/g, '\\\\')}')">Delete</li>
                                <li onclick="renameItem('${fullPath.replace(/\\/g, '\\\\')}', '${file}')">Rename</li>
                            </ul>
                        </div>
                     </li>`;
        });
        html += '</ul></li>';
    });
    html += '</ul>';
    return html;
}


function toggleItemOptions(event) {
    event.stopPropagation(); // Prevent the event from bubbling up

    // Find the .item-options div related to the clicked name
    const itemOptions = event.currentTarget.nextElementSibling;

    // Hide all other .item-options to ensure only one set is visible at a time
    document.querySelectorAll('.item-options').forEach(option => {
        if (option !== itemOptions) {
            option.classList.add('hidden');
        }
    });

    // Toggle visibility of the clicked item's options
    itemOptions.classList.toggle('hidden');
}



// Attach this function to load dynamically with your content
function setupEventListeners() {
    // This function should be called right after updating the DOM with new HTML content
    document.querySelectorAll('.folder-name, .file-name').forEach(element => {
        element.removeEventListener('click', toggleItemOptions); // Remove existing listeners to avoid duplicates
        element.addEventListener('click', toggleItemOptions); // Add listener
    });
}




async function openItem(path) {
    try {
        console.log("Trying to open:", path);
        await window.api.invoke('open-item', `"${path}"`);  // Ensure path is quoted if necessary
    } catch (error) {
        console.error('Error opening item:', error);
        alert('Failed to open the item.');
    }
}

async function deleteItem(path) {
    try {
        console.log("Trying to delete:", path);
        const deleted = await window.api.invoke('delete-item', path);  // Ensure path is quoted if necessary
        console.log(deleted ? 'File was deleted' : 'File deletion canceled');
        return deleted;
    } catch (error) {
        console.error('Error deleting item:', error);
        alert('Failed to delete the item.');
    }
}

async function renameItem(path, newName) {
    try {
        console.log("Trying to rename:", path, "to", newName);
        const newPath = await window.api.invoke('rename-item', { oldPath: `"${path}"`, newName });  // Ensure path is quoted if necessary
        console.log(`File renamed to ${newPath}`);
        return newPath;
    } catch (error) {
        console.error('Error renaming item:', error);
        alert('Failed to rename the item.');
    }
}



    
async function handleEditClick(){

}

async function handleUploadClick(){

}

async function handleModifyClick(){

}