import React from 'react';
import Resource2 from '../resource/Resource';
import resourceApiObj from '../../utils/resourceApi';
import { resources } from '../../constants/constants';
import Header from '../header/Header';

export default function App() {

  const resourceArray = { 'Geomage.com': 'https://www.geomage.com', '89.192.15.12': '2', 'nebius': '3', 'cloud.il': '4', '89.192.15.11': '5' };

  const resourceClick = (name, hidePreloader) => {
    const resourceUrl = resourceArray[name];
    if (resourceUrl) {
      resourceApiObj.refresh(resourceUrl)
        .then((data) => {
          if (data) {
            console.log(data);
          }
        })
        .catch((err) => {
          if (err) {
            const time = new Date();
            const lastTry = `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}:${time.getMilliseconds()}`;
          }
        })
        .finally(() => {
          hidePreloader();
        });
    }
  }

  return (
    <div className="app">
      <Header />
      <div className='resources'>
        {resources.map((resource, index) => {
          return <Resource2 resource={resource} key={index} onClick={resourceClick} />
        })}
      </div>
    </div>
  );
}
