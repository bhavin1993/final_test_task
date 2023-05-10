import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const filemanagerAPI = createApi({
  reducerPath: "filemanagerAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api.github.com',
    headers: {
      Authorization: `Bearer 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`,
    },
  }),
  tagTypes: ["Filemanager"],
  endpoints: (builder) => ({
    getFiles: builder.query({
      query: () => ({
        url: `/repos/bhavin1993/testRepo/contents/`,
        method: "GET",
      }),
    }),
    deleteFile: builder.mutation({
      query: ({ fileName, sha }) => ({
        url: `/repos/bhavin1993/testRepo/contents/${fileName}`,
        method: "DELETE",
        body: {
          message: "Delete file",
          sha: sha,
        },
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json, text/plain, */*",
          "Authorization": `Bearer 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`,
        },
        mode: "cors",
        cache: "no-cache",
      }),
    }),
    getFileByName: builder.mutation({
      query: (params) => ({
        url: `/repos/bhavin1993/testRepo/contents/${params.fileName}`,
        method: "GET",
        skipCache: true, // add this option to force fetch from the server
      }),
    }),
    updateFile: builder.mutation({
      query: ({ fileName, sha, content }) => {
        const data = {
          message: "Update file",
          sha: sha,
          content: btoa(content),
        };
        return {
          url: `/repos/bhavin1993/testRepo/contents/${fileName}`,
          method: "PUT",
          body: data,
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json, text/plain, */*",
            "Authorization": `Bearer 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`,
          },
          mode: "cors",
          cache: "no-cache",
        };
      },
      onError: (error, { getState }) => {
        console.error("Failed to update file:", error);
      },
      onSuccess: (data, { getState }) => {
        console.log("File updated successfully:", data);
      },
    }),
  }),
});

export const {
  useGetFilesQuery,
  useUpdateFileMutation,
  useDeleteFileMutation,
  useGetFileByNameMutation,
} = filemanagerAPI;
