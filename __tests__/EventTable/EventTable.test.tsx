import { act, cleanup, render } from '@testing-library/react';
import EventTable from '../../src/EventTable/EventTable';
import '../../__mocks__/intersectionObserverMock';

afterEach(cleanup);

describe('EventTable test', () => {
	test('renders EventTable component', () => {
		act(() => {
			const { container } = render(<EventTable />);
			const tbody = container.querySelector('tbody');
			expect(tbody?.childNodes.length).toBeGreaterThan(0);
		});
	});
});
