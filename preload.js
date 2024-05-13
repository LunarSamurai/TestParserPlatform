const { contextBridge, ipcRenderer, shell, dialog, fs } = require('electron');
const path = require('path');

contextBridge.exposeInMainWorld('electronApi', {
    getAppPath: () => path.join(__dirname),
    
});

console.log("Preload script is running", "The path is: ", path.join(__dirname, 'preload.js'));

contextBridge.exposeInMainWorld('nodePath', {
    join: (...args) => path.join(...args)
    // You can expose more methods from the path module here as needed
});

contextBridge.exposeInMainWorld('mainMenu', {
    sendAction: (action) => ipcRenderer.send('action', action),
});

contextBridge.exposeInMainWorld('api', {
    getQuestions: () => ipcRenderer.invoke('get-questions'),
    getPrompt: () => ipcRenderer.invoke('get-prompt'),
    getLikertPrompt: () => ipcRenderer.invoke('get-likert-prompt'),
    loadSliders: () => ipcRenderer.invoke('load-sliders'),
    saveFormData: (formString) => ipcRenderer.invoke('save-form-data', formString),
    getDateID: () => ipcRenderer.invoke('getDateID'),
    invoke: (channel, data) => ipcRenderer.invoke(channel, data),    // Other methods
});

console.log("Preload script finished executing");
