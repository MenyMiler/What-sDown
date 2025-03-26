/* eslint-disable no-param-reassign */
import axiosInstance from 'axios';

export const axios = axiosInstance.create({ withCredentials: true });

axios.interceptors.request.use((config) => {
    if (config) {
        const token =
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlNTY4ODMyNDIwM2ZjNDAwNDM1OTFhYSIsImFkZnNJZCI6InQyMzQ1ODc4OXNoQGplbGxvIiwiZ2VuZXNpc0lkIjoiNWU1Njg4MzI0MjAzZmM0MDA0MzU5MWFhIiwibmFtZSI6eyJmaXJzdE5hbWUiOiLXoNeZ15nXp9eZIiwibGFzdE5hbWUiOiLXkNeT15nXk9ehIn0sImVtYWlsIjoidDIzNDU4Nzg5QGplbGxvLmNvbSIsImRpc3BsYXlOYW1lIjoidDIzNDU4Nzg5QGplbGxvLmNvbSIsInVwbiI6InQyMzQ1ODc4OUBqZWxsby5jb20iLCJwcm92aWRlciI6IkdlbmVzaXMiLCJlbnRpdHlUeXBlIjoiZGlnaW1vbiIsImpvYiI6ImdvaW5nIHRvIHNvbWV0aGluZyBncmF0ZSIsInBob25lTnVtYmVycyI6WyIwMjY2NjY5OTgiLCIwNTIxMjM0NTY1Il0sImNsZWFyYW5jZSI6IjAiLCJwaG90byI6Imh0dHA6Ly9ub3Qtc3VwcG9ydGVkLW91dHNpZGUtYnkta2FydG9mZmVsIiwiaWF0IjoxNjY0NDQ1MzQ0LCJleHAiOjE5OTk5OTk5OTk5OTl9.ckvBn0eLIB_5Q0kNJA-3GBuxrmimCYB_xGES0h6h0oA';
        config.headers!.Authorization = `Bearer ${token}`;
    }
    return config;
}, Promise.reject);
