function handleHomeClick(){
    window.location.href = "../../index.html";
}

async function handleDownloadClick() {
    try {
        const result = await window.api.invoke('combine-and-download-text-files');
        if (result.success) {
            console.log('File combined and saved successfully at:', result.path);
            alert('Files combined and saved to: ' + result.path);
        } else {
            console.error('Failed to combine and save the file', result.error);
            alert('Error: ' + result.error);
        }
    } catch (error) {
        console.error('Error in downloading files:', error);
        alert('Failed to download files');
    }
}


async function handleEraseClick() {
    try {
        const response = await window.api.invoke('erase-text-files');
        if (response.success) {
            console.log('All text files have been erased successfully.');
            alert('All text files have been erased successfully.');
        } else {
            console.error('Failed to erase text files:', response.message);
            alert('Failed to erase text files: ' + response.message);
        }
    } catch (error) {
        console.error('Error erasing text files:', error);
        alert('An error occurred while trying to erase text files.');
    }
}

async function handleViewAllClick() {
    try {
        const result = await window.api.invoke('viewAllResults');
        console.log(result);

        if (result && result.success && Array.isArray(result.data)) {
            let modalContent = '<table>';
            modalContent += '<tr><th>File name</th><th>Content</th></tr>';

            result.data.forEach(file => {
                let cleanedContent = '';
                // Split the content by spaces
                const contentParts = file.content.split(' ');

                // Process each part to bold everything before the colon
                contentParts.forEach(part => {
                    // Split the part by colon
                    const partsWithColon = part.split(':');
                    // For each segment ended with a colon, wrap it with <strong>
                    const boldedParts = partsWithColon.map((subPart, index) => {
                        // Do not bold the last part if there's no text following the colon
                        return (index < partsWithColon.length - 1) ? `<strong>${subPart}:</strong>` : subPart;
                    });
                    // Join the parts back with an empty string, since the colon is already added after bolding
                    cleanedContent += boldedParts.join('') + ' ';
                });

                // Trim the final string and remove unwanted characters
                cleanedContent = cleanedContent.trim().replace(/[\[\]{}(),"]/g, '');

                // Append the cleaned and formatted content
                modalContent += `<tr><td>${file.fileName}</td><td>${cleanedContent}</td></tr>`;
            });

            modalContent += '</table>';
            displayModal(modalContent);
        } else {
            console.error('Failed to retrieve file contents: result object is missing expected properties');
            alert('Failed to retrieve file contents: result object is missing expected properties');
        }
    } catch (error) {
        console.error('Error retrieving file contents:', error);
        alert('An error occurred while trying to retrieve file contents.');
    }
}

function displayModal(modalContent) {
    const modal = document.getElementById('modal');
    const modalContentElement = document.querySelector('.modal-content');
    const fileContentsElement = document.getElementById('fileContents');
    const span = document.getElementsByClassName('close')[0];
  
    fileContentsElement.innerHTML = `<div class="scrollable-table-container">${modalContent}</div>`;
    modal.style.display = "flex";
    modalContentElement.classList.add('active');
  
    span.onclick = function() {
        modalContentElement.classList.remove('active');
        setTimeout(() => {
          modal.style.display = "none";
        }, 300); // Wait for the animation to finish.
    };
  
    window.onclick = function(event) {
        if (event.target === modal) {
            modalContentElement.classList.remove('active');
            setTimeout(() => {
              modal.style.display = "none";
            }, 300); // Wait for the animation to finish.
        }
    };
  }
  


