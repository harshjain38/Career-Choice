import classes from "./chat.module.css";

const Chats = props => {
    return <section>
        {props.chats && props.chats.length
        ? props.chats.map((chat, index) => {
            const texts = chat.content.split("\n");
            return <div key={index} className={classes.msgg}>
                <span>
                    <b>{chat.role.toUpperCase()}</b>
                </span>
                <span>:</span>
                {/* eslint-disable-next-line */}
                {texts.map((item, index) => {
                    if (item && index === texts.length - 2 && !texts[index + 1]) {
                        return <span key={index}>
                            <span>{item}</span>
                        </span>
                    }
                    else if (item) {
                        if (index !== texts.length - 1) {
                            return <span key={index}>
                                <span>{item}</span>
                                <br /><br />
                            </span>
                        }
                        else {
                            return <span key={index}>
                                <span>{item}</span>
                            </span>
                        }
                    }
                })}
            </div>
        })
        : "" }
    </section >
}

export default Chats;