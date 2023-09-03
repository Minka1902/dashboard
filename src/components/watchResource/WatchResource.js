import React from "react";
import CurrentResourceContext from "../../contexts/CurrentResourceContext";
import Preloader from '../preloader/Preloader';
import * as Charts from '../chart/Charts';
import * as Buttons from '../buttons/Buttons';
import { reduceMinute } from '../../utils/timeDiff.ts';
import { formatMemory, formatDate } from '../../constants/functions';

export default function WatchResource({ resourceClick, chartData, isFromZero, isPreloader, setIsPreloader }) {
    const currentResource = React.useContext(CurrentResourceContext);
    const now = new Date();

    const calculatePercentage = () => {
        const percent = currentResource.memoryLeft * 100;
        return (percent / currentResource.totalMemory).toFixed(2);
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
                <Charts.LineChart title={{ text: currentResource && currentResource.totalMemory !== undefined ? 'Time / % capacity in use' : 'Time / 0-Disabled 1-Active' }} chartClass='watch-resource__chart' chartData={chartData} subtitle={false} isYZero={chartData && chartData[0].status ? true : isFromZero} />
            }
            <div className='watch-resource__resource_info-container'>
                {currentResource ? <div className='watch-resource__container'>
                    <p className='zero-margin'>Resource: <span className={`${new Date(currentResource.lastChecked) > reduceMinute(now, 5) ? (currentResource.isActive ? 'green' : 'red') : 'red'}`}>{new Date(currentResource.lastChecked) > reduceMinute(now, 5) ? (currentResource.isActive ? 'active' : 'not active') : 'Not active'}</span></p>
                    <p className='zero-margin'>Status: <span className={`${new Date(currentResource.lastChecked) > reduceMinute(now, 5) ? 'green' : 'red'}`}>{new Date(currentResource.lastChecked) > reduceMinute(now, 5) ? currentResource.status : 'Not available'}</span></p>
                </div> : <></>}
                {currentResource && currentResource.totalMemory ? <p className='zero-margin'>{new Date(currentResource.lastChecked) > reduceMinute(now, 5) ? 'A' : 'Last a'}vailable memory: <b>{formatMemory(currentResource ? currentResource.memoryLeft : 0)}</b> of {formatMemory(currentResource ? currentResource.totalMemory : 0)}. Which are <b>{calculatePercentage()}%</b>.</p> : <></>}
                {currentResource ? <p className='zero-margin'>Last responded: {formatDate(currentResource.lastChecked)}</p> : <></>}
            </div>
        </section>
    );
};