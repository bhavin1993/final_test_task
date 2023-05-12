import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box } from "@material-ui/core";
import Modal from '@material-ui/core/Modal';
import {
  useDeleteFileMutation,
  useGetFileByNameMutation,
  useGetFilesQuery,
  useUpdateFileMutation
} from "@store/api/filemanagerAPi";

const HomePage = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newContent, setNewContent] = useState("");
  const { data: fileMangerData } = useGetFilesQuery();
  const [deleteFile] = useDeleteFileMutation();
  const [getFileByName] = useGetFileByNameMutation();
  // const [updateFile] = useUpdateFileMutation();
  const [updateFile, { isLoading, isError, error }] = useUpdateFileMutation();
  // const getfilesData = useSelector(getFilesData)
  useEffect(() => {
    setFiles(fileMangerData);
  }, [fileMangerData]);

  const handleDelete = async (fileName, sha) => {
    try {
      await deleteFile({ fileName, sha });
      const updatedFiles = files.filter((file) => file.name !== fileName);
      setFiles(updatedFiles);
    } catch (error) {
      console.error(error.response.data);
    }
  };
  const handleCloseModal = async () => {
    setIsEditModalOpen(false)
  };

  const handleSave = async () => {
    try {
      const getFileResponse = await getFileByName({ fileName: selectedFile.name });
      const latestSha = getFileResponse.data.sha;

      // Update file using mutation
      const updateResponse = await updateFile({
        fileName: selectedFile.name,
        sha: latestSha,
        content: newContent,
      });
      console.log("Update response", updateResponse);

      // If update successful, update state and close edit modal
      if (!updateResponse.error) {
        const updatedFile = {
          name: selectedFile.name,
          content: newContent,
          sha: updateResponse.data.sha,
        };
        setFiles(
          fileMangerData.map((file) =>
            file.name === selectedFile.name ? updatedFile : file
          )
        );
        setSelectedFile(updatedFile);
        setNewContent(updatedFile.content);
        console.log("🚀 ~ file: index.js:68 ~ handleSave ~ updatedFile.content:", updatedFile.content)
      }
      setIsEditModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenModal = async (file) => {
    setSelectedFile(file);
    const response = await getFileByName({ fileName: file.name });
    const decodedContent = decodeURIComponent(escape(atob(response?.data?.content)));
    setNewContent(decodedContent);
    setIsEditModalOpen(true);
  };
  return (
    <div>
      <TableContainer component={Paper}>
        <Table style={{ maxWidth: '70%', margin: '0 auto', border: '1px solid #818181de' }}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell style={{ width: '40%' }} align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {files?.filter((file) => file.type !== 'dir').map((file) => (
              <TableRow key={file.name}>
                <TableCell component="th" scope="row" style={{ fontWeight: 'bold' }}>
                  {file.name}
                </TableCell>
                <TableCell align="center">
                  <Box style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                    <Button
                      variant="contained"
                      style={{ background: '#ff5722', color: '#fff' }}
                      onClick={() => handleDelete(file.name, file.sha)}
                    >Delete</Button>
                    <Button
                      variant="contained"
                      style={{ background: '#4caf50', color: '#fff' }}
                      onClick={() => handleOpenModal(file)}
                    >Edit</Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Modal open={isEditModalOpen} onClose={handleCloseModal}>
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            margin: "auto",
            width: "512px",
            height: "400px",
            padding: "20px",
            background: "#fff",
            borderRadius: "5px",
            boxShadow: "0 0 10px rgba(0,0,0,.3)",
          }}
        >
          <h2>Edit file: {selectedFile && selectedFile.name}</h2>
          <textarea
            style={{
              width: "100%",
              height: "300px",
              fontSize: "16px",
              lineHeight: "1.5",
              border: "1px solid #ccc",
              borderRadius: "5px",
              resize: "vertical",
            }}
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
          ></textarea>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Button onClick={handleSave} variant="contained"
              style={{ background: '#4caf50', color: '#fff', marginRight: "10px", fontWeight: 'bold' }}>
              Save
            </Button>
            <Button onClick={handleCloseModal} variant="contained"
              style={{ background: '#ff5722', color: '#fff', marginRight: "10px", fontWeight: 'bold' }}>Cancel</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default HomePage;