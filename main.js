const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
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

const fs = require('fs');

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
    const promptDir = path.join(__dirname, 'Resources/SliderPrompts');
    const files = await fs.promises.readdir(promptDir);
    const sliderPrompts = await Promise.all(files.map(async (file) => {
        const filePath = path.join(promptDir, file);
        const content = await fs.promises.readFile(filePath, { encoding: 'utf-8' });
        return {
            name: file, // Include the file name
            content: content // The actual content of the file
        };
    }));
    return sliderPrompts; // Whatever you need to return
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


ipcMain.on('save-form-data', (event, formData) => {
    const filePath = path.join(app.getPath('userData'), 'Results', 'formData.txt');
    fs.writeFile(filePath, formData, (err) => {
      if (err) {
        console.error('An error occurred saving the form data', err);
        event.reply('form-data-save-response', 'error');
      } else {
        console.log('Form data saved successfully!');
        event.reply('form-data-save-response', 'success');
      }
    });
  });



// Quit when all windows are closed, except on macOS. There,
// it's common for applications and their menu bar to stay active
// until the user quits explicitly with Cmd + Q.
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});
