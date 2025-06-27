import React, { useState, useEffect } from "react";
import { useVendor } from "../../../contexts/VendorContext";

const AddProductForm = ({ onClose, product }) => {
  const { vendors } = useVendor();
  const categories = product.category;
  const tags = product.tags;
  const [formData, setFormData] = useState({
    title: "",
    main_image: null,
    additional_images: [],
    description: "",
    vendor: "",
    category: "",
    tags: [],
    price: "",
    old_price: "",
    specifications: "",
    product_status: "in_review",
    stock_quantity: 0,
    featured: false,
    digital: false,
    discount_percentage: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData({
        ...formData,
        [name]: checked,
      });
    } else if (name === "tags") {
      // Handle tags as multiple selections
      const selectedTags = Array.from(
        e.target.selectedOptions,
        (option) => option.value
      );
      setFormData({
        ...formData,
        tags: selectedTags,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      main_image: e.target.files[0],
    });
  };

  const handleMultipleFileChange = (e) => {
    setFormData({
      ...formData,
      additional_images: Array.from(e.target.files),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    for (const key in formData) {
      if (key === "tags" || key === "additional_images") {
        // For tags and additional images (array), append each individually
        formData[key].forEach((item) => formDataToSend.append(key, item));
      } else {
        formDataToSend.append(key, formData[key]);
      }
    }
    // onSubmit(formDataToSend);
  };

  return (
    <form encType="multipart/form-data">
      <span onClick={onclose}>❌</span>
      <div>
        <label>Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Main Image</label>
        <input
          type="file"
          name="main_image"
          onChange={handleFileChange}
          accept="image/*"
          required
        />
      </div>

      <label>Additional</label>
      <div>
        <label>Additional Images</label>
        <input
          type="file"
          name="additional_images"
          onChange={handleMultipleFileChange}
          accept="image/*"
          multiple
        />
      </div>

      <div>
        <label>Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Vendor</label>
        <select
          name="vendor"
          value={formData.vendor}
          onChange={handleChange}
          required
        >
          <option value="">Select Vendor</option>
          {vendors.map((vendor) => (
            <option key={vendor.id} value={vendor.id}>
              {vendor.title}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Category</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.title}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Tags</label>
        <select
          name="tags"
          multiple
          value={formData.tags}
          onChange={handleChange}
          required
        >
          {tags.map((tag) => (
            <option key={tag.id} value={tag.id}>
              {tag.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Price</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Old Price</label>
        <input
          type="number"
          name="old_price"
          value={formData.old_price}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Specifications</label>
        <textarea
          name="specifications"
          value={formData.specifications}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Product Status</label>
        <select
          name="product_status"
          value={formData.product_status}
          onChange={handleChange}
          required
        >
          <option value="in_review">In Review</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div>
        <label>Stock Quantity</label>
        <input
          type="number"
          name="stock_quantity"
          value={formData.stock_quantity}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Featured</label>
        <input
          type="checkbox"
          name="featured"
          checked={formData.featured}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Digital</label>
        <input
          type="checkbox"
          name="digital"
          checked={formData.digital}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Discount Percentage</label>
        <input
          type="number"
          name="discount_percentage"
          value={formData.discount_percentage}
          onChange={handleChange}
          step="0.01"
        />
      </div>

      <button type="submit">Add Product</button>
    </form>
  );
};

export default AddProductForm;
