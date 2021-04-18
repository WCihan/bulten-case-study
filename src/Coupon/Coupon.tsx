import React, { useContext } from 'react';
import EventContext from '../context/EventContext';
import './Coupon.scss';

export default function Coupon() {
	const { coupon } = useContext(EventContext);
	const totalRate = coupon
		.map((c) => parseFloat(c.rate))
		.reduce((prev, next) => prev * next, 1)
		.toFixed(2);

	return (
		<>
			{coupon.length > 0 && (
				<div className='coupon-container'>
					{coupon.map(({ id, type, match, rate, mbs }) => (
						<div className='coupon__row' key={id}>
							<div className='coupon__row__item'>
								<span>{type}</span>
								<span>{`Kod: ${id}`}</span>
								<span>{`Maç: ${match}`}</span>
							</div>
							<div className='coupon__row__item'>
								<span>{`Oran: ${rate}`}</span>
								<span>{`MBS: ${mbs}`}</span>
							</div>
						</div>
					))}
					<div className='coupon__row row--total'>{`Toplam: ${totalRate}`}</div>
				</div>
			)}
		</>
	);
}
