let currentSelectedPath = "";
let currentSelection = null;  // Globally defined to track the selected DOM element


function handleHomeClick() {
    window.location.href = "../../index.html";
    sessionStorage.clear("isAdmin");
}

/* 

//
//  Handle All View Button Click Events 
//
//
                                            */


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

//Display Modal Functions:
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

/* 
//
//  Handle All Upload Button Click Events 
//
//
                                            */

async function handleUploadClick() {
    try {
        const result = await window.api.invoke('view-files');
        if (result.success && Array.isArray(result.data)) {
            const treeHtml = buildUploadDirectoryTreeHtml(result.data, true); // Adjust function to handle click for selection
            displayUploadModal(treeHtml);
        } else {
            console.error('Failed to retrieve files:', result.message || 'Unexpected error');
            alert('Failed to retrieve files: ' + result.message);
        }
    } catch (error) {
        console.error('Error retrieving files:', error);
        alert('An error occurred while trying to retrieve files.');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.querySelector('.modal-content').classList.remove('active');
    setTimeout(() => {
        modal.style.display = "none";
    }, 300);
}
// Upload Directory Tree
function buildUploadDirectoryTreeHtml(data) {
    if (!Array.isArray(data)) {
        console.error('Expected data to be an array, received:', data);
        return '<p>Error: Data is not an array.</p>';
    }

    let html = '<ul>';
    data.forEach(folder => {
        html += `<li><span class="folder-name" data-path="${folder.path.replace(/\\/g, '\\\\')}" onclick="selectFolder(event, '${folder.path.replace(/\\/g, '\\\\')}')">${folder.folder}</span><ul>`;
        folder.files.forEach(file => {
            html += `<li><span class="file-name">${file}</span></li>`;
        });
        html += '</ul></li>'; // Close the folder's file list UL
    });
    html += '</ul>'; // Close the main UL
    return html;
}


function displayUploadModal(htmlContent) {
    const modal = document.getElementById('uploadFilesModal');
    const directoryTreeElement = document.getElementById('uploadDirectoryTree');
    const selectButton = document.getElementById('selectFolderButton');
    const span = modal.querySelector('.close');

    directoryTreeElement.innerHTML = htmlContent;
    modal.style.display = "flex";
    modal.querySelector('.uploadFilesmodal-content').classList.add('active');

    span.onclick = function() {
        closeModal('uploadFilesModal');
    };

    window.onclick = function(event) {
        if (event.target === modal) {
            closeModal('uploadFilesModal');
        }
    };

    selectButton.onclick = function() {
        const selectedPath = getSelectedPath();
        console.log('Selected Path on button click:', selectedPath);  // Debug: Check what path is selected
    
        if (selectedPath) {
            openFileExplorer(selectedPath);
        } else {
            console.log('No folder selected when button clicked.');  // Additional debug info
            alert('Please select a folder.');
        }
    };    
}


function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        const modalContent = modal.querySelector('.uploadFilesmodal-content');
        if (modalContent) {
            modalContent.classList.remove('active');
            setTimeout(() => {
                modal.style.display = "none";
            }, 300);
        } else {
            console.error('Modal content not found');
        }
    } else {
        console.error('Modal not found');
    }
}

function openFileExplorer() {
    console.log('Attempting to open explorer for path:', currentSelectedPath);

    if (typeof currentSelectedPath !== 'string' || currentSelectedPath === "") {
        console.error('Invalid path', currentSelectedPath);
        alert("Please select a valid folder first.");
        return;
    }
    window.api.invoke('open-file-explorer', { defaultPath: currentSelectedPath, multiSelections: true }).then(response => {
        console.log('File selection response:', response);
        if (response.success && response.filePaths && response.filePaths.length > 0) {
            console.log('Selected file paths:', response.filePaths); // Log the selected file paths
            
            // Handle both single and multiple file paths
            response.filePaths.forEach(filePath => {
                window.api.invoke('upload-file', { sourcePaths: [filePath], destinationFolder: currentSelectedPath }).then(result => {
                    console.log('Upload result:', result);
                    if (result.success) {
                        console.log('File uploaded successfully:', filePath);
                    } else {
                        console.error('Failed to upload file:', filePath, 'Error:', result.message);
                    }
                }).catch(error => {
                    console.error('Error during file upload:', error);
                    alert('Failed to upload the files.');
                });
            });
            
            alert('Files uploaded successfully!');
            closeModal('uploadFilesModal');
        } else {
            console.warn('No files selected or an error occurred during file selection.');
            alert('No files selected or an error occurred during file selection.');
        }
    }).catch(error => {
        console.error('Error during file selection:', error);
        alert('Failed to select the files.');
    });
}


function selectFolder(event, path) {
    if (currentSelection) {
        currentSelection.classList.remove('selected');
    }
    
    const newSelection = event.currentTarget.parentNode;  // Verify the correct target is selected
    newSelection.classList.add('selected');
    currentSelection = newSelection;  // Update the global variable
    currentSelectedPath = path.replace(/\\/g, '\\\\');  // Make sure the path is escaped properly

    console.log('New path selected:', currentSelectedPath);
    console.log('Current selection updated:', currentSelection);

    event.stopPropagation();  // Prevents the event from bubbling up to parent elements
}


function getSelectedPath() {
    if (currentSelection) {
        const pathElement = currentSelection.querySelector('.folder-name');
        const path = pathElement ? pathElement.getAttribute('data-path') : null;
        console.log('Retrieving path from currentSelection:', path);
        return path;
    }
    console.log('Current selection path is null');
    return null;
}


document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('selectFolderButton').onclick = function() {
        openFileExplorer();
    };
});


async function handleEditClick() {
    try {
        const result = await window.api.invoke('view-files');
        if (result.success && Array.isArray(result.data)) {
            displayEditModal(buildEditDirectoryTreeHtml(result.data));
        } else {
            console.error('Failed to retrieve files:', result.message || 'result object is missing expected properties or is not an array');
            alert('Failed to retrieve files: ' + result.message);
        }
    } catch (error) {
        console.error('Error retrieving files:', error);
        alert('An error occurred while trying to retrieve files.');
    }
}

function buildEditDirectoryTreeHtml(data) {
    if (!Array.isArray(data)) {
        console.error('Expected data to be an array, received:', data);
        return '<p>Error: Data is not an array.</p>';
    }

    let html = '<ul>';
    data.forEach(folder => {
        const folderPath = folder.path.replace(/\\/g, '\\\\');
        html += `<li><span class="folder-name" data-path="${folderPath}" onclick="selectFileToEdit(event, '${folderPath}')">${folder.folder}</span><ul>`;
        folder.files.forEach(file => {
            const fullPath = `${folder.path}\\${file}`.replace(/\\/g, '\\\\');
            html += `<li><span class="file-name" data-path="${fullPath}" onclick="selectFileToEdit(event, '${fullPath}')">${file}</span></li>`;
        });
        html += '</ul></li>'; // Close the folder's file list UL
    });
    html += '</ul>'; // Close the main UL
    return html;
}

function displayEditModal(htmlContent) {
    const modal = document.getElementById('editFilesModal');
    const directoryTreeElement = document.getElementById('editDirectoryTree');
    const span = modal.querySelector('.close');

    directoryTreeElement.innerHTML = htmlContent;
    setupEditEventListeners();  // Setup event listeners for file selection

    modal.style.display = "flex";
    modal.querySelector('.editFilesmodal-content').classList.add('active');

    span.onclick = function() {
        closeModal('editFilesModal');
    };

    window.onclick = function(event) {
        if (event.target === modal) {
            closeModal('editFilesModal');
        }
    };
}

function setupEditEventListeners() {
    document.querySelectorAll('.folder-name, .file-name').forEach(item => {
        item.addEventListener('click', function(event) {
            const path = this.getAttribute('data-path');
            selectFileToEdit(event, path);
        });
    });
}

function selectFileToEdit(event, path) {
    console.log('Selected file path:', path);  // Debug log
    if (!path) {
        // If path is not provided, try to get it from the clicked element
        path = event.currentTarget.getAttribute('data-path');
        console.log('Retrieved file path from data-path attribute:', path);  // Debug log
    }
    currentSelectedPath = path;
    displayEditConfirmationModal();
}

function displayEditConfirmationModal() {
    const modal = document.getElementById('editConfirmationModal');
    const yesButton = document.getElementById('editYesButton');
    const noButton = document.getElementById('editNoButton');
    const span = modal.querySelector('.close');

    modal.style.display = "flex";
    modal.querySelector('.editConfirmationmodal-content').classList.add('active');

    yesButton.onclick = function() {
        closeModal('editConfirmationModal');
        console.log('Editing file path:', currentSelectedPath);  // Debug log
        openFileEditor(currentSelectedPath);
    };

    noButton.onclick = function() {
        closeModal('editConfirmationModal');
    };

    span.onclick = function() {
        closeModal('editConfirmationModal');
    };

    window.onclick = function(event) {
        if (event.target === modal) {
            closeModal('editConfirmationModal');
        }
    };
}

async function openFileEditor(path) {
    try {
        console.log('Requesting to read file:', path);  // Debug log
        const result = await window.api.invoke('read-file', path);
        if (result.success) {
            const editorModal = document.getElementById('fileEditorModal');
            const editorElement = document.getElementById('editor');
            const saveButton = document.getElementById('saveFileButton');
            const span = editorModal.querySelector('.close');

            // Display modal first
            editorModal.style.display = "flex";
            editorModal.querySelector('.fileEditormodal-content').classList.add('active');

            setTimeout(() => {
                // Initialize Ace Editor
                const editor = ace.edit(editorElement);
                editor.session.setValue(result.content);
                editor.setTheme("ace/theme/chrome");  // Set to light theme
                editor.session.setMode("ace/mode/text");

                // Custom styling for the editor
                editor.container.style.border = "1px solid black";  // Black border
                editor.container.style.backgroundColor = "white";  // White background
                editor.container.style.color = "black";  // Black text color
                editor.container.style.borderRadius = "4px";  // Rounded corners

                // Explicitly focus the editor after initializing it
                editor.container.focus();
                editor.focus();

                // Ensure focus is retained
                function retainFocus() {
                    setTimeout(() => {
                        editor.focus();
                    }, 100);
                }
                
                // Attach focus handlers
                editor.container.addEventListener('click', retainFocus);
                window.addEventListener('focus', retainFocus);

                saveButton.onclick = function() {
                    saveFile(path, editor.session.getValue());
                };

                span.onclick = function() {
                    closeModal('fileEditorModal');
                    window.removeEventListener('focus', retainFocus);  // Clean up event listener
                };

                window.onclick = function(event) {
                    if (event.target === editorModal) {
                        closeModal('fileEditorModal');
                        window.removeEventListener('focus', retainFocus);  // Clean up event listener
                    }
                };

                // Ensure the editor gains focus after some delay
                setTimeout(() => {
                    editor.focus();
                }, 300);
            }, 100);  // Adjust the delay time as needed
        } else {
            console.error('Failed to read file:', result.message);
            alert('Failed to read the file: ' + result.message);
        }
    } catch (error) {
        console.error('Error reading file:', error);
        alert('An error occurred while trying to read the file.');
    }
}


// Handle visibility change to re-focus the editor
document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible') {
        const editor = ace.edit('editor');
        editor.renderer.updateFull();  // Refresh the editor when the document becomes visible
        editor.focus();  // Ensure the editor gains focus when visibility changes
    }
});

// Ensure the Ace Editor retains focus when the window is refocused
window.addEventListener('focus', () => {
    const editor = ace.edit('editor');
    if (editor) {
        editor.focus();
    }
});


async function saveFile(path, content) {
    try {
        const result = await window.api.invoke('save-file', { path, content });
        if (result.success) {
            alert('File saved successfully!');
            closeModal('fileEditorModal');
        } else {
            console.error('Failed to save file:', result.message);
            alert('Failed to save the file: ' + result.message);
        }
    } catch (error) {
        console.error('Error saving file:', error);
        alert('An error occurred while trying to save the file.');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        const modalContent = modal.querySelector('.modal-content, .editFilesmodal-content, .fileEditormodal-content, .editConfirmationmodal-content');
        if (modalContent) {
            modalContent.classList.remove('active');
            setTimeout(() => {
                modal.style.display = "none";
            }, 300);
        } else {
            console.error('Modal content not found');
        }
    } else {
        console.error('Modal not found');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('selectFolderButton').onclick = function() {
        openFileExplorer();
    };
});



async function handleModifyClick(){

}
