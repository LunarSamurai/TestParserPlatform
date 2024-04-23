const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs'); // Add this line to import the fs module
const path = require('path');
const os = require('os');
const util = require('util');
const readdir = util.promisify(fs.readdir);
const unlink = util.promisify(fs.unlink);


let mainWindow; // Declare `mainWindow` at the top level

function createWindow() {
    // Create the browser window.
    console.log(path.join(__dirname, 'preload.js'));
    mainWindow = new BrowserWindow({
        fullscreen: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            // Ensure nodeIntegration is set to false for security
            nodeIntegration: true,
            contentSecurityPolicy: "script-src 'self' 'unsafe-inline';",
            enableRemoteModule: false
        }
    });

    // and load the index.html of the app.
    mainWindow.loadFile('index.html');

    // Open the DevTools.
    mainWindow.webContents.openDevTools();
}


// This method will be called when Electron has finished.
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.

app.whenReady().then(() => {
    createWindow();

    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

ipcMain.on('action', (event, action) => {
    console.log(`Action received: ${action}`);
    console.log('Click received:'+ event);
    switch (action) {
        case 'view-results':
            console.log('Viewing results...');
            if (mainWindow){
                mainWindow.loadFile('Services/Results/getResults.html');
            } else {
                console.error('The mainWindow is not initialized.');
            }
            // Implement viewing results
            break;
        case 'upload':
            console.log('Opening upload dialog...');
            // Implement upload functionality
            break;
        case 'start-exam':
            if (mainWindow) {
                mainWindow.loadFile('Services/Demographics/demographics.html'); // Load test.html in mainWindow
            } else {
                console.error('The mainWindow is not initialized.');
            }
            break;
        case 'admin-login':
            console.log('Admin logging in...');
            // Implement admin login
            break;
        case 'options':
            console.log('Opening options...');
            // Implement opening options
            break;
    }
});


ipcMain.handle('getDateID', async () => {
    const date = new Date();
    const randomNum = Math.floor(Math.random() * 10000);
    return date.getFullYear().toString() +
           (date.getMonth() + 1).toString().padStart(2, '0') +
           date.getDate().toString().padStart(2, '0') +
           date.getHours().toString().padStart(2, '0') +
           date.getMinutes().toString().padStart(2, '0') +
           date.getSeconds().toString().padStart(2, '0') +
           randomNum.toString().padStart(4, '0');
});

ipcMain.handle('get-questions', async () => {
    const questionsDir = path.join(__dirname, 'Resources/OpenEndedQuestions');
    const files = await fs.promises.readdir(questionsDir);
    const questions = await Promise.all(files.map(async (file) => {
        const filePath = path.join(questionsDir, file);
        return fs.promises.readFile(filePath, { encoding: 'utf-8' });
    }));
    return questions;
});

ipcMain.handle('get-prompt', async () => {
    const promptDir = path.join(__dirname, 'Resources/Scenarios');
    const files = await fs.promises.readdir(promptDir);
    const prompts = await Promise.all(files.map(async (file) => {
        const filePath = path.join(promptDir, file);
        const content = await fs.promises.readFile(filePath, { encoding: 'utf-8' });
        return {
            name: file, // Include the file name
            content: content // The actual content of the file
        };
    }));
    return prompts;
});

ipcMain.handle('load-sliders', async () => {
    console.log('Loading slider prompts...');
    try {
        const promptDir = path.join(__dirname, 'Resources/SliderPrompts');
        const files = await fs.promises.readdir(promptDir);
        const sliderPrompts = await Promise.all(files.map(async (file) => {
            const filePath = path.join(promptDir, file);
            const content = await fs.promises.readFile(filePath, { encoding: 'utf-8' });
            console.log('Loaded slider prompt:', content);
            return {
                name: file,  // Include the file name
                content: content  // The actual content of the file
            };
        }));
        return sliderPrompts;  
    } catch (error) {
        console.error('Error loading sliders:', error);
        throw new Error('Failed to load slider data');  // Throw error to be caught by renderer
    }
});

 
ipcMain.handle('get-likert-prompt', async () => {
    const promptDir = path.join(__dirname, 'Resources/LikertQuestions/LikertPrompts');
    const files = await fs.promises.readdir(promptDir);
    const prompts = await Promise.all(files.map(async (file) => {
        const filePath = path.join(promptDir, file);
        const content = await fs.promises.readFile(filePath, { encoding: 'utf-8' });
        return {
            name: file, // Include the file name
            content: content // The actual content of the file
        };
    }));
    return prompts;
});


ipcMain.handle('save-form-data', async (event, formData) => {
    // Initialize or increment examId using electron-store
    let examId = 0; // Get current examId, default to 0
    examId++; // Increment examId

    const demographicsName = `demographicsData${examId}.txt`;
    const filePath = path.join(__dirname, 'Resources', 'Results', demographicsName);
    try {
        // Using fs.promises to handle file write operation
        await fs.promises.writeFile(filePath, formData);
        console.log('Form data saved successfully!');
    } catch (err) {
        console.error('An error occurred saving the form data', err);
        throw new Error('form-data-save-response', 'error');
    }
});


ipcMain.handle('save-to-file', async (event, { filename, dataArray }) => {
    // Convert dataArray to a single-line JSON string
    const content = JSON.stringify(dataArray);

    // Generate a timestamp and replace colons to make it filesystem safe
    const timestamp = new Date().toISOString().replace(/:/g, '-');

    // Change file extension to .txt and include timestamp in the filename
    const completeFilename = `${filename}-${timestamp}.txt`;
    const filePath = path.join(__dirname, 'Resources', 'Results', completeFilename);

    try {
        // Write the single line JSON string to a text file
        await fs.promises.writeFile(filePath, content);
        console.log('Form data saved successfully as a single-line text file!');
        return { success: true, message: "Data saved successfully as a single-line text file." };
    } catch (error) {
        console.error("Failed to save data:", error);
        return { success: false, message: "Failed to save data." };
    }
});

ipcMain.handle('combine-and-download-text-files', async (event) => {
    const sourceDir = path.join(__dirname, 'Resources', 'Results');
    const documentsDir = path.join(os.homedir(), 'Documents');
    const outputFilePath = path.join(documentsDir, 'CombinedResults.txt');

    try {
        const files = fs.readdirSync(sourceDir).filter(file => file.endsWith('.txt'));
        let combinedContent = '';

        for (const file of files) {
            const content = fs.readFileSync(path.join(sourceDir, file), 'utf8');
            combinedContent += content + '\n'; // Add a newline after each file's content
        }

        fs.writeFileSync(outputFilePath, combinedContent.trim()); // Save the combined content
        return { success: true, path: outputFilePath };
    } catch (error) {
        console.error('Failed to read, combine, or save files:', error);
        return { success: false, error: error.message };
    }
});

ipcMain.handle('erase-text-files', async (event) => {
    const directoryPath = path.join(__dirname, 'Resources', 'Results');
    try {
        const files = await readdir(directoryPath);
        const txtFiles = files.filter(file => file.endsWith('.txt'));
        await Promise.all(txtFiles.map(file => unlink(path.join(directoryPath, file))));
        return { success: true, message: 'All text files have been erased.' };
    } catch (error) {
        console.error('Failed to delete text files:', error);
        return { success: false, message: error.message };
    }
});

// Quit when all windows are closed, except on macOS. There,
// it's common for applications and their menu bar to stay active
// until the user quits explicitly with Cmd + Q.
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});
