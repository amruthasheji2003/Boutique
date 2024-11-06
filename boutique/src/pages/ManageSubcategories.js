import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components'; // Import styled-components

const ManageSubcategoriesContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  text-align: center;
  color: #333;
`;

const CategorySelect = styled.div`
  margin-bottom: 20px;
`;

const CategoryLabel = styled.label`
  font-weight: bold;
  margin-right: 10px;
`;

const Select = styled.select`
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
`;

const AddSubcategoryContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const InputField = styled.input`
  flex: 1;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
  margin-right: 10px;
`;

const AddButton = styled.button`
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const SubcategoryList = styled.div`
  margin-top: 20px;
`;

const SubcategoryItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 10px;
  background-color: #fff;
`;

const DeleteButton = styled.button`
  padding: 5px 10px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #c82333;
  }
`;

const ErrorMessage = styled.p`
  color: #dc3545;
  text-align: center;
  margin-bottom: 20px;
`;

const ManageSubcategories = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [subcategories, setSubcategories] = useState({});
  const [newSubcategory, setNewSubcategory] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true); // To track loading state

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://boutique-backend-j6re.onrender.com/api/categories');
        setCategories(response.data); // Assume response.data is an array of category objects
        if (response.data.length > 0) {
          setSelectedCategory(response.data[0]._id); // Set the first category as selected
        }
      } catch (err) {
        setError('Error fetching categories');
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchSubcategories = async (category) => {
      if (!category) {
        setSubcategories([]); // Clear subcategories if no category is selected
        return;
      }
  
      try {
        const response = await axios.get(`https://boutique-backend-j6re.onrender.com/api/subcategories/${category}`);
  
        console.log('Subcategories response:', response.data); // Log the response data
  
        if (Array.isArray(response.data)) {
          setSubcategories((prevState) => ({
            ...prevState,
            [category]: response.data, // Store the subcategories with the selected category as key
          }));
        } else {
          console.error('Unexpected subcategories data format:', response.data);
          setError('Error fetching subcategories');
        }
      } catch (error) {
        console.error('Error fetching subcategories:', error);
        setError('Error fetching subcategories');
      }
    };
  
    fetchSubcategories(selectedCategory); // Pass the selectedCategory to the function
  }, [selectedCategory]);
  
  // Handle Category Change
  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  // Add Subcategory
  const handleAddSubcategory = async () => {
    if (newSubcategory.trim() === '') return;

    try {
      const response = await axios.post('https://boutique-backend-j6re.onrender.com/api/subcategories', {
        name: newSubcategory,
        category: selectedCategory,
      });

      // Update subcategories state with the new subcategory
      setSubcategories((prevState) => {
        const currentSubcategories = prevState[selectedCategory] || [];
        return {
          ...prevState,
          [selectedCategory]: [...currentSubcategories, response.data], // Store full subcategory object
        };
      });

      setNewSubcategory(''); // Clear the input after adding
    } catch (err) {
      setError('Error adding subcategory');
    }
  };

  // Delete Subcategory
  const handleDeleteSubcategory = async (subcategoryId) => {
    try {
      await axios.delete(`https://boutique-backend-j6re.onrender.com/api/subcategories/${subcategoryId}`);
      
      setSubcategories((prevState) => ({
        ...prevState,
        [selectedCategory]: prevState[selectedCategory].filter(
          (sub) => sub._id !== subcategoryId // Filter out the deleted subcategory by ID
        ),
      }));
    } catch (err) {
      setError('Error deleting subcategory');
    }
  };

  if (loading) {
    return <p>Loading...</p>; // Optional loading indicator
  }

  return (
    <ManageSubcategoriesContainer>
      <Title>Manage Subcategories</Title>

      {/* Error message */}
      {error && <ErrorMessage>{error}</ErrorMessage>}

      {/* Select Category */}
      <CategorySelect>
        <CategoryLabel>Select Category: </CategoryLabel>
        <Select value={selectedCategory} onChange={handleCategoryChange}>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name} {/* Display category name */}
            </option>
          ))}
        </Select>
      </CategorySelect>

      {/* Add Subcategory */}
      <AddSubcategoryContainer>
        <h3>Manage Subcategories for {selectedCategory}</h3>
        <InputField
          type="text"
          placeholder="Enter new subcategory"
          value={newSubcategory}
          onChange={(e) => setNewSubcategory(e.target.value)}
        />
        <AddButton onClick={handleAddSubcategory}>Add Subcategory</AddButton>
      </AddSubcategoryContainer>

      {/* Subcategory List */}
      <SubcategoryList>
        <h4>Existing Subcategories</h4>
        <ul>
          {(subcategories[selectedCategory] || []).map((subcategory) => (
            <SubcategoryItem key={subcategory._id}>
              {subcategory.name} {/* Display the name of the subcategory */}
              <DeleteButton onClick={() => handleDeleteSubcategory(subcategory._id)}>
                Delete
              </DeleteButton>
            </SubcategoryItem>
          ))}
        </ul>
        {/* Show a message if there are no subcategories */}
        {(subcategories[selectedCategory] || []).length === 0 && (
          <p>No subcategories available.</p>
        )}
      </SubcategoryList>
    </ManageSubcategoriesContainer>
  );
};

export default ManageSubcategories;
