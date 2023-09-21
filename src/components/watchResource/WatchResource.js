import { useContext } from "react";
import CurrentResourceContext from "../../contexts/CurrentResourceContext";
import LastEntryContext from "../../contexts/LastEntryContext";
import Preloader from '../preloader/Preloader';
import * as Charts from '../chart/Charts';
import * as Buttons from '../buttons/Buttons';
import { reduceMinute } from '../../utils/timeDiff.ts';
import { formatMemory, formatDate } from '../../constants/functions';

export default function WatchResource({ resourceClick, chartData, isFromZero, isPreloader, setIsPreloader, isCapacity }) {
    const currentResource = useContext(CurrentResourceContext);
    const lastEntry = useContext(LastEntryContext);
    const fiveMin = reduceMinute(new Date(), 5);

    const calculatePercentage = (isCapacity) => {
        if (isCapacity) {
            const percent = lastEntry.capacityLeft * 100;
            return (percent / lastEntry.totalCapacity).toFixed(2);
        } else {
            const percent = lastEntry.freeMemory * 100;
            return (percent / lastEntry.totalMemory).toFixed(2);
        }
    };

    const createErrorMessage = (isToFar = false) => {
        let tempMsg;
        if (isToFar) {
            tempMsg = 'Last entry`s ';
        } else {
            tempMsg = 'Resource`s ';
        }
        for (let prop in lastEntry.error) {
            if (prop && prop !== null) {
                tempMsg += `error ${prop}-${lastEntry.error[prop]}, `;
            }
        }
        return tempMsg === 'Last entry`s ' || tempMsg === 'Resource`s ' ? '' : tempMsg;
    };

    return (
        <section name='watch-resource' id='watch-resource'>
            <h3 className='watch-resource__title'>{currentResource ? currentResource.url : ''}</h3>
            <div className="refresh-button__container">
                <Buttons.ButtonSVG title='Reload' buttonText="Reload" onClick={() => { resourceClick(currentResource, () => { setIsPreloader(false) }) }} />
            </div>

            {isPreloader ?
                <Preloader />
                :
                <Charts.LineChart
                    title={{ text: !lastEntry.totalCapacity && !lastEntry.totalMemory ? 'Time / 0-Disabled 1-Active' : (isCapacity ? 'Time / Capacity in use' : 'Time / % Memory in use') }}
                    maxY={lastEntry.totalMemory !== undefined ? 100 : 1}
                    chartClass='watch-resource__chart'
                    chartData={chartData}
                    subtitle={false}
                    isYZero={chartData && chartData[0].status ? true : isFromZero}
                    isCapacity={isCapacity}
                />
            }
            <div className='watch-resource__resource_info-container'>
                {!currentResource.isMachine ? <div className='watch-resource__container'>
                    <p className='zero-margin'>Resource: <span className={`${new Date(currentResource.lastChecked) > fiveMin ? (currentResource.isActive ? 'green' : 'red') : 'red'}`}>{new Date(currentResource.lastChecked) > fiveMin ? (currentResource.isActive ? 'active' : 'not active') : 'Not active'}</span></p>
                    <p className='zero-margin'>Status: <span className={`${new Date(currentResource.lastChecked) > fiveMin && currentResource.status === 200 ? 'green' : 'red'}`}>{new Date(currentResource.lastChecked) > fiveMin ? currentResource.status : 'Not available'}</span></p>
                </div> : <></>}
                {lastEntry.totalCapacity ? <p className='zero-margin'>{new Date(lastEntry.lastChecked) > fiveMin ? 'A' : 'Last a'}vailable capacity: <b>{formatMemory(lastEntry.capacityLeft)}</b> of {formatMemory(lastEntry.totalCapacity)}. Which are <b>{calculatePercentage(true)}%</b>.</p> : <></>}
                {lastEntry.totalMemory ? <p className="zero-margin">{new Date(lastEntry.lastChecked) > fiveMin ? 'A' : 'Last a'}vailable RAM: <b>{formatMemory(lastEntry.freeMemory)}</b> of {formatMemory(lastEntry.totalMemory)}. Which are <b>{calculatePercentage(false)}%</b>.</p> : <></>}
                {lastEntry && new Date(lastEntry.checkedAt) > fiveMin ? <p className='zero-margin green'>gAgent last update: {formatDate(lastEntry.checkedAt)}</p> : <p className="zero-margin red">{currentResource.name}'s gAgent last entry was {formatDate(lastEntry.checkedAt)}</p>}
                {new Date(lastEntry.checkedAt) > fiveMin && lastEntry.error ? <p className='zero-margin'>{createErrorMessage()}</p> : <p className='zero-margin'>{createErrorMessage(true)}</p>}
            </div>
        </section>
    );
};
