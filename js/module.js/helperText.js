    export function showHelperText(input, message){
        const helper = input.parentElement.querySelector('helper-text');
        if(helper) helper.textContent = message;
    }