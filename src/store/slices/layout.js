import { createSlice } from "@reduxjs/toolkit";

export const filesSlice = createSlice({
    name:"files",
    initialState:{
      filesData:[]
    },
    reducers:{
        saveFilesData:(state,action)=>{
            state.filesData = action.payload
        },
        deleteFileData: (state, action) => {
            const { fileName } = action.payload;
            const updatedFilesData = state.filesData.filter(
              (file) => file.name !== fileName
            );
            state.filesData = updatedFilesData;
          },
    },
    devTools:true
});

export const { saveFilesData,deleteFileData } = filesSlice.actions;
export const getFilesData = (state)=>state.files.filesData;
