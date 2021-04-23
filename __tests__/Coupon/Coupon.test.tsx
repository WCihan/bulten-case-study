import { act, cleanup, render } from '@testing-library/react';
import Coupon from '../../src/Coupon/Coupon';

afterEach(cleanup);

describe('Coupon', () => {
	test('renders Coupon component', () => {
		act(() => {
			const { container } = render(<Coupon />);
			expect(container.childNodes.length).toEqual(0);
		});
	});
});
