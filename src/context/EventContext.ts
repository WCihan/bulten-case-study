import { createContext, Dispatch } from 'react';

export type TEvent = {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[key: string]: any;
	id: string;
	type: string;
	mbs: string;
	rate: string;
	keyOfType: string;
	keyOfRate: string;
};

const EventContext = createContext({
	coupon: [] as TEvent[],
	setCoupon: (() => {}) as Dispatch<React.SetStateAction<TEvent[]>>
});

export default EventContext;
