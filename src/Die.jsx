export default function Die(props) {
    const styles = {
        backgroundColor: props.isHeld ? "#59E391" : ""
    }
    return (
        <div className="die-face" style={styles} onClick={props.holdDie}>
            <h1>{props.value}</h1>
        </div>
    )
}