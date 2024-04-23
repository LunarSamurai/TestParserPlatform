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


