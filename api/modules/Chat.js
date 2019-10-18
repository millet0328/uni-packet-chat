import app from '../../common/ajax.js';

const verify = (data) => app.get('/api.php', data);

const history = (data) => app.get('/Return', data);

export default {
	verify,
	history
}
