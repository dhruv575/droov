import React from 'react';
import { Link } from 'react-router-dom';
import BlogData from '../Data/blogs.json';
import './BlogList.css';

const BlogList = () => {
  // Sort the blogs by date in descending order
  const sortedBlogs = BlogData.sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="blog-list-wrapper">
      <h2 className="title">Blog Posts</h2>
      <div className="blog-list">
        {sortedBlogs.map((blog, index) => (
          <div key={index} className="blog-preview">
            <Link to={`/blog/${blog.title.replace(/\s+/g, '-').toLowerCase()}`} className="blog-link">
              <img src={blog.image} alt={blog.title} className="blog-preview-image" />
              <div className="blog-preview-content">
                <h3>{blog.title}</h3>
                <p className="blog-date">{blog.date}</p>
                <p>{blog.description}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogList;
