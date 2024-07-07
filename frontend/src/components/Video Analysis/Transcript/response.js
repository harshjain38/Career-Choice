import classes from "./response.module.css";

const Response = props => {
    return props.selectedOption === "option1" && props.chats && props.chats.length
        ? props.chats.map((chat, index) => {
            const texts = chat.split("\n");
            return <div key={index} className={classes.response}>
                {/* eslint-disable-next-line */}
                {texts.map((item, index) => {
                    if (item && index === texts.length - 2 && !texts[index + 1]) {
                        return <span key={index}>{item}</span>
                    }
                    else if (item) {
                        if (index !== texts.length - 1) {
                            return <span key={index}>
                                <span>{item}</span>
                                <br /><br />
                            </span>
                        }
                        else {
                            return <span key={index}>{item}</span>
                        }
                    }
                })}
            </div>
        })
        : props.selectedOption === "option2"
            ? <div className={classes.response}>{props.summary}</div>
            : ""
}

export default Response;