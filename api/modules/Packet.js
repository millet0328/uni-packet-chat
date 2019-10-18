import app from '../../common/ajax.js';

const release = (data) => app.get('/api.php', data);

export default {
	release,
}
