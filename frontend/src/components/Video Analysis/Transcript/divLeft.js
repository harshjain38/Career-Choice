import classes from "./divLeft.module.css";

const DivLeft = props => {
    return <div className={classes.divleft}>
        <p className={classes.p1}>Transcript:-</p>
        {
            props.transcripts && props.transcripts.length
            ? props.transcripts.map((trans,index)=>{
                const tran = trans.split("\n\n");
                return <div key={index} className={classes.p2}>
                    {tran.map((item, index) => {
                        return <span key={index}>
                            <span>{item}</span>
                            <br /><br />
                        </span>
                    })}
                </div>
            })
            : ""
        }
    </div>
};

export default DivLeft;