import { Fragment, useContext, useEffect, useRef, useState } from 'react';
import EventContext, { TEvent } from '../context/EventContext';
import useIsMounted from '../hooks/useIsMounted';
import './EventTable.scss';

export interface IBultenJson {
	Events?: TEvent[];
	default?: unknown;
}

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
	const [allEvents, setAllEvents] = useState([] as TEvent[]);
	const [renderedEvents, setRenderedEvents] = useState([] as TEvent[]);
	const { coupon, setCoupon } = useContext(EventContext);
	const loader = useRef({} as HTMLTableSectionElement);
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
			observer.observe(loader.current);
		}

		import('../../bulten_data.json').then((bultenData: IBultenJson) => {
			const entries = Object.values(bultenData?.Events || []) as TEvent[];
			isMounted.current && setAllEvents(entries);
			isMounted.current &&
				setRenderedEvents([...entries.slice(0, entries.length > 100 ? 100 : entries.length)] as TEvent[]);
			isMounted.current && setLoading(false);
		});

		return () => {
			observer.disconnect();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (shouldLoadMore) {
			const lastIndex = renderedEvents.length + loadPortion;
			const allEventsLength = allEvents.length;

			setRenderedEvents([
				...renderedEvents,
				...allEvents.slice(renderedEvents.length, allEventsLength > lastIndex ? lastIndex : allEventsLength)
			] as TEvent[]);
			setShouldLoadMore(false);
			setLoading(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [shouldLoadMore]);

	const onEventClick = (event: TEvent, keyOfType: string, keyOfRate: string) => {
		return () => {
			const rate = event?.OCG?.[keyOfType]?.OC?.[keyOfRate]?.O;

			if (rate) {
				const id = event?.C;
				const type = event?.TYPE;
				const match = event?.N;
				const mbs = event?.OCG?.[keyOfType]?.MBS;

				setCoupon((prevState: TEvent[]) => {
					const stateInd = prevState.findIndex((e) => e.id === id);

					if (stateInd !== -1) {
						if (
							prevState[stateInd].keyOfType === keyOfType &&
							prevState[stateInd].keyOfRate === keyOfRate
						) {
							return prevState.filter((e) => e.id !== id);
						}
						const newState = [...prevState];
						newState[stateInd] = { ...newState[stateInd], keyOfType, keyOfRate, rate, mbs };
						return newState;
					}
					return [...prevState, { id, rate, type, match, mbs, keyOfType, keyOfRate }];
				});
			}
		};
	};

	const generateEventCell = (event: TEvent, keyOfType?: string, keyOfRate?: string) => {
		const rateValue = keyOfType && keyOfRate ? event?.OCG?.[keyOfType]?.OC?.[keyOfRate]?.O : '';
		const isSelected = coupon.find(
			(e) => event.C === e.id && e.keyOfType === keyOfType && e.keyOfRate === keyOfRate
		);

		return keyOfType && keyOfRate && rateValue ? (
			<td
				className={`event__content__selectable${isSelected ? ' selectable--selected' : ''}`}
				role='button'
				onClick={onEventClick(event, keyOfType, keyOfRate)}
				tabIndex={0}
				onKeyDown={({ key }) => key === 'Enter' && onEventClick(event, keyOfType, keyOfRate)()}
			>
				{rateValue}
			</td>
		) : (
			<td className={`${isSelected ? ' selectable--selected' : ''}`}>{rateValue || '-'}</td>
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
						<Fragment key={event.C}>
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
						</Fragment>
					))}
				</tbody>
				<tfoot ref={loader} />
			</table>
			<div className='event__loading'>{loading && 'Loading...'}</div>
		</div>
	);
}
