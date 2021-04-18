import React, { useContext, useEffect, useRef, useState } from 'react';
import EventContext from '../context/EventContext';
import useIsMounted from '../hooks/useIsMounted';
import './EventTable.scss';

export type IEvent = { [key: string]: any };

const columnHeaders = [
	'Yorumlar',
	'',
	'1',
	'x',
	'2',
	'Alt',
	'Üst',
	'H1',
	'1',
	'x',
	'2',
	'H2',
	'1-X',
	'1-2',
	'X-2',
	'Var',
	'Yok',
	'+99'
].map((i) => ({
	label: i,
	key: Math.random()
}));

export default function EventTable() {
	const isMounted = useIsMounted();
	const [loading, setLoading] = useState(false);
	const [shouldLoadMore, setShouldLoadMore] = useState(false);
	const [allEvents, setAllEvents] = useState([] as IEvent[]);
	const [renderedEvents, setRenderedEvents] = useState([] as IEvent[]);
	const { coupon, setCoupon } = useContext(EventContext);
	const loader = useRef(null);
	const loadPortion = 20;

	useEffect(() => {
		setLoading(true);

		const options = {
			threshold: 1.0
		};
		const observer = new IntersectionObserver(() => {
			setLoading(true);
			setShouldLoadMore(true);
		}, options);

		if (loader.current) {
			// @ts-ignore
			observer.observe(loader.current);
		}

		import('../../bulten_data.json').then((bultenData: any) => {
			const entries = Object.values(bultenData.Events) as IEvent[];
			isMounted && setAllEvents(entries);
			isMounted &&
				setRenderedEvents([...entries.slice(0, entries.length > 100 ? 100 : entries.length)] as IEvent[]);
			isMounted && setLoading(false);
		});

		return () => {
			observer.disconnect();
		};
	}, []);

	useEffect(() => {
		if (shouldLoadMore) {
			const lastIndex = renderedEvents.length + loadPortion;
			const allEventsLength = allEvents.length;

			setRenderedEvents([
				...renderedEvents,
				...allEvents.slice(renderedEvents.length, allEventsLength > lastIndex ? lastIndex : allEventsLength)
			] as IEvent[]);
			setShouldLoadMore(false);
			setLoading(false);
		}
	}, [shouldLoadMore]);

	const onEventClick = (event: IEvent, keyOfType: string, keyOfRate: string) => {
		return () => {
			const rate = event?.OCG?.[keyOfType]?.OC?.[keyOfRate]?.O;

			if (rate) {
				const id = event?.C;
				const type = event?.TYPE;
				const match = event?.N;
				const mbs = event?.OCG?.[keyOfType]?.MBS;

				setCoupon((prevState: IEvent[]) => {
					const stateInd = prevState.findIndex((e) => e.id === id);

					if (~stateInd) {
						if (
							prevState[stateInd].keyOfType === keyOfType &&
							prevState[stateInd].keyOfRate === keyOfRate
						) {
							return prevState.filter((e) => e.id !== id);
						} else {
							const newState = [...prevState];
							newState[stateInd] = { ...newState[stateInd], keyOfType, keyOfRate, rate, mbs };
							return newState;
						}
					} else {
						return [...prevState, { id, rate, type, match, mbs, keyOfType, keyOfRate }];
					}
				});
			}
		};
	};

	const generateEventCell = (event: IEvent, keyOfType?: string, keyOfRate?: string) => {
		const rateValue = keyOfType && keyOfRate ? event?.OCG?.[keyOfType]?.OC?.[keyOfRate]?.O : '';
		const isSelected = coupon.find(
			(e) => event.C === e.id && e.keyOfType === keyOfType && e.keyOfRate === keyOfRate
		);

		return (
			<td
				className={`${rateValue ? 'event__content__selectable' : ''}${
					isSelected ? ' selectable--selected' : ''
				}`}
				role='button'
				onClick={keyOfType && keyOfRate && rateValue ? onEventClick(event, keyOfType, keyOfRate) : undefined}
			>
				{rateValue || '-'}
			</td>
		);
	};

	return (
		<div className='event-container'>
			<table>
				<thead>
					<tr>
						<th className='event--red'>{`Event Count: ${allEvents.length}`}</th>
						{columnHeaders.map(({ key, label }) => (
							<th key={key}>{label}</th>
						))}
					</tr>
				</thead>
				<tbody>
					{renderedEvents.map((event, index) => (
						<React.Fragment key={event.C}>
							<tr>
								<td className='event--red'>
									<span className='event--green'>{index}</span>
									{` ${event?.D} ${event?.T} ${event?.DAY} ${event?.LN}`}
								</td>
								{columnHeaders.map(({ key, label }) => (
									<td key={key}>{label}</td>
								))}
							</tr>
							<tr className='event__content'>
								<td>
									<span className='event__content__row-span'>{event?.C}</span>
									<span className='event__content__row-span'>{event?.T}</span>
									<span>{event?.N}</span>
								</td>
								<td>{'Yorumlar'}</td>
								<td>{event?.TYPE}</td>
								{generateEventCell(event, '1', '0')}
								{generateEventCell(event, '1', '1')}
								{generateEventCell(event, '1', '2')}
								{generateEventCell(event, '5', '25')}
								{generateEventCell(event, '5', '26')}
								{generateEventCell(event)}
								{generateEventCell(event)}
								{generateEventCell(event)}
								{generateEventCell(event)}
								{generateEventCell(event)}
								{generateEventCell(event, '2', '3')}
								{generateEventCell(event, '2', '5')}
								{generateEventCell(event, '2', '4')}
								{generateEventCell(event)}
								{generateEventCell(event)}
								{generateEventCell(event)}
							</tr>
						</React.Fragment>
					))}
				</tbody>
				<tfoot ref={loader}></tfoot>
			</table>
			<div className='event__loading'>{loading && 'Loading...'}</div>
		</div>
	);
}
