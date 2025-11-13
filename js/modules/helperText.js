    export function showHelperText(input, message){
        const helper = input.parentElement.querySelector('.helper-text');
        console.log('helper found:', helper, 'message:', message);

        if(helper) helper.innerHTML = message;
    }