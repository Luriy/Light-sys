import Axios from 'axios';
import { parsePythonArray } from '@/functions/helpers';
import { getAuthParams } from '@/functions/auth';
import { API_URL } from '@/constants';
import { parsePythonDataObject } from '@/functions/helpers';

export default {
	namespaced: true,
};
