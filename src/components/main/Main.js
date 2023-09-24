import React from "react";
import Resource from "../resource/Resource";
import CurrentUserContext from "../../contexts/CurrentUserContext";

export default function Main({ resources, isRefresh, resourceClick, switchPopups, isAgentNotFound }) {
    const currentUser = React.useContext(CurrentUserContext);
    const [machines, setMachines] = React.useState([]);
    const [sources, setSources] = React.useState([]);

    const splitResources = () => {
        let tempMachines = [];
        let tempSources = [];
        for (let i = 0; i < resources.length; i++) {
            if (resources[i].data.isMachine) {
                tempMachines[tempMachines.length] = { data: resources[i].data, lastEntry: resources[i].lastEntry };
            } else {
                tempSources[tempSources.length] = { data: resources[i].data, lastEntry: resources[i].lastEntry };
            }
        }
        setMachines(tempMachines.length === 0 ? [] : tempMachines);
        setSources(tempSources.length === 0 ? [] : tempSources);
    };

    React.useEffect(() => {
        splitResources();
    }, [resources]);

    return (
        sources.length !== 0 && machines.length !== 0 ?
            <main name='home' id='home' >
                {currentUser ? <h1 className='main__title'>{currentUser.username}, welcome back!</h1> : <h1 className='main__title'>Welcome.<br />To edit resources please <span className='signin' onClick={switchPopups}>sign in</span>.</h1>}
                <div className="resources">
                    <h2 className="resource-type__title">sources</h2>
                    <div className='sources' >
                        {sources.length !== 0 ? sources.map((resource, index) => {
                            return <Resource isRefresh={isRefresh} resource={resource.data} key={index} onClick={resourceClick} lastEntry={resource.lastEntry} />
                        }) : <></>}
                    </div>
                    <h2 className="resource-type__title">Servers</h2>
                    <div className='machines' >
                        {machines.length !== 0 ? machines.map((resource, index) => {
                            return <Resource isRefresh={isRefresh} resource={resource.data} key={index} onClick={resourceClick} lastEntry={resource.lastEntry} />
                        }) : <></>}
                    </div>
                </div>
                <div className={`main__not-found-message${isAgentNotFound ? ' opened' : ''}`}>Agent not found</div>
            </main> : <></>
    );
};