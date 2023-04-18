import {base} from './baseURL';

export const login = (data) => {
    return base.post(`/user/login`, data);
}

export const register = (data) => {
    return base.post(`/user/signup`, data);
}

export const createPost = (data) => {
    return base.post(`/posts/`, data);
}

export const getAllPosts = () => {
    return base.get('/posts/');
}