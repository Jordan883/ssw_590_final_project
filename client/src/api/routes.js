import {base} from './baseURL';

export const login = (data) => {
    return base.post(`/api/user/login`, data);
}

export const register = (data) => {
    return base.post(`/api/user/signup`, data);
}

export const createPost = (data) => {
    return base.post(`/api/posts/`, data);
}

export const getAllPosts = () => {
    return base.get('/api/posts/');
}