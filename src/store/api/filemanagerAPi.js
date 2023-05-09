import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const filemanagerAPI = createApi({
    reducerPath: "filemanagerAPI",
    baseQuery: fetchBaseQuery({
      baseUrl: 'https://api.github.com/repos/bhavin1993/test_task/',
      headers: {
        Authorization: `Bearer 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`,
      },
    }),
    tagTypes: ["Filemanager"],
    endpoints: (builder) => ({
      getFiles: builder.query({
        query: () => ({
          url: `/contents/`,
          method: "GET",
        }),
      }),
      deleteFile: builder.mutation({
        query: ({ fileName, sha }) => ({
          url: `/contents/${fileName}`,
          method: "DELETE",
          body: {
            message: "Delete file",
            sha: sha,
          },
        }),
      }),
      getFileByName: builder.mutation({
        query: (params) => ({
          url: `/contents/${params.fileName}`,
          method: "GET",
        }),
      }),
      updateFile: builder.mutation({
        query: (params) => ({
          url: `/contents/${params.fileName}`,
          method: "PUT",
          body: {
            message: "Update file",
            sha: params.sha,
            content: params.content,
          },
        }),
      }),
    }),
  });
  
  export const {
    useGetFilesQuery,
    useDeleteFileMutation,
    useGetFileByNameMutation,
    useUpdateFileMutation,
  } = filemanagerAPI;
  