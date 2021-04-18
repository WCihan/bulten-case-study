import { IEvent } from './../eventTable/EventTable';
import { createContext, Dispatch } from 'react';

const EventContext = createContext({ 
    coupon: [] as IEvent[],
    setCoupon: (() => {}) as Dispatch<React.SetStateAction<IEvent[]>>
});

export default EventContext;
