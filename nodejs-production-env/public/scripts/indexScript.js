const socket = io("http://localhost:3000");
const selection = document.getElementById('bot-select');
var botName = 'enthusiastic';

function sendMessage() {
    var messageInput = document.getElementById('message-input');
    var message = messageInput.value.trim();

    if (message !== '') {
        var chatContainer = document.querySelector('.chat-container');
        var messageElement = document.createElement('div');
        messageElement.classList.add('message', 'my-message');
        messageElement.innerHTML = `
        <div class="message-inner">
            <div class="message-text">
                <span class="content">${message}</span>
            </div>
            <div class="bot-info">
                <img src="../res/person_icon.png" alt="Bot Image" class="bot-image">
                <span class="user">You</span>
            </div>
        </div>`;
        chatContainer.appendChild(messageElement);
        chatContainer.appendChild(messageElement);
        var data = {
            message: message,
            botName: botName
        }
        socket.emit('sendMessage', data);
        messageInput.value = '';
    }
}

socket.on('newMessage', function (data) {
    const textDecoder = new TextDecoder();
    const message = textDecoder.decode(new Uint8Array(data));
    
    var chatContainer = document.querySelector('.chat-container');
    var messageElement = document.createElement('div');
    messageElement.classList.add('message', 'other-message');
    messageElement.innerHTML = `<div class="message-inner">
    <div class="bot-info">
        <img src="../res/robo_icon.png" alt="Bot Image" class="bot-image">
        <span class="user">Bot</span>
    </div>
    <div class="message-text">
        <span class="content">${message}</span>
    </div>
</div>`;
    chatContainer.appendChild(messageElement);
    chatContainer.appendChild(messageElement);
    ``
})

function handleKeyPress(event) {
    if (event.keyCode === 13) { // Check if Enter key is pressed (key code 13)
        event.preventDefault(); // Prevent the default form submission behavior
        sendMessage(); // Call the sendMessage function when Enter is pressed
    }
}

selection.addEventListener('change', function () {
    botName = selection.value
    document.querySelector('.chat-container').innerHTML = '';
});

