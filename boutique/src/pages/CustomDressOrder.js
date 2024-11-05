// import React, { useState, useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { Card, Button, Typography, Box, AppBar, Toolbar, Tabs, Tab, IconButton } from '@mui/material';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// const CustomDressOrder = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [selectedFabric, setSelectedFabric] = useState(null);
//   const [selectedColor, setSelectedColor] = useState(null);
//   const [selectedStyle, setSelectedStyle] = useState(null);
//   const [value, setValue] = useState(0);

//   useEffect(() => {
//     if (location.state) {
//       setSelectedFabric(location.state.selectedFabric);
//       setSelectedColor(location.state.selectedColor);
//       setSelectedStyle(location.state.selectedStyle);
//     }
//   }, [location.state]);

//   // Navigate to specific pages when tabs are clicked
//   const handleNavigate = (page) => navigate(page);

//   const handleTabChange = (event, newValue) => {
//     setValue(newValue);
//     switch (newValue) {
//       case 0:
//         handleNavigate('/fabric-selection'); // Navigates to Fabric Selection page
//         break;
//       case 1:
//         handleNavigate('/color-selection');
//         break;
//       case 2:
//         handleNavigate('/dress-style-selection');
//         break;
//       case 3:
//         handleNavigate('/measurements-input');
//         break;
//       default:
//         break;
//     }
//   };
  

//   const handleSubmit = () => alert('Order has been placed!');

//   return (
//     <Box
//       sx={{
//         fontFamily: "'Roboto', sans-serif",
//         backgroundImage: `url(${require('../assets/bg1.jpg')})`,
//         backgroundSize: 'cover',
//         backgroundPosition: 'center',
//         minHeight: '100vh',
//         display: 'flex',
//         flexDirection: 'column',
//         position: 'relative',
//         '&::before': {
//           content: '""',
//           position: 'absolute',
//           top: 0,
//           left: 0,
//           right: 0,
//           bottom: 0,
//           backgroundColor: 'rgba(0, 0, 0, 0.5)',
//           zIndex: 1,
//         },
//         zIndex: 2,
//       }}
//     >
//       {/* Header with Back Button and Navigation Tabs */}
//       <AppBar position="static" sx={{ backgroundColor: '#ffffffaa', zIndex: 3 }}>
//         <Toolbar>
//           <IconButton
//             edge="start"
//             color="inherit"
//             aria-label="back"
//             onClick={() => navigate(-1)}
//             sx={{ mr: 2, color: '#ff3e6c' }}
//           >
//             <ArrowBackIcon />
//           </IconButton>
//           <Typography variant="h6" sx={{ flexGrow: 1 }}>
//             Customize Your Dress
//           </Typography>
//           <Tabs
//             value={value}
//             onChange={handleTabChange}
//             textColor="inherit"
//             indicatorColor="secondary"
//             aria-label="navigation tabs"
//             sx={{ color: '#000' }}
//           >
//             <Tab label="Fabric Selection" />
//             <Tab label="Color Selection" />
//             <Tab label="Dress Style" />
//             <Tab label="Measurements" />
//           </Tabs>
//         </Toolbar>
//       </AppBar>

//       {/* Main Content */}
//       <Box sx={{ zIndex: 3, maxWidth: '600px', width: '100%', margin: 'auto', padding: 4 }}>
//         {selectedFabric && (
//           <Card sx={{ padding: 2, mb: 2, backgroundColor: '#ffffffaa', borderRadius: '10px', boxShadow: 3 }}>
//             <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Fabric Selected: {selectedFabric.name}</Typography>
//           </Card>
//         )}

//         {selectedColor && (
//           <Card sx={{ padding: 2, mb: 2, backgroundColor: '#ffffffaa', borderRadius: '10px', boxShadow: 3 }}>
//             <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
//               Color Selected: <span style={{ color: selectedColor }}>● {selectedColor}</span>
//             </Typography>
//           </Card>
//         )}

//         {selectedStyle && (
//           <Card sx={{ padding: 2, mb: 2, backgroundColor: '#ffffffaa', borderRadius: '10px', boxShadow: 3 }}>
//             <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Dress Style Selected: {selectedStyle.name}</Typography>
//           </Card>
//         )}

//         {/* Place Order Button */}
//         <Card sx={{ padding: 2, mt: 4, borderRadius: '10px', boxShadow: 3 }}>
//           <Button
//             variant="contained"
//             color="secondary"
//             onClick={handleSubmit}
//             fullWidth
//             sx={{
//               padding: '15px',
//               fontSize: '16px',
//               fontWeight: 'bold',
//               textTransform: 'none',
//               backgroundColor: '#ff3e6c',
//               '&:hover': { backgroundColor: '#ff6297' },
//               borderRadius: '25px',
//               boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
//             }}
//           >
//             Place Order
//           </Button>
//         </Card>
//       </Box>
//     </Box>
//   );
// };

// export default CustomDressOrder;
