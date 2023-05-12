import { Octokit } from "@octokit/rest";
import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box } from "@material-ui/core";
import Modal from '@material-ui/core/Modal';
const octokit = new Octokit({
  auth: process.env.TOKEN,
});
export default function Index() {
  const [FileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newContent, setNewContent] = useState("");

  useEffect(() => {
    setLoading(true);
    octokit.repos
      .getContent({
        owner: "bhavin1993",
        repo: "testRepo",
        // path: "src/components"
      })
      .then(response => {
        setFileList(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  const handleDelete = async ({fileName}) => {
    try {
      const response = await getFileByName({ fileName });
      await octokit.repos.deleteFile({
        owner: "bhavin1993",
        repo: "testRepo",
        path: fileName,
        message: "Delete file",
        sha: response.data.sha,
      });
      console.log("🚀 ~ file: index.js:42 ~ handleDelete ~ response:", response.data)
      // setFileList(prevFileList => prevFileList.filter(file => file.name !== fileName));

      return { data: response.data, error: null };
    } catch (error) {
      console.error(error);
      return { data: null, error: error };
    }
  };
  const updateFile = async ({ fileName, content, sha }) => {
    try {
      const response = await octokit.repos.createOrUpdateFileContents({
        owner: "bhavin1993",
        repo: "testRepo",
        path: fileName,
        message: "Update file",
        content: Buffer.from(content).toString("base64"),
        sha: sha,
      });
      // setIsEditModalOpen(false)
      return { data: response.data, error: null };
    } catch (error) {
      console.error(error);
      return { data: null, error: error };
    }
  };
  const getFileByName = async ({ fileName }) => {
    try {
      const response = await octokit.repos.getContent({
        owner: "bhavin1993",
        repo: "testRepo",
        path: fileName,
      });
      return { data: response.data, error: null };
    } catch (error) {
      console.error(error);
      return { data: null, error: error };
    }
  };
  const handleOpenModal = async (file) => {
    setSelectedFile(file);
    const response = await getFileByName({ fileName: file.name });
    if (response?.data?.content) {
      let decodedContent;
      try {
        decodedContent = atob(response.data.content);
      } catch (e) {
        console.error('Invalid Base64 string:', response.data.content);
        return;
      }
      const newContent = decodeURIComponent(escape(decodedContent));
      setNewContent(newContent);
      setIsEditModalOpen(true);
  
      // Update the file content and retrieve the new sha value
      const updateResponse = await updateFile({ fileName: file.name, content: decodedContent, sha: response?.data?.sha });
      const newSha = updateResponse?.sha;
  
      // Pass the new sha value to the getFileByName function
      const newResponse = await getFileByName({ fileName: file.name, sha: newSha });
      if (newResponse?.data?.content) {
        let newDecodedContent;
        try {
          newDecodedContent = atob(newResponse.data.content);
        } catch (e) {
          console.error('Invalid Base64 string:', newResponse.data.content);
          return;
        }
        const newContent = decodeURIComponent(escape(newDecodedContent));
        setNewContent(newContent);
      }
    } else {
      console.error('Missing content in response:', response);
    }
  };
  
  const handleCloseModal = async () => {
    setIsEditModalOpen(false)
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
            {FileList?.filter((file) => file.type !== 'dir').map((file) => (
              <TableRow key={file.name}>
                <TableCell component="th" scope="row" style={{ fontWeight: 'bold' }}>
                  {file.name}
                </TableCell>
                <TableCell align="center">
                  <Box style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                    <Button
                      variant="contained"
                      style={{ background: '#ff5722', color: '#fff' }}
                      onClick={() => handleDelete({fileName:file.name})}
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
            <Button onClick={() => {
              updateFile({
                fileName: selectedFile.name,
                content: newContent,
                sha: selectedFile.sha
              })
            }
            } variant="contained"
              style={{ background: '#4caf50', color: '#fff', marginRight: "10px", fontWeight: 'bold' }}>
              Save
            </Button>
            <Button onClick={handleCloseModal} variant="contained"
              style={{ background: '#ff5722', color: '#fff', marginRight: "10px", fontWeight: 'bold' }}>Cancel</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
