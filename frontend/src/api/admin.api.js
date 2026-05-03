import axiosInstance from "./axiosInstance";

export const getAllVideosApi = () =>
  axiosInstance.get("/videos/admin/videos").then(r => r.data);

export const getAllUsersApi = () =>
  axiosInstance.get("/videos/admin/users").then(r => r.data);

export const assignVideoApi = (videoId, userIds) =>
  axiosInstance.put(`/videos/${videoId}/assign`, { userIds }).then(r => r.data);