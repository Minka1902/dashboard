export default function ProgressBar({ value, maxValue, isOk = true }) {
    const percentage = (value / maxValue) * 100;

    return (
        <>
            <label className="progress-bar__title">Memory: </label>
            <div className={`progress-bar ${isOk ? 'progress-bar__ok' : ''}`}>
                <div
                    className="progress-bar__fill"
                    style={{ width: `${percentage}%` }}>
                </div>
                <div className={`progress-bar__label ${isOk ? 'progress-bar__label_ok' : ''}`}>{`${percentage.toFixed(2)}%`}</div>
            </div>
        </>
    );
};
