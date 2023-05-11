import React from "react";
import v from '../../images/v.svg';
import ex from '../../images/ex.svg';
import Preloader from '../preloader/Preloader';
import ProgressBar from "../progressBar/ProgressBar";

export default function Resource(props) {
    const { resource, onClick } = props;
    const [isPreloader, setIsPreloader] = React.useState(false);

    const setIsPreloaderFalse = () => {
        setIsPreloader(false);
    }

    const resourceClick = (evt) => {
        evt.preventDefault();
        setIsPreloader(true);
        onClick(resource.name, setIsPreloaderFalse);
    }

    return (
        <>
            {isPreloader ?
                <div className="resource" onClick={setIsPreloaderFalse}>
                    <Preloader />
                </div>
                :
                <div className="resource" onClick={resourceClick}>
                    <div className="resource__name_container">
                        <h2 className="resource__header">Name</h2>
                        <h3 className="resource__name">{resource.name}</h3>
                    </div>
                    <div className="resource__status_container">
                        <h2 className="resource__header">Status</h2>
                        <img className="resource__image" src={resource.status === 200 ? v : ex} alt={`Status: ${resource.status}`} title={`Status: ${resource.status}`} />
                        <h3 className={`resource__status ${resource.status === 200 ? '' : 'not-'}working`} >{resource.status}</h3>
                    </div>
                    <div className="resource__last-active_container">
                        <h2 className="resource__header">Last active</h2>
                        <h3 className="resource__last-active">{resource.lastActive}</h3>
                    </div>
                    <div className="resource__last-try_container">
                        <h2 className="resource__header">Last try</h2>
                        <h3 className="resource__last-try">{resource.lastTry}</h3>
                    </div>
                    {
                        resource.memoryLeft ?
                            <div className="resource__memory_container">
                                <h2 className="resource__header">Memory</h2>
                                <div className="resource__memory_content">
                                    <h3 className="resource__memory-left">{resource.memoryLeft}</h3>
                                    <h3 className="resource__memory-precentage">{resource.memoryPrecentage}%</h3>
                                </div>
                            </div>
                            :
                            <></>
                    }
                </div>}
        </>
    );
};

export function Resource2(props) {
    const { resource, onClick } = props;
    const [isPreloader, setIsPreloader] = React.useState(false);

    const setIsPreloaderFalse = () => {
        setIsPreloader(false);
    }

    const resourceClick = (evt) => {
        evt.preventDefault();
        setIsPreloader(true);
        onClick(resource.name, setIsPreloaderFalse);
    }

    const calculatePrecentage = () => {
        const precent = resource.memoryLeft * 100;
        return precent / resource.totalMemory;
    };

    const renderInfo = () => {
        if (isPreloader) {
            return (
                <Preloader text="Reloading, please wait." />
            );
        } else {
            if (resource.status === 200) {
                return (
                    <>
                        <img className="resource__image" src={resource.status === 200 ? 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Green_Light_Icon.svg/1200px-Green_Light_Icon.svg.png' : ex} alt={`Status: ${resource.status}`} title={`Status: ${resource.status}`} />
                        <h3 className="resource__200_text">It`s all good</h3>
                    </>
                );
            } else {
                return (<>
                    <h3 className={`resource__status ${resource.status === 200 ? '' : 'not-'}working`} >{resource.status}</h3>
                    <h3 className="resource__last-active">{resource.lastActive}</h3>
                    <h3 className="resource__last-try">{resource.lastTry}</h3>
                    {
                        resource.memoryLeft ?
                            <div className="resource__memory_content">
                                <ProgressBar value={calculatePrecentage()} maxValue={100}/>
                            </div>
                            :
                            <></>
                    }
                </>);
            }
        }
    };

    return (
        <>
            <div className="resource" onClick={resourceClick}>
                <h3 className="resource__name">{resource.name}</h3>
                {renderInfo()}
            </div>
        </>
    );
};
