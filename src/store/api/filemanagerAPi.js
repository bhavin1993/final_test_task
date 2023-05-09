import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const filemanagerAPI = createApi({
    reducerPath: "filemanagerAPI",
    baseQuery: fetchBaseQuery({
      baseUrl: `https://api.github.com/repos/bhavin1993/test_task`,
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
        async onCacheEntryAdded(
          cacheKey,
          { data, error, queryFulfilledTimestamp }
        ) {
          if (queryFulfilledTimestamp) {
            const [file] = cacheKey.queryArgs;
            const deletedFileName = file?.fileName;
            if (deletedFileName && data) {
              // If a file was deleted, filter it out of the response data
              const updatedData = data.filter(
                (file) => file.name !== deletedFileName
              );
              // Return the updated data
              return { data: updatedData };
            }
          }
          return { data, error };
        },
        providesTags: (result) =>
          result
            ? [
                ...result.map(({ name }) => ({
                  type: "Filemanager",
                  id: name,
                })),
                { type: "Filemanager", id: "LIST" },
              ]
            : [{ type: "Filemanager", id: "LIST" }],
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
        invalidatesTags: ["Filemanager"],
        async onQueryStarted(
          { fileName },
          { dispatch, queryFulfilled, queryRejected }
        ) {
          try {
            // Wait for the delete mutation to complete
            await queryFulfilled;
            // Refetch the file list after deleting the file
            await dispatch(filemanagerAPI.endpoints.getFiles.initiate());
          } catch (error) {
            await queryRejected(error);
          }
        },
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
  