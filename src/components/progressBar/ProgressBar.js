export default function ProgressBar({ value, maxValue, isProgressBarOk = true }) {
    if (typeof value !== 'number' || typeof maxValue !== 'number' || maxValue === 0) {
        throw new Error('Invalid input parameters');
    }
    const percentage = (value / maxValue) * 100;

    return (
        <>
            <label className="progress-bar__title">Capacity: </label>
            <div className={`progress-bar ${isProgressBarOk ? 'progress-bar__ok' : ''}`}>
                <div
                    className={`progress-bar__fill${percentage > 90 ? ' red-bg' : ''}${percentage >= 75 && percentage <= 90 ? ' orange-bg' : ''}`}
                    style={{ width: `${percentage}%` }}>
                </div>
                {isProgressBarOk && <div className='progress-bar__label progress-bar__label_ok'>{`${percentage.toFixed(2)}%`}</div>}
            </div>
        </>
    );
};
