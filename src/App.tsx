import React, { useState } from 'react';
import './App.scss';
import EventContext, { TEvent } from './context/EventContext';
import Coupon from './Coupon/Coupon';
import EventTable from './EventTable/EventTable';

const App = () => {
	const [coupon, setCoupon] = useState([] as TEvent[]);

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
