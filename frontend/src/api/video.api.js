// import axiosInstance from "./axiosInstance";

// export const uploadVideoApi = async (formData, onUploadProgress) => {
//   const res = await axiosInstance.post("/videos/upload", formData, {
//     headers: {
//       "Content-Type": "multipart/form-data"
//     },
//     onUploadProgress
//   });

//   return res.data;
// };

// export const getMyVideosApi = async () => {
//   const res = await axiosInstance.get("/videos");
//   return res.data;
// };


import axiosInstance from "./axiosInstance";

export const uploadVideoApi = async (formData, onUploadProgress) => {
  const res = await axiosInstance.post("/videos/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    },
    onUploadProgress
  });

  return res.data;
};

export const getMyVideosApi = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.status)      params.append("status",      filters.status);
  if (filters.sensitivity) params.append("sensitivity", filters.sensitivity);
  const query = params.toString() ? `?${params.toString()}` : "";

  const res = await axiosInstance.get(`/videos${query}`);
  return res.data;
};