import React from "react";

// TODO gets JSON formated files
// ?    [1, 2, 3, 4] {"name": "Jhon doe"}
export default function FileInput({ onFileChoose }) {
    const [fileName, setFileName] = React.useState('');

    const handleFileChange = (event) => {
        event.preventDefault();
        let fileContent;
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                fileContent = JSON.parse(event.target.result);
            } catch (error) {
                console.error('Error parsing JSON:', error);
            }
            onFileChoose(fileContent);
        };
        setFileName(file.name);
        reader.readAsText(file);
    };

    return (
        <>
            <label className="file-label">
                <span className="file-icon" />
                <span className={`file-text${fileName ? '__name' : ''}`}>{fileName ? fileName : 'Choose a file...'}</span>
            </label>
            <input className="file-input visually-hidden" onChange={handleFileChange} type="file" name='file' />
        </>
    );
}
