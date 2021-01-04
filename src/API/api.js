import axios from './http'
import qs from 'qs'

var getCity = function (data) {
	return axios.post('/area/get-province-list', getJson(data))
}
export{
	getCity
}

function getJson (data) {
	return qs.stringify(data)
}
