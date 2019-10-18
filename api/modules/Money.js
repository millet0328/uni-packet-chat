import app from '../../common/ajax.js';

const balance = (data) => app.get('/Return', data);

export default {
	balance,
}
