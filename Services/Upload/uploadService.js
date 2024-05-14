function handleHomeClick() {
    window.location.href = "../../index.html";
    sessionStorage.clear("isAdmin");
}

async function handleViewClick() {
    try {
        const result = await window.api.invoke('view-files');
        if (result.success && Array.isArray(result.data)) {
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

function setupEventListeners() {
    document.querySelectorAll('.item-options li').forEach(item => {
        item.addEventListener('click', function(event) {
            const action = this.textContent.trim();
            const path = this.closest('.item-options').getAttribute('data-path');
            switch (action) {
                case 'Open':
                    openItem(path);
                    break;
                case 'Delete':
                    deleteItem(path);
                    break;
                case 'Rename':
                    const newName = prompt('Enter the new name:');
                    if (newName) renameItem(path, newName);
                    break;
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const items = document.querySelectorAll('.folder-name, .file-name');
    items.forEach(item => {
        item.addEventListener('mouseenter', function() {
            const optionsMenu = this.nextElementSibling;
            optionsMenu.style.display = 'block'; // Show the menu to calculate dimensions
            const menuRect = optionsMenu.getBoundingClientRect();
            const itemRect = this.getBoundingClientRect();

            // Check if the dropdown goes below the window height
            if (menuRect.bottom > window.innerHeight) {
                optionsMenu.style.top = '';
                optionsMenu.style.bottom = '100%'; // Position it above the item
            } else {
                optionsMenu.style.top = '100%'; // Position it below the item (default)
                optionsMenu.style.bottom = '';
            }
        });

        item.addEventListener('mouseleave', function(event) {
            const optionsMenu = this.nextElementSibling;
            if (!optionsMenu.contains(event.relatedTarget)) {
                optionsMenu.style.display = 'none'; // Hide the menu
            }
        });
    });

    // Also handle mouseleave on the optionsMenu itself
    document.querySelectorAll('.item-options').forEach(menu => {
        menu.addEventListener('mouseleave', function() {
            this.style.display = 'none';
        });
    });
});


function buildDirectoryTreeHtml(data) {
    if (!Array.isArray(data)) {
        console.error('Expected data to be an array, received:', data);
        return '<p>Error: Data is not an array.</p>';
    }
    let html = '<ul>';
    data.forEach(folder => {
        html += `<li><span class="folder-name">${folder.folder}</span>`;
        html += `<div class="item-options" data-path="${folder.path.replace(/\\/g, '\\\\')}">
                    <ul>
                        <li>Open</li>
                        <li>Delete</li>
                        <li>Rename</li>
                    </ul>
                 </div>`;
        html += "<ul>";
        folder.files.forEach(file => {
            const fullPath = `${folder.path}\\${file}`;
            html += `<li><span class="file-name">${file}</span>
                        <div class="item-options" data-path="${fullPath.replace(/\\/g, '\\\\')}">
                            <ul>
                                <li>Open</li>
                                <li>Delete</li>
                                <li>Rename</li>
                            </ul>
                        </div>
                     </li>`;
        });
        html += '</ul></li>';
    });
    html += '</ul>';
    return html;
}

async function openItem(path) {
    try {
        await window.api.invoke('open-item', path);
    } catch (error) {
        console.error('Error opening item:', error);
        alert('Failed to open the item.');
    }
}

async function deleteItem(path) {
    try {
        const confirmation = confirm('Are you sure you want to delete this file?');
        if (confirmation) {
            const result = await window.api.invoke('delete-item', path);
            if (result) alert('File successfully deleted');
            else alert('File deletion canceled');
        }
    } catch (error) {
        console.error('Error deleting item:', error);
        alert('Failed to delete the item.');
    }
}

async function renameItem(path, newName) {
    try {
        const newPath = await window.api.invoke('rename-item', { oldPath: path, newName });
        if (newPath) alert(`File renamed to ${newName}`);
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