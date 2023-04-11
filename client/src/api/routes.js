import {base} from './baseURL';

export const login = (data) => {
    return base.post(`/user/login`, data);
}