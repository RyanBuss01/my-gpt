import personIcon from './res/person_icon.png';
import robotIcon from './res/robo_icon.png';

function Message ({message, user}) {
    const isMyMessage = user === "Me"; // Check if it's a user message

    return (
        <div className={`message ${isMyMessage ? 'my-message' : 'other-message'}`}> {/* Apply class conditionally */}
            {isMyMessage ? (
                <> 
                    <div class="message-text">
                        <span class="content">{message}</span>
                    </div>
                    <div class="bot-info">
                        <img src={personIcon} alt="Bot" class="bot-image" />
                        <span class="user">You</span>
                    </div>
                </>
            )
            : (
                <> {/* Order elements correctly for 'Bot' messages */}
                    <div class="bot-info">
                        <img src={robotIcon} alt="Bot" class="bot-image" />
                        <span class="user">Bot</span>
                    </div>
                    <div class="message-text">
                        <span class="content">{message}</span>
                    </div>
                </>
            )}
        </div>
    );
}


export default Message;