import React from 'react';
import Resource from '../resource/Resource';

export default function App() {
  const date = new Date().toDateString();
  const resource1 = { name: 'Geomage.com', status: 200, lastActive: 'now', lastTry: date, memoryLeft: '500GB', memoryPrecentage: 80 }
  const resource2 = { name: '89.192.15.12', status: 200, lastActive: 'now', lastTry: date }
  const resource3 = { name: 'nebius', status: 404, lastActive: 'Yesterday', lastTry: date, memoryLeft: '300GB', memoryPrecentage: 20 }
  const resource4 = { name: 'cloud.il', status: 500, lastActive: '13.04.2023 17:26:49', lastTry: date, memoryLeft: '320GB', memoryPrecentage: 40 }
  const resource5 = { name: '89.192.15.11', status: 208, lastActive: '12.11.2022 03:04:56', lastTry: date }

  const resourceArray = { 'Geomage.com': '1', '89.192.15.12': '2', 'nebius': '3', 'cloud.il': '4', '89.192.15.11': '5' };

  const resourceClick = (name) => {
    const asd = resourceArray[name];
    if (asd) {
      console.log(asd);
    }
  }

  return (
    <div className="app">
      <Resource />
    </div>
  );
}
