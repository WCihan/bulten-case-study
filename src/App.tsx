import React, { useState } from 'react';
import './App.scss';
import EventContext from './context/EventContext';
import Coupon from './Coupon/Coupon';
import EventTable, { IEvent } from './eventTable/EventTable';

const App = () => {
	const [coupon, setCoupon] = useState([] as IEvent[]);

	const value = {
		coupon,
		setCoupon
	};

	return (
		<div className='app'>
			<EventContext.Provider value={value}>
				<EventTable />
				<Coupon />
			</EventContext.Provider>
		</div>
	);
};

export default App;
