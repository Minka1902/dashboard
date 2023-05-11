export default function ProgressBar({ value, maxValue }) {
    const percentage = (value / maxValue) * 100;

    return (
        <>
            <label className="progress-bar__title">Memory: </label>
            <div className="progress-bar">
                <div
                    className="progress-bar__fill"
                    style={{ width: `${percentage}%` }}>
                </div>
                <div className="progress-bar__label">{`${percentage.toFixed(2)}%`}</div>
            </div>
        </>
    );
};
