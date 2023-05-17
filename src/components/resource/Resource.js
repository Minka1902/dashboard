import React from "react";
import Preloader from '../preloader/Preloader';
import ProgressBar from "../progressBar/ProgressBar";

export default function Resource(props) {
    const { resource, onClick, deleteSource } = props;
    const [isPreloader, setIsPreloader] = React.useState(false);

    const setIsPreloaderFalse = () => {
        setIsPreloader(false);
    }

    const resourceClick = (evt) => {
        evt.preventDefault();
        setIsPreloader(true);
        onClick(resource, setIsPreloaderFalse);
    };

    const deleteClick = (evt) => {
        evt.preventDefault();
        deleteSource(resource.name);
    }

    const calculatePrecentage = () => {
        const precent = resource.memoryLeft * 100;
        return precent / resource.totalMemory;
    };

    const formatDate = (inputDate) => {
        const date = new Date(inputDate);

        const day = date.getDate();
        const month = date.getMonth() + 1; // Months are zero-based
        const year = date.getFullYear();
        const hours = date.getHours();
        const minutes = date.getMinutes();

        const formattedDate = `${day}.${month < 10 ? '0' : ''}${month}.${year} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        return formattedDate;
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
                        <img className="resource__image" src={resource.status === 200 ? 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Green_Light_Icon.svg/1200px-Green_Light_Icon.svg.png' : ''} alt={`Status: ${resource.status}`} title={`Status: ${resource.status}`} />
                        <h3 className="resource__200_text">{formatDate(resource.updatedAt)}</h3>
                    </>
                );
            } else {
                return (<>
                    {
                        resource.memoryLeft ?
                            <div className="resource__memory_content">
                                <ProgressBar value={calculatePrecentage()} maxValue={100} />
                            </div>
                            :
                            <></>
                    }
                    <h3 className={`resource__last-active ${resource.totalMemory ? '' : 'no-memory'}`}>Resource active: {formatDate(resource.lastActive)} <br />Last tried: {formatDate(resource.lastChecked)}</h3>
                    <h3 className={`resource__status ${resource.status === 200 ? '' : 'not-'}working`} >{resource.status}</h3>
                </>);
            }
        }
    };
    formatDate(resource.updatedAt);

    return (
        <>
            <div className="resource" onClick={resourceClick}>
                <div className="resource__name_container">
                    <h3 className="resource__name">{resource.name}</h3>
                    <button className="resource__button" onClick={deleteClick} />
                </div>
                {renderInfo()}
            </div>
        </>
    );
};
