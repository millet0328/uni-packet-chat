import app from '../../common/ajax.js';

const login = (data) => app.get('/login', data);

const recommend = (data) => app.get('/Return', data);

export default {
	login,
	recommend
}
