export default function ProgressBar({ value, maxValue, isProgressBarOk = true }) {
    if (typeof value !== 'number' || typeof maxValue !== 'number' || maxValue === 0) {
        throw new Error('Invalid input parameters');
    }
    const percentage = (value / maxValue) * 100;

    return (
        <>
            <label className="progress-bar__title">Memory: </label>
            <div className={`progress-bar ${isProgressBarOk ? 'progress-bar__ok' : ''}`}>
                <div
                    className="progress-bar__fill"
                    style={{ width: `${percentage}%` }}>
                </div>
                {isProgressBarOk && <div className='progress-bar__label progress-bar__label_ok'>{`${percentage.toFixed(2)}%`}</div>}
            </div>
        </>
    );
};
